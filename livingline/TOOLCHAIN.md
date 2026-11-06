# TOOLCHAIN — Living Line Animation Studio

All verified on 2026-11-06 in this container (Linux x64, 4 CPU, 15 GB RAM, Node 22.23.4).
Project dependencies are local to `livingline/` (`npm ci` restores them).

| Tool | Version | Source | License | Role | Verified |
|---|---|---|---|---|---|
| HyperFrames CLI | 0.9.19 (npm `hyperframes`, pinned) | github.com/heygen-com/hyperframes | Apache-2.0 | Master timeline, check, snapshot, render | `doctor`, `check`, 2× render |
| HyperFrames skills | core set: hyperframes, hyperframes-cli, hyperframes-registry, media-use | `npx hyperframes skills update` → `~/.claude/skills` | Apache-2.0 | Agent contract + work loop | installed, read |
| GSAP | 3.15.1 | npm `gsap` | GSAP standard "no charge" license | Timed tweens / camera | smoke render |
| p5.js | 2.3.4 | npm `p5` | LGPL-2.1 | Procedural drawing host | smoke render |
| p5.brush | 3.0.0 | npm `p5.brush` | MIT | Painted textures (fog, breath, grain) | smoke render (see caveat) |
| three.js | r187 (0.187.0) | npm `three` | MIT | Fabric/tent-wall mesh displacement | smoke render |
| Playwright | 1.63.0 | npm, uses preinstalled Chromium | Apache-2.0 | Browser inspection | installed |
| FFmpeg / ffprobe | 6.1.1 | system (`/usr/bin`) | LGPL/GPL | Encode, mix, probe, QA | used throughout |
| Chrome | system `/usr/bin/google-chrome` | system | — | HyperFrames capture | `doctor` ✓ |
| numpy | system Python | PyPI | BSD | Deterministic SFX + procedural score | `scripts/make_audio.py` |
| Higgsfield MCP (ElevenLabs v4 TTS, ElevenLabs Music v2.5, GPT Image 2.6) | hosted | connected account | per Higgsfield ToS (user's paid account) | Narration, music, key art | used; credits shown in APPROVALS.md |

Not installed (not needed yet): PixiJS, Rhubarb Lip Sync (no on-screen dialogue in seg 01), Remotion,
whisper-cpp / Kokoro / MusicGen (HyperFrames optional local fallbacks), Docker daemon.

**Not found:** "opcus limo / limo opocus" — no matching GitHub repository located (searched
`limo animation`, `opcus limo`, `opus limo`). Waiting on the correct name/URL from the user.

## Smoke test (smoke/ — not a creative deliverable)

`smoke/index.html`: three.js wind-pushed plane + p5.brush on a WEBGL canvas + a GSAP-tweened element
+ an `<audio>` clip, all drawn from the HyperFrames `hf-seek` time.

| Check | Result |
|---|---|
| Render 3 s @ 24 fps, 1920×1080 | ✓ 72 frames, h264 + AAC, 3.000 s both streams |
| Repeat render identical | ✓ frames 0/36/71 PSNR = ∞ between two independent renders |
| Motion between sampled frames | ✓ GSAP dot, p5.brush watercolour fill, three.js mesh all move (f0 vs f71 PSNR 15.8 dB) |
| Brush asset visible | ✓ watercolour fill renders; ✗ pencil/charcoal `brush.line` strokes vanish after the first redraw, and the fill showed a white fringe at f71 |
| Audio in export | ✓ AAC stream present, level measured |
| Console / static guard | vendored p5/p5.brush contain `Math.random()` → fixed by a seeded `Math.random` replacement reseeded every frame; only remaining console noise is the harmless "GPU stall due to ReadPixels" WebGL warning |

**Decision:** p5.brush textures (breath vapor, fog, paper grain, drip splash) are **pre-baked** to
deterministic PNG sequences by a seeded script, then composited in HyperFrames. three.js and GSAP
run live under the seek clock. HyperFrames stays the single master timeline.

## Reproduce

```bash
cd livingline && npm ci
npx hyperframes doctor
cd smoke && npx hyperframes render --fps=24 --output=out/smoke_a.mp4
python3 scripts/make_audio.py          # from livingline/
```

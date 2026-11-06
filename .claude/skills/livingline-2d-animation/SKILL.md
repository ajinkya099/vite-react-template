---
name: livingline-2d-animation
description: Living Line Animation Studio workflow for cinematic 2D character animation (HyperFrames master timeline, generated key drawings, pre-baked p5.brush FX, three.js fabric, GSAP, ElevenLabs audio via Higgsfield) with mandatory user approval checkpoints. Use for any work on the livingline/ project — storyboards, style frames, music, rendering or validating a segment, or continuing to the next segment.
---

# Living Line 2D Animation

Project root: `livingline/`. Read `PRODUCTION_PLAN.md`, `APPROVALS.md` and `STYLE_GUIDE.md` before any change.
Also follow the installed `/hyperframes` skill contract (seek-driven, deterministic, `window.__timelines`).

## Sequence — never skip, never reorder
1. **Install & verify** tools (TOOLCHAIN.md). Never claim an install that didn't succeed.
2. **Storyboard + style frame + playable music options**, then **STOP** and ask the user to approve or revise:
   (1) storyboard and the segment's action, (2) character/style frame, (3) music and sound direction.
3. **Produce exactly one segment** (default 10 s = 240 frames @ 24 fps, 1920×1080, unless the user sets otherwise).
4. **Validate the real output** (below) and fix problems before showing it.
5. **STOP** and ask: "Approve this segment, or specify revisions?" Revisions are re-rendered and re-validated as `_v2`, `_v3`.
6. **Next segment only after explicit approval.** It continues master time (no restart), and starts on the previous end pose, camera and lamp level unless the storyboard cuts. Deliver an overlap preview of the transition plus the combined preview, then STOP again.

Silence, "looks fine?" or partial comments are **not** approval. Record every decision, with the exact file version, in `APPROVALS.md`. Never overwrite an approved output.

## Art rules
- Match the user's reference style (STYLE_GUIDE.md): ink contour with varied weight, 2–3 tone hard cel shading, hatching in the darkest tone, locked paper grain, realistic 2D anime anatomy.
- Never recreate copyrighted productions or their characters. References are style guides only.
- **All visuals are drawn by code** (user direction, 2026-11-06): `film/lib/ink.js` toolkit + parametric rigs. Never use a text-to-image or text-to-video model for frames. Expressions are rig parameters. A new angle needs a new hand-authored drawing in code, never a warp.
- Acting: anticipation → action → settle; offset parts (head leads, hands follow); deliberate holds; no constant idle bobbing; eyes on what they look at.

## Determinism rules
- Every frame is a function of its time. Seed all randomness. A seeded `Math.random` replacement is reseeded per frame (vendored p5/p5.brush call it).
- p5.brush pencil/charcoal strokes don't survive redraw under the seek clock, so **pre-bake** brush FX to PNG sequences with a seeded script. three.js and GSAP run live from `hf-seek` / the timeline.
- All assets are local (`lib/`, `assets/`). No network at render time. Register `window.__hf.buildReady[...]` for async setup.

## Audio rules
- Reuse existing Higgsfield/ElevenLabs generations first (`show_generations type:audio`). Generate new narration only when a line is missing or not expressive enough, and say so.
- `scripts/make_audio.py` is the timing source of truth: VO, music, ambience and SFX are placed on the master clock, VO-led side-chain ducking, ceiling −1.2 dBTP.

## Validation checklist (write results to QA_REPORT.md)
Technical: 1920×1080 · 24 fps · exact frame count · duration of both streams (check codec padding) · audio present, no clipping, no unintended silence · no black or frozen frames · no missing assets or console errors · repeat renders of sampled frames identical.
Visual: compare against the approved style frame · faces, hands, anatomy, layer seams · motion continuity, eye direction, contacts · shadow direction and lamp continuity · texture stability (no unintended flicker) · contact sheet.
Disclose what you cannot do: you cannot listen or watch in real time. Never claim to have.

## Deliverables per segment
MP4 with audio · contact sheet · validation report · editable project + reproducible commands:
```bash
cd livingline && npm ci && python3 scripts/make_audio.py
cd film && npx hyperframes check --json && npx hyperframes render --fps=24 --output=../renders/segXX_vN.mp4
```

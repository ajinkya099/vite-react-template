# QA REPORT

## Segment 01 — `renders/seg01_v1.mp4` (2026-11-06)

### Technical (measured on the output file)
| Check | Result |
|---|---|
| Resolution / fps | ✓ 1920×1080, 24/1 |
| Frame count | ✓ exactly 240 video frames |
| Duration | ✓ video 10.000 s, audio 10.000 s (AAC, no padding beyond 10 s) |
| Streams | ✓ h264 + AAC |
| Loudness / clipping | ✓ −19.0 LUFS integrated, true peak −1.8 dBFS |
| Unintended silence | ✓ none. 0.00–0.50 is below −55 dB **by design** (cold-open "Black. Silence."); first sound is the drip splash at 0.62 |
| Black frames | ✓ 0.00–0.71 black **by design** (only the forming drip glints); no other black |
| Frozen frames | ✓ none ≥ 0.5 s (freezedetect) |
| Determinism | ✓ two independent renders identical at f0/60/121/239 (PSNR = ∞) |
| HyperFrames check | ✓ 0 errors; 1 structural warning (`nested_structure_needs_subcomposition`), no effect on output |
| Console / missing assets | ✓ none; no image assets at all (every pixel drawn by code) |

### Motion smoothness (frame-to-frame luma difference, 480 px)
Median 0.54. Only intended spikes: the **cut** at 3.625 s; the **eye-snap** at 5.000/5.042/5.083 (decaying by design); the **camera pan** 8.00–8.55 as one smooth bell curve. No isolated jumps elsewhere, so the shiver, float, breathing and lantern flicker are continuous.
Brightness across the cut: luma 43.4 → 45.8 (smooth after lifting the wide's exposure).

### Visual (contact sheet `renders/seg01_v1_contact.jpg`)
- Lighting continuity: the moonlit wall is on Dev's right (screen-left) in both shots; the wide is mirrored for this. Lantern ember is warm and small in both.
- Face: nose, lips, eyes and stubble match approved v3; gasp reads as an oval fear mouth, clench as a grimace.
- Snap on ones: f118 half, f119 most, f120 wide + jolt.
- Eye dart at 7.8 with the head following 4 frames later, then the camera pan reveals the wall press at 8.4.
- Lamp dims 9.0–9.7; final 0.3 s locked and still.

### Limitations (disclosed)
- I cannot watch real-time playback or listen. Motion is verified by frame-difference analysis and frame inspection; audio by loudness, silence and timing measurement.
- The code-drawn look is cleaner and flatter than the painted v1 reference (lock-based hair, fewer tones).
- The wide shot's sleeper is seen only as a hooded bag (head in shadow), as storyboarded.

## Phase 0 smoke test: see TOOLCHAIN.md.

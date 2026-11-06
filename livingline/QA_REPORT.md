# QA REPORT

## Phase 0 smoke test — see TOOLCHAIN.md (passed with one documented caveat: live p5.brush pencil strokes → pre-bake).

## Segment 01 — not yet produced (awaiting creative approval).

## Known risks carried into Phase 2
- Edited drawings keep the background pixel-identical, but the **face shifts slightly** between the eyes-closed and eyes-open drawings. Mitigation: swap the whole face region on timed drawing changes (classic replacement animation), with feature alignment before compositing.
- I cannot listen to audio or watch playback in real time. Audio QA is by measurement (loudness, silence, onsets); visual QA is by rendered-frame inspection and contact sheets.

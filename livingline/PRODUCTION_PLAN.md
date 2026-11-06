# PRODUCTION PLAN — Living Line Animation Studio · "Roopkund" (Living Line Dark Canvas)

Sequence (strict): INSTALL & VERIFY → STORYBOARD + MUSIC APPROVAL → FIRST SEGMENT → VALIDATION → USER APPROVAL → NEXT SEGMENT.
Silence is never approval. Approved outputs are never overwritten; revisions get `_v2`, `_v3`.

- **Segment length:** the user set **10 s** (240 frames @ 24 fps) for the first try, overriding the brief's 5 s.
- **Master timeline:** HyperFrames (`livingline/film/`, created in Phase 2). One root `data-duration` grows segment by segment, and master time never restarts.
- **Art:** generated key drawings (STYLE_GUIDE.md) + pre-baked p5.brush FX + live three.js fabric + GSAP camera/holds.
- **Audio:** existing ElevenLabs narration / music / ambience from Higgsfield, plus seeded procedural SFX (AUDIO_PLAN.md).

| Phase | State |
|---|---|
| 0 Toolchain + smoke test | ✅ done — TOOLCHAIN.md |
| 1 Storyboard, style frame, music previews | ✅ approved 2026-11-06 |
| 1b Code-drawn style frame v2 + rig motion test | revisions requested |
| 1c Code-drawn v3 (nose, lips, lighting, bag/zip, detail, fluid motion, camera direction) | ✅ prepared — **waiting for approval** |
| 2 Segment 01 (0–10 s) | ✅ rendered `renders/seg01_v1.mp4` |
| 3 Validation | ✅ QA_REPORT.md — **waiting for segment approval** |
| 4 Next segments | ⏸ |

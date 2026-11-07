---
name: horror-prompting
description: "Use to turn approved horror storyboards into model-neutral image prompts and atomic video-motion briefs."
---

# Horror AI image/video generation prompt compiler

## Compile, do not invent
Accept approved scene/character/location bibles, shot list, first/last frames, script/audio and selected model constraints. Never silently create new dramatic events or replace canonical references.
## Prompt syntax
`SHOT_ID. Subject identity and position. Setting/time/materials. One primary action from defined start to end state. One motivated camera move (or locked shot). Lens/angle/composition. Practically motivated light and threat visibility. Actor micro-expression. Environmental reaction. Audio cue if model supports it. Continuity locks. Negative failure constraints.`
## Decomposition
For hard character action, prefer small, connected shots with one main action and one camera behavior. Identify which frame is first/last and which objects must exist in both; separate image-generation instructions from motion instructions and from edit/audio notes.
## Horror specificity
State `only audience sees small still silhouette in far mirror`, `actor does not turn until 00:03.5`, `lamp edge-light keeps mouth visible`, rather than `very scary horror cinematic`.
## Model adaptation
Translate to supported API fields only after verifying that model's current capabilities; do not imply all video systems support audio, exact seeds, lip sync, or 60 fps native generation.
## Revision protocol
If result fails, name failure (`identity drift`, `float`, `wrong eyeline`, `premature reveal`) and change the smallest relevant prompt/asset/control parameter. Keep approved decisions locked.
## Output
Per-shot reference IDs; still/keyframe prompt; motion prompt; negative constraints; audio association; QC target; uncertainty about model-specific features.

---
name: horror-storyboard
description: "Use to transform screenplay and fear-map into keyframes, shot lists, blocking diagrams and timed animatics."
---

# Horror storyboard and previs planner

## Storyboard workflow
1. Lock scene's physical geography and threat rule. Assign stable `SCN-###` and `SHOT-###` IDs.
2. Convert each narrative beat to necessary shot(s). Give every shot a dramatic function and one dominant action.
3. Compose **start, turning and end** states for complex movement; a single pretty still does not prove animatability.
4. Track reveal timing and which frame the audience discovers danger. Preserve off-screen space and matching eyelines.
5. Specify camera position, lens/FOV, scale, move, horizon, lighting source, subject start/end pose, prop status and dialogue anchor.
6. Build audio-first animatic using script and cue lengths; resolve overlaps and shot timing before rendering high quality media.
7. Return a feasibility flag: `simple`, `needs_rig/previz`, or `split_shot`.
## Mandatory per-shot fields
`id`, `time_in`, `time_out`, `purpose`, `viewer_knowledge_change`, `composition`, `camera`, `blocking`, `eyeline`, `light`, `sound`, `entry_state`, `exit_state`, `next_cut`.
## Reject if
A hand, prop or character jumps between compositions; the camera crosses action axis without purpose; the keyframe cannot plausibly transform into next frame; shots fill time without new action.

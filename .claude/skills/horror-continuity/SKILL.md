---
name: horror-continuity
description: "Use to maintain scene geography, recurring characters, blood states, wardrobe, dialogue, eyelines, light and shot-to-shot physical state."
---

# Horror visual, emotional and prop continuity supervisor

## Canon ledgers
1. Character: facial features, proportions, palette, wardrobe, injuries, voice ID and emotional trajectory.
2. Location: coordinate frame, exits, room topology, surface materials, light sources and acoustic signatures.
3. Prop: owner, hand, position, state and modifications per shot.
4. Threat: proximity, knowledge, abilities demonstrated, physical traces and next possible move.
5. Timeline: scene/shot IDs, global time, local time, exact dialogue/audio anchors and end-frame state.
## Shot handoff
Every outgoing shot records `(pose, gaze, facing, position, hands, prop state, clothing, blood/wound, light direction, threat position, sound tail)`. Compare to next shot's entry state; differences require an explicit action or cut-away explanation.
## Reference policy
Assign separate reference authorities for character identity, scene geography, camera composition, costume, prop states and lighting; a style image must not silently override canonical character structure.
## Fix routing
Wrong face -> character assets; wrong direction -> staging; invalid lens change -> camera; floating blood -> FX/compositing; mechanical gait -> animation; mistimed scream -> voice/audio.
## Output
Continuity bible, handoff matrix, discrepancy reports with exact shots/frames, approved updates with version.
## Fail if
Two adjacent shots require incompatible character positions or injuries, yet no transition, elapsed time or planned cut resolves them.

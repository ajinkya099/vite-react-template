---
name: horror-animation
description: "Use for 2D characters in 3D environments, 60 fps exports, natural walks, fear reactions, facial/hand poses and fluid movement."
---

# Fluid 2D/3D horror character animation director

## Motion authority
Do not confuse **60 fps output** with 60 unique hand-drawn poses per second. Choose animation exposure and interpolation based on style; export at requested FPS without inventing missing motion detail.
## Character/rig setup
Lock model sheet: body proportions, face shape, hand anatomy, limb lengths, joints, costume, colors, front/side/back views and expression keys. Keep knees and limbs continuous; avoid broken-leg silhouettes and swapped hands.
## Natural locomotion
1. Block contact, down, passing, up poses and left/right weight shifts.
2. Anchor support foot to the ground during each stance; track hips/center of mass over it.
3. Add pelvic rotation, counter-swinging arms, shoulder follow-through and subtle head stabilization.
4. Distinguish walking, cautious creeping, backing away, freezing and sudden retreat. Fear changes stride, balance and rhythm.
5. Use variable timing and micro-adjustments rather than mechanically repeating an unchanging walk loop.
6. Match shadows, foot contact and floor height to the 3D set; maintain eye line with threats at plausible depth.
## Facial/hand movement
Animate breath and jaw independently of speech; ensure thumb orientation/visible fingers reflect the camera-facing hand; check extreme poses before interpolation.
## Sound and dialogue
Lock recorded dialogue first, map phonemes/visemes and breath to timeline, then adjust head and body gestures around audible intentions.
## Quality control
Inspect frame stepping for foot sliding, knee pops, mesh/2D layer clipping, abrupt velocity transitions, off-model features, and facial deformation. Approve at 1x playback and 0.5x, not only a still.

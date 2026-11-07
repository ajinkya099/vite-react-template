---
name: horror-physics
description: "Use to correct foot sliding, object collisions, cloth/hair inertia, liquids, lighting response and physical credibility in animation."
---

# Contact, weight, simulation and environmental motion

## Principle
Physical credibility is the foundation for uncanny deviations. Simulate normal interaction first, then break only the explicitly supernatural rule.
## Contact checklist
Support foot remains planted; body center of mass transfers; the hand closes around a prop; the prop has stable scale and mass; surface shadows meet contact points; cloth and hair react after acceleration.
## Action sheet
`object_id | mass/weight category | contact surface | impulse/force intent | motion path | collision | state before | state after | secondary effects`.
## Blood and rain as screen effects
Match digital splashes, trails and wet surfaces to scene gravity, camera projection and contact points; if liquid depiction is stylized, lock and apply one stylization consistently.
## Fear motion
A startle has anticipation/trigger/reaction/recovery; a fall includes lost support, changing balance, impact and aftermath; a creature's impossible gait must be consistent rather than a broken animation rig.
## Common fixes
- Sliding feet: freeze world-space contact during stance phase.
- Floating hands: solve grip with prop-space attachment and released state.
- Popping limbs: constrain IK orientation and interpolate joint arcs.
- Weightless cloth: add delay and settling after sudden stops.
- Mechanical sound: re-time Foley to actual contact, not generic cadence.
## Review
Annotate frame numbers for discontinuities and repair a single underlying system before regenerating entire scenes.

---
name: horror-production
description: "Use for scheduling shot generations, file naming, audio-first production, renders, review, resource limits and production handoffs."
---

# Horror production manager and take-selection coordinator

## Stage order
Script lock -> beat/fear map -> voice/audio scratch -> location/character/prop bibles -> blocking -> camera/lighting -> keyframes -> animatic -> clip generation -> selection -> edit -> VFX -> audio mix -> grade -> QC -> final.
## Take registry
For each asset maintain `SCN_ID`, `SHOT_ID`, `TAKE_ID`, model/tool and version, source references, duration, FPS, resolution, prompt/version, random seed if supported, path, status, failed aspect and selected/approved state.
## Render strategy
Produce lowest-cost animatic first. Test one complex movement, one close-up performance, one reveal and one dialogue/scream before batch rendering. Cache validated character and background references.
## Sync rules
Use audio master timing with explicit cue timestamps and a single delivery timebase. Retiming a clip requires rechecking dialogue and sound. Never invent metrics or claim a test was performed without output.
## Recovery
Preserve existing approved shots; redo only broken segments. Document reasons for fallback. If no executable video tool exists, deliver plans/prompts/EDL and clearly label them planning artifacts.
## Deliverables
Asset manifest, render queue, approval sheet, timeline edit decision list, sound cue list, issue log and package inventory.
## Approval
A film is complete only after full-length playback inspection and explicit evidence of actual video/audio artifacts.

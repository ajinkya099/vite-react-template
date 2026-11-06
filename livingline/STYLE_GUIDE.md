# STYLE GUIDE — "Roopkund" (Living Line Dark Canvas)

**Status: PROPOSED — awaiting approval (see APPROVALS.md).**

## Source references (style only — no character, frame or design is copied)
- User's horror character lineup (5 panels): ink-heavy linework, hard cel shadow shapes, cross-hatching, aged paper grain, muted palette. **Primary style reference.**
- User's adventure lineup + radio-operator frames: instrument-lit cel shading and value control.
- The Disney *Hercules* frames and the published anime film frames in the upload are **not used**: they are copyrighted productions and would be recreation, not style.
- The prescription photo in the upload is unrelated, so it was ignored and never sent anywhere.

## Rendering rules
- **Line:** confident ink contour, varied weight: outer silhouette ≈ 2× interior lines, hair in tapered clumps. Line weight stays constant across drawings of one shot.
- **Shading:** 2–3 hard-edged cel tones per material, with hatching only inside the darkest tone. No airbrushed gradients on the character; atmosphere gradients go on separate layers.
- **Texture:** aged-paper grain over the whole frame, locked (it doesn't boil on holds). Linework may boil at 12 fps only where noted.
- **Anatomy:** realistic anime proportions, 7.5 heads. Eyes sit on the skull's midline, and the eye spacing equals one eye width. Five-finger hands drawn to the model sheet.

## Palette (night, tent interior)
| Role | Hex |
|---|---|
| Deep shadow / ink | `#0B0E10` |
| Moonlight through nylon (key, screen-left) | `#5F8F9A` → highlight `#9CC3C8` |
| Tent nylon midtone | `#24343A` |
| Lantern ember (fill, screen-right, dying) | `#E39A3B` → glow `#7A4A1E` |
| Skin, moonlit / lantern-lit | `#8C6A4E` / `#A8754A` |
| Sleeping bag olive | `#3F4628` |
| Frost / breath vapor | `#C9D3D2` at 35–60% |

## Lighting continuity
Moon key always screen-left and cool; lantern always screen-right, warm and low. At 9.0–10.0 s the lantern dims about 30%. The shadow direction never flips inside a shot.

## Character: DEV (locked by the expression sheet once approved)
27, Indian, lean face, defined cheekbones, messy black hair with damp clumps at the forehead, three-day stubble, thick brows, dark brown eyes. Charcoal fleece with a high pile collar, olive mummy sleeping bag. Reference files: `assets/art/v1/styleframe_dev_eyes_open_v1.png`, `assets/art/v1/dev_expression_sheet_v1.png`.

## Art pipeline (honest limits)
Key drawings are generated with GPT Image 2.6 via Higgsfield, using the style references and then the approved frame as an identity anchor. Code cannot hand-draw art at this level of detail, so this is the gap being filled. Each extra drawing (eye states, eye direction, jaw) is an **edit of the approved frame**. Only the changed region is masked in and aligned onto the base drawing, which keeps everything else pixel-stable. A flat image has no hidden parts, so every new angle or pose is a new drawing, never a warp.

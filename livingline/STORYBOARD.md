# STORYBOARD — Segment 01 "2:17 AM" (cold open, 0.00–10.00 s)

**Status: APPROVED v1 (2026-11-06).** 1920×1080 · 24 fps · 240 frames · one continuous master clock.
Panels: `storyboard/panels/`. Audio timing comes from `scripts/make_audio.py` (single source of truth).

**Premise (full film ≈ 7:50, per the user's script).** Dev, a confident 27-year-old trekker camped at
Bhagwabasa (14,000 ft), laughs off the guide's Roopkund legend, reads the 2019 DNA findings, and
dreams himself onto the frozen lake, where faceless figures appear whenever he looks away. At dawn,
frost on his boots, wet footprints and a reopened laptop suggest he never only dreamed.
Segment 01 is the first 10 s of the cold open.

| # | Time / frames | Panel | Composition & camera | Character action & emotion | BG / FG motion | Light | Sound sync |
|---|---|---|---|---|---|---|---|
| 1 | 0.00–0.50 · f0–11 | p1_black_drip | Near-black frame, one glint top-centre. Locked. | — | Drip forms on the seam; at 0.30 it falls (6 frames) | Only the drip's highlight | Drip ① at 0.30 · wind fades in |
| 2 | 0.50–3.60 · f12–85 | p2a → p2b | Wide from the tent foot. Slow push 1.00→1.06 (ease-in-out sine). | Sleeper-shaped lump in the bag; one shallow breath rise at ~1.8 s | **Right tent wall breathes inward** on gusts (three.js mesh, 1.0→2.6 s and 3.0→3.6 s). Lantern ember flickers, seeded 8 fps. Drip ② falls at 2.15, splash ring on the floor. Dust motes (baked p5.brush). | Ember fades up 0→100% over 0.5–1.4 s. Moon glow pulses with the gusts. | VO 1 "रात के दो बजकर सत्रह मिनट।" 0.50–3.46 · drip ② 2.15 |
| 3 | 3.60–4.96 · f86–118 | p3_closed | **Cut** to close-up, slight high angle. Imperceptible drift 1.00→1.015. | Asleep, troubled. Lids flutter (REM twitch, 2 drawings, at 3.9 and 4.4). Brow tightens over 4.5–4.9 (**anticipation**). Bag rises/falls on one breath. | Drip ③ at 3.95 in the background seam. The tent wall behind him sags inward slightly. | Moon rim on his profile, ember warm on the cheek | VO 2 begins 3.70: "देव की आँख ऐसे खुली…" |
| 4 | 5.00 · f120 | p4_snap | **1-frame camera jolt** (6 px), settles in 4 frames. | **Eyes snap open**: closed → half → wide on ones (f118–120). Pupils contract over 3 frames. Brows shoot up; head lifts 8 px off the pillow and settles (follow-through). | — | Ember flares +15% for 2 frames | On "खुली" ≈ 5.0 · music hit |
| 5 | 5.30–9.70 · f127–233 | p5_shiver | Very slow push 1.00→1.04 toward the eyes. | Gasp: mouth opens 5.30, **breath vapour** plume (baked p5.brush sequence) 5.3–6.4. Then shivering: 2–3 px tremor on twos, jaw clench drawing alternates. A sweat bead slides down the temple 6.5–8.0. **Eyes dart screen-left** toward the tent wall at 7.8 (eye-direction drawing, 2-frame move, hold). | Tent wall (left) presses in once at 8.4 as if pushed from outside, then releases. | Lantern begins to dim at 9.0 | Gasp 5.30 · VO 2 "…जैसे किसी ने उसे बर्फ़ीले पानी से खींचकर बाहर फेंका हो।" 6.13–9.72 |
| 6 | 9.70–10.00 · f233–239 | p6_hold_dim | Held. | Frozen stare, breath held — no tremor (the stillness is the beat). | Wall still | Lantern ≈70% | Music sustains into segment 02 (where the thud lands) |

**Continuity out:** segment 02 starts on this exact pose, camera and lamp level, with the music continuing (continuous master time).

## Drawings required for Phase 2 (each an edit of the approved frame, aligned on a mask)
Close-up: closed (done) · flutter A/B · half-open · wide (style frame) · wide + small pupils · eyes-left · jaw-clench · mouth-gasp.
Wide: clean plate (done). The sleeper's breath rise is a mask-warp of the bag only, under 1.5%, kept under the anatomy threshold.
FX layers (baked, seeded): drip + splash, breath vapour, dust motes, paper grain (locked), lantern glow.

## Director's camera notes (v3)
**Shot 1 (wide, 0.00–3.60), to build after approval:** 0.00–0.50 locked on black. 0.50–3.60 slow dolly-in 1.00→1.06 (sine in-out) with a 20 px tilt down toward the sleeper. The wall breathes with each gust. Hard cut at 3.60.
**Shot 2 (close-up, 3.60–10.00), built:**
| Time | Move | Motivation |
|---|---|---|
| 3.60–4.90 | Creep: push 1.000→1.030 on the eyes, sine in-out | Dread while he sleeps |
| 4.90–5.00 | Dead hold, 2 frames | Stillness before the hit |
| 5.00 | Jolt: 8 px up-right, decays over 5 frames; punch-in +0.015 (expo out, 0.2 s) | Lands with the snap and the sub-hit |
| 5.20–7.70 | Handheld float ±3 px (~0.5 Hz smooth noise) | Unease |
| 7.78–8.60 | Pan 70 px toward screen-left + push to 1.065 (power2 in-out) | Follows the eye dart; frames the wall before the 8.40 press |
| 8.60–9.70 | Hold, float halved | — |
| 9.70–10.00 | Locked off | Stillness into segment 02 |

**Acting additions (v3):** a slow frightened blink at 6.90; brows lead the lids by one frame; eyes lead the head on the dart (head follows 4 frames later); the hair trails head moves by 0.07 s; the shiver is continuous smooth noise, not stepped.

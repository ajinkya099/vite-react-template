# AUDIO PLAN — Segment 01

**Status: PROPOSED — music direction awaiting choice.** Build: `python3 scripts/make_audio.py`.

## Narration (existing, reused unchanged — ElevenLabs v4 via Higgsfield, voice "Landon")
| Line | Higgsfield job | Clip length | Placed at | Speech span (film time) |
|---|---|---|---|---|
| "रात के दो बजकर सत्रह मिनट।" `[hushed, ominous, slow]` | 9d9baef6 | 3.32 s | 0.50 | 0.64–3.46 |
| "देव की आँख ऐसे खुली… जैसे किसी ने उसे बर्फ़ीले पानी से खींचकर बाहर फेंका हो।" `[quiet, cold]` | 9ecb7b45 | 6.27 s | 3.70 | 3.87–5.54, 6.13–9.72 |

Note: your existing recordings word the cold open slightly differently from the script text you pasted
("…जैसे वह अभी-अभी किसी बर्फ़ीले पानी से बाहर निकला हो"). As instructed, I kept the existing audio. Both
lines are already expressive (hushed, cold), so no regeneration is needed. The "भगवाबासा। समुद्र तल से
चौदह हज़ार फ़ीट ऊपर।" beat doesn't fit inside a strict 10 s; it exists as job bccb5868 and goes in segment 02.

## Music — two directions (one continuous score is planned for the whole film)
- **A · ElevenLabs "Horror cold open" cue** (your existing job df2d394d, 42 s): near-silence, then a low sustained cello and icy breath textures. Its heavy impact sits at 24 s, which lines up naturally with "बाहर कुछ भारी गिरा" later in the cold open. In seg 01 the eye-snap is carried by SFX, not the score. Preview: `assets/audio/seg01/preview_mix_A.mp3`.
- **B · Original procedural sketch** (numpy, seeded, no licensing questions): a D1/A1 bowed-drone cluster, a reversed-air swell into the eye-snap, then a sub-drop plus metallic strike at 5.00, a thin glass harmonic and a 96 bpm heartbeat. This is a rough synthesized sketch, not a finished orchestral score. Preview: `assets/audio/seg01/preview_mix_B.mp3`.

**Recommendation: A**, because every other cue in your library is ElevenLabs Music, so A keeps one sonic world across the film. I'd add B's sub-hit as an SFX on the eye-snap.

## SFX cue list (seg 01)
| t (s) | Cue | Source |
|---|---|---|
| 0.00–10.00 | High-altitude wind on tent fabric, gusts aligned to the wall "breaths" | existing ElevenLabs ambience 0d0b9d68 (from 0.9 s, −9 dB, 1.2 s fade-in) |
| 0.30 · 2.15 · 3.95 | Water drip "plink" + small room tail | procedural |
| 5.00 | Eye-snap hit (sub-drop + metallic strike) | procedural (in B; added as SFX if A is chosen) |
| 5.30 | Sharp inhaled gasp (in the narration pause) | procedural breath noise; can be swapped for an ElevenLabs-voiced gasp |
| 8.40 | Fabric pressed from outside (low cloth thump) | to add in Phase 2 |

## Mix
VO leads; music is side-chain ducked about 4:1 under the VO. Limiter ceiling −1.2 dBTP. Both previews measure ≈ −19 LUFS integrated, with no silent seconds and peak loudness at 5.0–6.0 s (snap + gasp).

# Audio direction — "मेरे पैर कहाँ हैं?"

**Status: recommendation v1. Nothing is generated until the script is approved.**

## Benchmarks measured from the reference (Teke Teke, Kaidan Street, 10:04)
| Measure | Reference | Our target |
|---|---|---|
| Integrated loudness | −14.0 LUFS | −14 LUFS (YouTube norm) |
| Loudness range | 5.2 LU (voice-forward, compressed) | 5–7 LU (a little more room for the two shocks) |
| True peak | −0.5 dBFS | −1.0 dBTP |
| Bed under narration | never drops below −40 dB: a continuous ambience/music floor | the same, except **3 deliberate dead-air beats** (after "दूसरा सवाल", after "सुधा… दीदी", before the ghost-train whistle) |
| Narration pauses | ~17/min, median 0.50 s, longest 1.2 s | ~16/min; 0.4–0.6 s phrase gaps; 1.0–1.6 s only at reveals (marked in the script) |
| Editing pace | median shot 5.5 s, mean 8.6 s | median ~6 s; long holds in SCN-07/08 |

I measured these by analysis (loudness curve, dips, cuts). I can't listen, so "sounds like the reference" is checked against these numbers plus your ears at the audio checkpoint.

## Voice casting (Higgsfield, ElevenLabs engine; line-by-line takes)
Every role is auditioned on two short Hindi lines (≈0.3 credits each), and you pick by ear before the full generation.
| Role | Direction | Candidates to audition |
|---|---|---|
| नैरेटर | deep, close, unhurried, slight smile of menace; never shouts | Landon (Roopkund narrator, keeps channel identity) · Katie Narrator (Living Line, your own voice) · Gideon · Alistair |
| सुधा (44) | tired, warm, guilt under control; breaks once in SCN-11 | Helena · Vera · Elena · Nora |
| सुधा PA | the same voice, processed: 300–3.4 kHz band, light distortion, 1.2 s platform slap-echo | (processing, not a new voice) |
| अनाया (15) | bright, quick, then breath-controlled terror; the whisper-answer must shake | Maya · Zoe · Luna · Pixie |
| रुबीना (15) | playful storyteller, conspiratorial drop on "तीन रातों…" | Gia · Kayla · Hana |
| चंदा | child-girl whisper, very close-mic, breathy, no theatrical growl; "सुधा… दीदी" is recognition, not menace | Chloe · Quinn · Skye (+ local processing: subtle pitch drift, cold reverb, the bangle layer) |
| स्टेशन PA | bored male railway announcer, Hindi PA cadence | Marcus · Kevin |

Hindi delivery notes for the engine: write in Devanagari, use the bracket emotion tags already proven in Roopkund ([hushed], [shaky], [whispers]), one sentence per take, and edit breaths and gaps in post. Per horror-voice-scream, I won't claim the engine can do a convincing scream without an audition. The script deliberately avoids a full scream; the brake squeal and a cut-off gasp carry SCN-11.

## Music (ElevenLabs Music v2.5, instrumental, timed cues; ~17 credits per 2 min)
One textural idea per cue (horror-score). Indian colour without cliché: a detuned tanpura drone, bowed sarangi-like scrapes, a distant temple-bell decay, harmonium air, low tabla thuds for heartbeat.
| CUE | Span | Function | Texture |
|---|---|---|---|
| M1 | 0:00–0:45 | Cold open dread | Sub-drone + icy breath; **cuts out** under the whisper; title sting (low brass + bell) |
| M2 | 0:45–2:30 | Ordinary life, cold town | Sparse harmonium + soft tanpura, faint warmth that cools by SCN-04 |
| M3 | 2:30–4:25 | Mother's secret | Low bowed strings, a clock-like pulse; stops on the glass break |
| M4 | 4:25–7:05 | Platform → run | Nearly nothing: a hiss floor; drops to dead air at the kettle; a frantic percussion build only for the run |
| M5 | 7:05–9:25 | Confession / 1991 | Sarangi-like lament, grief not fear; distant train-horn motif |
| M6 | 9:25–10:58 | Dawn, epilogue, outro | Pale high strings, unresolved chord; end-card sting |

## SFX (Mirelo SFX via Higgsfield, ~2 credits each, plus local procedural layers)
Signature **ठक… छन** (elbow on ballast + glass bangle, 8 variations, near/far); coal kettle whistle + its sudden stop; PA crackle, switch-on thump, feedback whine; fog night bed (distant trucks, owl, dripping, no crickets in a December cold wave); classroom angithi crackle; glass tumbler shattering on stone; diesel horn (distant / passing), brake screech, wheels over joints; running on frozen dirt, breath, distant dogs; wall-clock tick that stops; chappal footsteps on wet concrete; mic-on hum in the cabin.

## Mix architecture
Stems: VO · PA (processed) · music · ambience · Foley · designed SFX. VO-led side-chain ducking (as in Roopkund) at about −14 LUFS integrated, with the bed held at −32…−38 LUFS-S under narration. Everything is placed on one master timeline in `scripts/make_audio_teke.py`, which becomes the video's timing source (60 fps timebase).

## Budget estimate (credits)
≈95 lines × 2 takes × 0.3 ≈ 57 · auditions ≈ 10 · music ≈ 11 min ≈ 95 · SFX ≈ 30 × 2 ≈ 60 → **≈ 220 credits** (current balance ≈ 2,167).

# Audio log — "मेरे पैर कहाँ हैं?"

## 2026-11-07 · Voice auditions (text2speech_v2 / ElevenLabs via Higgsfield, 0.3 cr each)
20 takes in `audio/auditions/` (dry, as generated), loudness-matched copies in `review/aud/`.
Whisper-medium (local) transcripts confirm every take speaks the intended Hindi. Flags: Luna "पहर" for "पैर"? Hana "बास" for "पास"?
Measured picks (pace, how soft the delivery is, transcript clarity), pending the user's ear: narrator Landon · Sudha Elena · Anaya Maya · Rubina Kayla · Chanda Chloe · PA Marcus.

## 2026-11-07 · SFX first pass (mirelo_text_to_audio, 2 cr each)
18 effects in `audio/sfx_src/`. Measured against their briefs:
- Usable textures (13): crawl_near/crawl_away (gravel texture only), amb_station_fog, amb_classroom_angithi, horn_far, train_brake, train_pass_fade, run_fields, run_corridor, chappal_platform, room_cabin, bangles_fade_train, pa_on.
- Failed the brief (5): bangle_touch (−70 LUFS, near silent), glass_shatter (−56 LUFS), clock_stop (never stops), pa_feedback_cut (never cuts), kettle_stop (no clean stop). These, plus the rhythmic crawl, will be built procedurally and cut on exact frames.
Rate-limited submissions were not submitted and not charged; they were retried.

## Spend
Auditions 20 × 0.3 = 6.0 · SFX 18 × 2 = 36.0 · **total 42.0 credits**.

## 2026-11-07 · v2 auditions + full narration (Landon)
- v2 auditions (12 submitted, 1 provider failure, Cody): Shun (Peanut Zippy, Pixie, Benji), librarian (Mabel, Tallulah, Vesper), Japanese announcer (Marcus, Kevin, Evan), ghost in Japanese (Chloe, Quinn, Skye). Whisper confirms every take speaks the intended Japanese or Hindi.
- Narration: 63 lines (`vo/narrator/N01–N63.mp3`). Whisper-medium QA against the script: 60/63 passed first time.
  Fixes: N11 and N34 said "Machine Expressway". Devanagari "मेशिन/मेइशिन" either misreads or is dropped, so the name is now written in Roman script, "Meishin Expressway" (verified "Meishin"/"Mayshin"). N14 ending was slurred, regenerated. Rejected takes kept in `vo/alt_takes/`.
- Total narration audio ≈ 453 s before pause editing.
- Spend: v2 auditions 12 × 0.3 = 3.6 · narration 63 × 0.3 = 18.9 · fixes 7 × 0.3 = 2.1 → **24.6 credits** (project total ≈ 66.6).

## 2026-11-07 · Character lines (approved cast)
Aoi = Maya, Shun = Pixie, librarian = Tallulah, ghost = Chloe (JP), announcer = Kevin (JP). Reused audition takes: S03, L01, G01, P01.
23 new lines plus 10 fix attempts. Whisper QA findings and fixes:
- A10 "死人" was read as "shijin" → regenerated in kana; verified "死人の死".
- Aoi could not say "Meishin" in Roman script (Mation/Meshon/machine) → in A03 and A12 she now says the answer in Japanese kana, めいしん こうそくどうろ に ある (verified "मेशिन कोसुकु दोरो नि आरु"), as the letter would be written. Script updated (v2.1).
- G05 giggle "ふふ" and G04 "そう" verified.
New SFX (11 × Mirelo): snowstorm, steel town, school lockers, letter open, paper burn, library, door slide, phone bell, run in snow, kerosene stove, house in storm.
Spend this step: (23 + 10) × 0.3 = 9.9 · SFX 11 × 2 = 22 → **31.9** · project total ≈ **98.5 credits**.

## 2026-11-07 · Music + full audio master v1
- Dialogue master: `tools/timeline.py` → `audio/master/timeline.json` (timing source for everything). Narration atempo 1.07, short gaps −10%. Total **702.7 s (11:42.7)**.
- Voice processing: PA = band-limited platform loudspeaker with slap echo; Shun's phone lines = 1995 phone band; ghost = cold close-whisper tail, G03 panned hard left.
- Music: 6 ElevenLabs Music v2.5 cues timed to the scene spans (M1 50 s, M2 138, M3 99, M4 194, M5 133, M6 94). The cues follow internal timing prompts only loosely, so the director's silences are enforced by gain automation keyed to timeline marks (cold-open whisper, flame dip/crawl, ankle touch, ear-side question, phone click → run) plus true dead air after "Kashima Reiko".
- SFX: procedural テケテケ crawl (paired elbow taps, distance-modelled, snow/wood surfaces), flame sputter, frost touch, phone click + Japanese 400 Hz dial tone, sub hit; generated textures placed on marks; per-scene ambience beds.
- Master (`tools/mix.py`): **−14.0 LUFS, LRA 6.8 LU, −1.5 dBTP**. Whisper on the final mix recovers the Hindi narration, Shun's phone line and the Japanese lines word for word.
- Spend this step: music ≈ 102 credits → project total ≈ **200 credits**.
- Large WAVs are git-ignored; `python3 tools/timeline.py && python3 tools/mix.py` rebuilds them exactly.

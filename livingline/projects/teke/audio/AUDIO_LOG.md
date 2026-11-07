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

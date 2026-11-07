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

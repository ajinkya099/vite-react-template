#!/usr/bin/env python3
"""Living Line — deterministic audio builder for segment 01 (0–10 s, cold open).

Writes original procedural SFX + the procedural music sketch (Option B), then mixes
both music directions against the existing ElevenLabs narration and ambience.
Everything is seeded; re-running produces identical files.

Usage:  python3 scripts/make_audio.py      (from livingline/)
"""
import subprocess, wave
from pathlib import Path
import numpy as np

SR = 48000
DUR = 10.0
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/audio/src"
OUT = ROOT / "assets/audio/seg01"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(217)

# ---- master timing (seconds) — single source of truth, mirrored in STORYBOARD.md
T_VO1 = 0.50          # "रात के दो बजकर सत्रह मिनट।"
T_VO2 = 3.70          # "देव की आँख ऐसे खुली… जैसे किसी ने उसे बर्फ़ीले पानी से खींचकर बाहर फेंका हो।"
T_EYES = 5.00         # eyes snap open on "खुली"
T_GASP = 5.30         # gasp in the narration pause (5.54–6.13)
T_DRIPS = [0.30, 2.15, 3.95]   # visual drips: falls start 0.30 / 2.15 (wide), hanging drop in close-up
T_SPLASH = [0.30 + 0.32, 2.15 + 0.32]   # floor impact = fall time sqrt(2*490/3800) ≈ 0.32 s
T_PRESS = 8.40


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def t_axis(d):
    return np.arange(int(d * SR)) / SR


def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


def reverb(x, secs=2.2, wet=0.35, seed=1):
    r = np.random.default_rng(seed)
    n = int(secs * SR); ir = r.standard_normal(n) * np.exp(-6.0 * np.arange(n) / n)
    ir = onepole_lp(ir, 3500); ir /= np.abs(ir).sum() ** 0.5 * 8
    L = len(x) + n; F = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[: len(x)]
    return (1 - wet) * x + wet * y


def place(buf, clip, t, gain=1.0):
    i = int(t * SR); j = min(len(buf), i + len(clip))
    if j > i:
        buf[i:j] += clip[: j - i] * gain


# ---------------- SFX (original, procedural)
def drip():
    t = t_axis(0.35)
    f = 1400 * np.exp(-t * 9) + 650                       # falling "plink"
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26)
    click = rng.standard_normal(len(t)) * np.exp(-t * 900) * 0.25
    return reverb(body * 0.6 + click, 1.6, 0.45, seed=3)


def gasp():
    t = t_axis(0.9)
    env = np.minimum(t / 0.05, 1) * np.exp(-np.maximum(t - 0.12, 0) * 5.5)
    n = rng.standard_normal(len(t))
    breath = onepole_lp(n, 2200) - onepole_lp(n, 450)    # band-passed air
    return reverb(breath * env * 3.2, 0.9, 0.2, seed=4)


def heartbeat(t0, bpm, n, gain):
    buf = np.zeros(int(DUR * SR)); tt = t_axis(0.25)
    thump = np.sin(2 * np.pi * 52 * tt) * np.exp(-tt * 22)
    for k in range(n):
        b = t0 + k * 60.0 / bpm
        place(buf, thump, b, gain); place(buf, thump * 0.6, b + 0.16, gain)
    return buf


# ---------------- Option B: procedural score sketch (original)
def music_b():
    t = t_axis(DUR); x = np.zeros_like(t)
    # low bowed drone: D1 + detuned A1 cluster, harmonics rolled off, slow swell
    for f0, g in [(36.71, 1.0), (55.0 * 1.006, 0.55), (73.42 * 0.996, 0.35)]:
        for h in range(1, 9):
            x += g * np.sin(2 * np.pi * f0 * h * t + h * 0.7) / h ** 1.6
    x *= 0.09 * (0.35 + 0.65 * np.minimum(t / 4.0, 1)) * (1 + 0.15 * np.sin(2 * np.pi * 0.21 * t))
    # reversed-cymbal style air swell into the eye-snap, then cut
    n = onepole_lp(rng.standard_normal(len(t)), 6000)
    sw = np.clip((t - (T_EYES - 2.2)) / 2.2, 0, 1) ** 3 * (t < T_EYES)
    x += n * sw * 0.22
    # impact on the eye-snap: sub drop + metallic strike
    ti = np.maximum(t - T_EYES, 0); on = t >= T_EYES
    x += on * np.sin(2 * np.pi * (48 * np.exp(-ti * 1.5) + 28) * ti) * np.exp(-ti * 2.2) * 0.55
    for f in (412.0, 587.3, 893.1, 1311.0):
        x += on * np.sin(2 * np.pi * f * ti) * np.exp(-ti * 1.6) * 0.035
    # thin glassy harmonic after the snap (dread sustain)
    x += (t > T_EYES + 0.4) * np.sin(2 * np.pi * 1760 * t) * 0.012 * (1 + np.sin(2 * np.pi * 5.2 * t) * 0.3)
    x += heartbeat(T_EYES + 0.9, 96, 7, 0.32)
    x = reverb(x, 3.0, 0.3, seed=9)
    fade = np.clip((DUR - t) / 0.25, 0, 1)
    return x * fade


def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def snap_hit():
    t = t_axis(2.5)
    x = np.sin(2 * np.pi * (48 * np.exp(-t * 1.5) + 28) * t) * np.exp(-t * 2.2) * 0.55
    for f in (412.0, 587.3, 893.1, 1311.0):
        x += np.sin(2 * np.pi * f * t) * np.exp(-t * 1.6) * 0.035
    return reverb(x, 2.4, 0.3, seed=12)


def cloth_thump():
    t = t_axis(0.8)
    n = onepole_lp(rng.standard_normal(len(t)), 900)
    env = np.minimum(t / 0.03, 1) * np.exp(-t * 7)
    body = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 9) * 0.5
    return reverb((n * 1.6 + body) * env, 1.0, 0.25, seed=13)


def final_mix():
    """Approved: music A (ElevenLabs cold-open cue) + procedural SFX incl. B's sub-hit on the snap."""
    sfx = np.zeros(int(DUR * SR))
    for d in T_SPLASH:
        place(sfx, drip(), d, 0.55)
    place(sfx, drip(), 3.95, 0.35)                 # off-screen drip in the close-up
    place(sfx, gasp(), T_GASP, 0.6)
    place(sfx, snap_hit(), T_EYES, 0.9)
    place(sfx, cloth_thump(), T_PRESS, 0.7)
    write_wav(OUT / "sfx_final_seg01.wav", sfx)
    ff("-i", str(OUT / "vo_seg01.wav"), "-i", str(OUT / "music_A_elevenlabs_coldopen_seg01.wav"), "-i", str(OUT / "amb_seg01.wav"),
       "-i", str(OUT / "sfx_final_seg01.wav"), "-filter_complex",
       "[0]asplit[v1][v2];[1]volume=-4dB[m];[m][v1]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=400[md];"
       "[v2][md][2][3]amix=4:normalize=0,alimiter=limit=0.74:level=false,afade=t=in:d=0.02,atrim=0:10",
       "-ar", str(SR), "-c:a", "pcm_s16le", str(OUT / "final_mix_seg01.wav"))


if __name__ == "__main__":
    sfx = np.zeros(int(DUR * SR))
    for d in T_DRIPS:
        place(sfx, drip(), d, 0.55)
    place(sfx, gasp(), T_GASP, 0.6)
    write_wav(OUT / "sfx_seg01.wav", sfx)
    write_wav(OUT / "music_B_procedural_seg01.wav", music_b())

    # stems trimmed/placed to the master clock
    ff("-ss", "0.9", "-t", str(DUR), "-i", str(SRC / "amb_tentwind.mp3"), "-ar", str(SR), "-ac", "2",
       "-af", "afade=t=in:d=1.2,volume=-9dB", str(OUT / "amb_seg01.wav"))
    ff("-t", str(DUR), "-i", str(SRC / "music_coldopen.mp3"), "-ar", str(SR), "-ac", "2",
       "-af", "volume=0dB", str(OUT / "music_A_elevenlabs_coldopen_seg01.wav"))
    ff("-i", str(SRC / "vo_0217.mp3"), "-i", str(SRC / "vo_eyeopen.mp3"), "-filter_complex",
       f"[0]adelay={int(T_VO1*1000)}:all=1[a];[1]adelay={int(T_VO2*1000)}:all=1[b];"
       f"[a][b]amix=2:normalize=0,apad,atrim=0:{DUR},aresample={SR}", "-ac", "2", str(OUT / "vo_seg01.wav"))

    for tag, music in [("A", "music_A_elevenlabs_coldopen_seg01.wav"), ("B", "music_B_procedural_seg01.wav")]:
        ff("-i", str(OUT / "vo_seg01.wav"), "-i", str(OUT / music), "-i", str(OUT / "amb_seg01.wav"),
           "-i", str(OUT / "sfx_seg01.wav"), "-filter_complex",
           "[0]asplit[v1][v2];[1]volume=-4dB[m];[m][v1]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=400[md];"
           "[v2][md][2][3]amix=4:normalize=0,alimiter=limit=0.79:level=false,atrim=0:10",
           "-ar", str(SR), "-c:a", "pcm_s16le", str(OUT / f"preview_mix_{tag}.wav"))
        ff("-i", str(OUT / f"preview_mix_{tag}.wav"), "-b:a", "192k", str(OUT / f"preview_mix_{tag}.mp3"))
    final_mix()
    print("ok")

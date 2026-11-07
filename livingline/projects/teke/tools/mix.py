"""Teke — SFX design + ambience + music placement + master mix.

Inputs : audio/master/vo_master.wav, audio/master/timeline.json, audio/music/M1..M6.mp3,
         audio/sfx_src/*.mp3, audio/sfx_src2/*.mp3
Outputs: audio/master/stems/{vo,music,amb,sfx}.wav, audio/master/teke_master.wav (+ .mp3)
Deterministic: all procedural sounds are seeded.  Run from livingline/projects/teke.
"""
import json, os, subprocess
import numpy as np

SR = 48000
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
T = json.load(open("audio/master/timeline.json"))
DUR = T["duration"]; N = int(DUR * SR); MK = T["marks"]; EV = {e["id"]: e for e in T["events"]}
SC = {s["id"]: (s["start"], s["end"]) for s in T["scenes"]}
rng = np.random.default_rng(1995)
os.makedirs("audio/master/stems", exist_ok=True)

def load(path, mono=False):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ar", str(SR), "-ac", "2", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
    return a.mean(1) if mono else a

def db(x): return 10 ** (x / 20)
def stereo(m, pan=0.0):
    return np.stack([m * np.sqrt((1 - pan) / 2) * 1.414, m * np.sqrt((1 + pan) / 2) * 1.414], 1)
def place(buf, clip, t, gain=1.0):
    if clip.ndim == 1: clip = stereo(clip)
    s = int(t * SR)
    if s < 0: clip = clip[-s:]; s = 0
    e = min(len(buf), s + len(clip))
    if e > s: buf[s:e] += clip[: e - s] * gain
def onepole(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc = (1 - a) * v + a * acc; y[i] = acc
    return y
def fft_conv(x, ir):
    L = len(x) + len(ir); F = 1 << (L - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[: len(x)]
def room(x, secs=0.8, wet=0.3, seed=3, damp=4000):
    r = np.random.default_rng(seed); n = int(secs * SR)
    ir = r.standard_normal(n) * np.exp(-6.5 * np.arange(n) / n); ir = onepole(ir, damp); ir /= np.sqrt(np.sum(ir ** 2)) * 6
    return (1 - wet) * x + wet * fft_conv(x, ir)
def t_ax(d): return np.arange(int(d * SR)) / SR
def fade(a, fi=0.5, fo=0.5):
    a = a.copy(); n = len(a); i = int(fi * SR); o = int(fo * SR)
    if i: a[:i] *= np.linspace(0, 1, i)[:, None] if a.ndim == 2 else np.linspace(0, 1, i)
    if o: a[n - o:] *= np.linspace(1, 0, o)[:, None] if a.ndim == 2 else np.linspace(1, 0, o)
    return a
def loop_to(a, d):
    n = int(d * SR); xf = int(1.0 * SR); out = np.zeros((n, 2), np.float32); pos = 0
    while pos < n:
        seg = fade(a, 1.0, 1.0); e = min(n, pos + len(seg)); out[pos:e] += seg[: e - pos]; pos += len(seg) - xf
    return out

# ---------------- procedural SFX
def teke_tap(dist=0.0, seed=0, surface="wood"):
    """One 'te' or 'ke': elbow strike (body thump + knock transient) + short drag. dist 0 (at ear) .. 1 (far)."""
    r = np.random.default_rng(seed); t = t_ax(0.32)
    f0 = 95 if surface == "wood" else 70
    body = np.sin(2 * np.pi * (f0 + 40 * np.exp(-t * 40)) * t) * np.exp(-t * 28)
    knock = onepole(r.standard_normal(len(t)), 5200 if surface == "wood" else 2500) * np.exp(-t * 160) * 1.8
    drag = (onepole(r.standard_normal(len(t)), 2600) - onepole(r.standard_normal(len(t)), 500)) * np.clip((t - 0.03) / 0.04, 0, 1) * np.exp(-np.maximum(t - 0.07, 0) * 22) * 0.9
    x = body * 0.9 + knock + drag
    x = onepole(x, 9000 - 7500 * dist) * (1 - 0.8 * dist)
    return room(x, 0.6 + 1.6 * dist, 0.18 + 0.45 * dist, seed=7)
def teke_run(start_dist, end_dist, n_pairs, d, pan0=0.0, pan1=0.0, seed=0, surface="wood"):
    """n_pairs of 'te-ke' over d seconds, moving from start_dist to end_dist."""
    out = np.zeros((int((d + 2.5) * SR), 2), np.float32); r = np.random.default_rng(seed)
    for k in range(n_pairs):
        u = k / max(1, n_pairs - 1); dist = start_dist + (end_dist - start_dist) * u; pan = pan0 + (pan1 - pan0) * u
        t0 = d * (u ** 0.9) + r.uniform(-0.02, 0.02)
        for j, off in enumerate((0.0, 0.11 + r.uniform(-0.015, 0.015))):
            place(out, stereo(teke_tap(dist, seed * 100 + k * 2 + j, surface), pan), t0 + off, 1.0 if j == 0 else 0.8)
    return out
def flame_sputter():
    t = t_ax(2.6); n = rng.standard_normal(len(t))
    env = np.clip(1 - t / 2.6, 0, 1) ** 0.5 * (0.5 + 0.5 * np.sin(2 * np.pi * (3 + 9 * t) * t) ** 2)
    x = (onepole(n, 1800) - onepole(n, 200)) * env * 0.5
    pops = np.zeros_like(t)
    for k in range(7):
        i = int(rng.uniform(0.1, 2.2) * SR); L = int(0.01 * SR); pops[i:i + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / (0.003 * SR))
    return room(x + pops * 0.6, 0.5, 0.2)
def phone_click_dialtone():
    t = t_ax(2.0); click = np.zeros_like(t); L = int(0.012 * SR)
    click[:L] = rng.standard_normal(L) * np.exp(-np.arange(L) / (0.002 * SR)) * 0.8
    tone = np.sin(2 * np.pi * 400 * t) * 0.14 * (t > 0.35) * np.clip((2.0 - t) / 0.2, 0, 1)      # Japanese dial tone, 400 Hz
    return onepole(click + tone, 3400)
def frost_touch():
    t = t_ax(1.4); x = np.zeros_like(t)
    for k in range(60):
        i = int(rng.uniform(0, 1.1) * SR); L = int(0.004 * SR); x[i:i + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / (0.001 * SR)) * rng.uniform(0.1, 0.5)
    shimmer = sum(np.sin(2 * np.pi * f * t) for f in (2793, 3520, 4186)) * 0.02 * np.exp(-t * 2.5)
    return room(onepole(x, 7000) + shimmer, 1.2, 0.35)
def sub_hit(d=3.0):
    t = t_ax(d); return np.sin(2 * np.pi * (45 * np.exp(-t * 1.2) + 28) * t) * np.exp(-t * 1.6) * 0.6

S1, S2 = "audio/sfx_src/", "audio/sfx_src2/"
amb = np.zeros((N, 2), np.float32); sfx = np.zeros((N, 2), np.float32)

# ---------------- ambience beds per scene (level in dB)
def bed(path, a, b, level, lp=None, fi=1.5, fo=1.5):
    x = loop_to(load(path), b - a)
    if lp: x = np.stack([onepole(x[:, 0], lp), onepole(x[:, 1], lp)], 1)
    place(amb, fade(x, fi, fo), a, db(level))
bed(S2 + "amb_snowstorm.mp3", *SC["SCN01"], -30)
bed(S2 + "amb_steeltown.mp3", SC["SCN02"][0] - 1, SC["SCN02"][1] + 2, -27)
bed(S2 + "amb_school_lockers.mp3", MK["locker"][0], MK["locker"][0] + 15, -24, fo=4)
bed(S2 + "amb_house_storm.mp3", SC["SCN03"][0] + 20, SC["SCN03"][1], -36, fi=4)
bed(S2 + "amb_house_storm.mp3", *SC["SCN04"], -27)
bed(S2 + "stove_hiss.mp3", *SC["SCN04"], -30)
bed(S2 + "amb_library.mp3", *SC["SCN05"], -22)
wr0, wr1 = SC["SCN06"][0], MK["train_run"][0]                                   # waiting room: muffled storm + stove
bed(S2 + "amb_snowstorm.mp3", wr0, wr1, -29, lp=1800)
stove = loop_to(load(S2 + "stove_hiss.mp3"), wr1 - wr0)
g = np.ones(len(stove)); sd = MK["stove_dip"][0] - wr0; up = EV["N36"]["start"] - wr0          # flame dips on approach, rises when she leaves
g[int(sd * SR):] = 0.25; ramp = int(0.6 * SR); i = int(up * SR); g[i:i + ramp] = np.linspace(0.25, 1, ramp)[: len(g[i:i + ramp])]; g[i + ramp:] = 1
place(amb, fade(stove * g[:, None], 1.5, 1.0), wr0, db(-27))
bed(S2 + "run_snow.mp3", wr1 + 2.5, SC["SCN09"][1], -20, fi=0.3, fo=0.8)
bed(S2 + "amb_snowstorm.mp3", wr1 + 2.0, SC["SCN09"][1], -24, fi=0.5)
bed(S2 + "amb_house_storm.mp3", *SC["SCN10"], -24)
bed(S2 + "amb_steeltown.mp3", *SC["SCN11"], -31, lp=2500)
bed(S2 + "amb_snowstorm.mp3", SC["SCN12"][0], SC["SCN13"][1], -36, fo=4)

# ---------------- point SFX on marks
place(sfx, teke_run(0.95, 0.55, 3, 1.8, 0.4, 0.2, seed=1, surface="snow"), MK["teke_open"][0], db(-8))
place(sfx, load(S2 + "letter_open.mp3"), MK["letter_open"][0] - 0.3, db(4))
place(sfx, teke_run(0.9, 0.85, 2, 0.9, -0.3, -0.3, seed=2, surface="snow"), MK["teke_letter"][0], db(-14))
place(sfx, load(S2 + "paper_burn.mp3"), MK["paper_burn"][0] + 1.5, db(6))
place(sfx, load(S1 + "pa_on.mp3"), MK["pa_on"][0] - 0.2, db(10))
place(sfx, flame_sputter(), MK["stove_dip"][0], db(-6))
place(sfx, teke_run(0.95, 0.95, 1, 0.1, 0.0, 0.0, seed=3, surface="snow"), MK["teke_a"][0], db(-10))
place(sfx, teke_run(0.7, 0.6, 2, 0.8, 0.2, 0.15, seed=4, surface="snow"), MK["teke_b"][0], db(-8))
place(sfx, teke_run(0.45, 0.15, 6, 1.4, 0.1, 0.0, seed=5, surface="wood"), MK["teke_c"][0], db(-6))
place(sfx, load(S2 + "door_slide.mp3"), MK["door_slide"][0], db(0))
place(sfx, teke_run(0.2, 0.05, 3, 1.6, 0.0, -0.1, seed=6, surface="wood"), MK["door_slide"][0] + 2.6, db(-8))
place(sfx, stereo(frost_touch(), -0.2), MK["ankle_touch"][0], db(-6))
place(sfx, teke_run(0.1, 0.95, 7, 2.8, 0.0, 0.5, seed=7, surface="wood"), MK["teke_away"][0], db(-7))
place(sfx, stereo(sub_hit(2.5)), MK["dead_air"][0] + 1.55, db(-10))                    # breath-in hit as the laugh arrives
place(sfx, load(S2 + "phone_ring.mp3"), MK["phone_ring"][0] - 0.2, db(2))
place(sfx, stereo(phone_click_dialtone()), MK["phone_click"][0], db(-4))
place(sfx, load(S1 + "horn_far.mp3"), MK["train_run"][0] - 1.0, db(-10))
place(sfx, load(S1 + "train_pass_fade.mp3"), MK["train_run"][0] + 0.5, db(-12))
place(sfx, fade(load(S2 + "amb_snowstorm.mp3")[: int(4 * SR)], 0.3, 2), EV["N49"]["start"] - 0.6, db(-14))   # gust through the open window

# ---------------- music cues on scene spans, fit to length
music = np.zeros((N, 2), np.float32)
CUES = [("M1", 0.0, SC["SCN01"][1]), ("M2", SC["SCN02"][0], SC["SCN03"][1]), ("M3", SC["SCN04"][0], SC["SCN05"][1]),
        ("M4", SC["SCN06"][0], SC["SCN08"][1]), ("M5", SC["SCN09"][0], SC["SCN10"][1]), ("M6", SC["SCN11"][0], DUR)]
have_music = all(os.path.exists(f"audio/music/{c}.mp3") for c, _, _ in CUES)
if have_music:
    for c, a, b in CUES:
        x = load(f"audio/music/{c}.mp3")[: int((b - a + 1.5) * SR)]
        place(music, fade(x, 0.05 if c == "M1" else 1.2, 1.5), a, db(-6))

# ---------------- automation: dead air, side-chain ducking of music under dialogue
vo = load("audio/master/vo_master.wav")[:N]
if len(vo) < N: vo = np.vstack([vo, np.zeros((N - len(vo), 2), np.float32)])
env = np.abs(vo).max(1); win = int(0.12 * SR)
env = np.convolve(env, np.ones(win) / win, "same"); duck = np.clip(1 - 3.2 * env, 0.42, 1.0)
duck = onepole(duck, 3.0)
music *= duck[:, None]
# director's music automation (start, end, gain dB) with 0.3 s ramps — generated cues follow timing prompts only loosely
def win_gain(a, b, g):
    out = np.ones(N, np.float32); r = int(0.3 * SR); i, j = int(a * SR), int(b * SR)
    out[i:j] = db(g); out[max(0, i - r):i] = np.linspace(1, db(g), i - max(0, i - r)); out[j:j + r] = np.linspace(db(g), 1, len(out[j:j + r]))
    return out
AUTO = [(EV["G01"]["start"] - 0.4, EV["G01"]["start"] + EV["G01"]["dur"] + 0.6, -60),          # silence under the cold-open whisper
        (MK["stove_dip"][0], MK["teke_c"][0] + 2.5, -16),                                         # flame dips; crawl approaches in near silence
        (MK["ankle_touch"][0], EV["A09"]["start"] + EV["A09"]["dur"] + 0.4, -12),                 # touch, question 1, answer
        (EV["G03"]["start"] - 0.5, EV["G03"]["start"] + EV["G03"]["dur"] + 0.4, -60),            # silence under the ear-side question
        (MK["phone_click"][0], MK["train_run"][0], -60)]                                          # click → dial tone → run
for a, b, g in AUTO: music *= win_gain(a, b, g)[:, None]
da = MK["dead_air"][0]; i0, i1 = int(da * SR), int((da + 1.55) * SR)
for b in (music, amb): b[i0:i1] = 0.0                      # true dead air after 'Kashima Reiko'
for b in (music, amb): b[i1:i1 + int(0.8 * SR)] *= np.linspace(0, 1, int(0.8 * SR))[:, None]

def write(path, a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", path], input=np.ascontiguousarray(a, np.float32).tobytes(), check=True)
for name, a in (("vo", vo), ("music", music), ("amb", amb), ("sfx", sfx)): write(f"audio/master/stems/{name}.wav", a)
amb *= db(12)                                   # beds sit continuously under the voice, like the reference
mix = vo * db(0) + music + amb + sfx
write("audio/master/premaster.wav", mix)
# loudness: two-pass loudnorm to -14 LUFS, -1.0 dBTP
r = subprocess.run(["ffmpeg", "-i", "audio/master/premaster.wav", "-af", "loudnorm=I=-14:TP=-1.0:LRA=8:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
js = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/master/premaster.wav", "-af",
                f"loudnorm=I=-14:TP=-1.0:LRA=8:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true,alimiter=limit=0.80:level=false:attack=3:release=60",
                "-ar", str(SR), "-c:a", "pcm_s24le", "audio/master/teke_master.wav"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "audio/master/teke_master.wav", "-b:a", "256k", "audio/master/teke_master.mp3"], check=True)
print("music placed:", have_music, "| duration %.2fs" % DUR)

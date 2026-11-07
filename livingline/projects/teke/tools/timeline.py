"""Teke — dialogue master timeline (single source of timing for music, SFX and animation).

Builds audio/master/vo_master.wav (48 kHz stereo, all dialogue processed and placed) and
audio/master/timeline.json (every event's start/duration, scene spans, SFX/music marks).
Run from livingline/projects/teke:  python3 tools/timeline.py
"""
import json, os, subprocess
import numpy as np

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = "audio/master"; os.makedirs(OUT, exist_ok=True); TMP = OUT + "/tmp"; os.makedirs(TMP, exist_ok=True)

# processing chains (ffmpeg -af) per voice type
TRIM = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.12,areverse"
FX = {
    "narr":  TRIM + ",atempo=1.07,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120,highpass=f=70",
    "char":  TRIM + ",highpass=f=90,aecho=0.85:0.5:23|41:0.12|0.07",                       # small room
    "pa":    TRIM + ",highpass=f=420,lowpass=f=3300,acrusher=bits=10:mix=0.25,volume=1.6,aecho=0.8:0.7:120|260|430:0.38|0.24|0.14",  # platform loudspeaker + slap
    "phone": TRIM + ",highpass=f=320,lowpass=f=3100,acrusher=bits=9:mix=0.3,volume=1.4",  # 1995 phone line
    "ghost": TRIM + ",highpass=f=120,lowpass=f=9000,aecho=0.9:0.55:35|85|170|290:0.30|0.22|0.15|0.09",  # cold close whisper
}
def kind(i):
    if i.startswith("N"): return "narr"
    if i == "P01": return "pa"
    if i in ("S03", "S04"): return "phone"
    if i.startswith("G"): return "ghost"
    return "char"
PAN = {"G03": -0.75}            # the ear-side question sits in the left ear

def path(i):
    return f"audio/vo/narrator/{i}.mp3" if i.startswith("N") else f"audio/vo/characters/{i}.mp3"

S = lambda name: ("scene", name)
G = lambda s: ("gap", s)
M = lambda name: ("mark", name)
V = lambda *ids: [("vo", i) for i in ids]
EV = []
def add(*xs):
    for x in xs:
        EV.extend(x if isinstance(x, list) else [x])

add(S("SCN01"), G(1.0), V("N01"), M("teke_open"), G(2.2), V("N02", "N03", "N04"), G(0.6), V("G01"), G(0.8), V("N05"), G(1.0), V("N06"), G(0.3), M("title"), G(4.0))
add(S("SCN02"), V("N07"), G(0.5), V("N08"), G(1.2))
add(S("SCN03"), M("locker"), G(0.8), V("N09", "N10"), M("letter_open"), G(0.6), V("A01", "A02"), M("teke_letter"), G(1.6), V("A03", "N11", "A04"), G(0.6), V("N12", "N13"), G(0.4), V("A05", "N14"), G(1.4))
add(S("SCN04"), V("N15", "S01"), G(0.3), V("A06", "N16"), G(0.6), V("S02", "A07"), G(0.4), M("paper_burn"), V("N17"), G(1.6))
add(S("SCN05"), V("N18", "N19"), M("library"), G(0.6), V("L01", "A08"), G(0.3), V("L02"), G(0.4), V("L03"), G(0.8), V("N20"), G(1.6))
add(S("SCN06"), V("N21"), G(0.8), V("N22", "N23"), M("pa_on"), G(0.6), V("P01"), G(0.5), V("N24", "N25"), M("stove_dip"), G(1.0), V("N26"), G(1.2),
    M("teke_a"), G(1.0), V("N27"), M("teke_b"), G(1.4), V("N28"), M("teke_c"), G(1.8), V("N29"), G(1.0), V("N30"), G(1.2))
add(S("SCN07"), M("door_slide"), G(2.4), V("N31", "N32"), G(0.6), M("ankle_touch"), V("N33"), G(0.8), V("G02"), G(1.4), V("A09"), G(0.5), V("N34"), G(1.2),
    M("teke_away"), G(3.0), V("N35", "N36"), G(0.6), V("G03"), G(0.6), V("N37"), G(1.4))
add(S("SCN08"), V("N38", "N39", "N40"), G(0.6), V("A10"), G(0.4), V("N41"), G(0.6), V("N42"), G(0.8), V("A11"), M("dead_air"), G(1.6), V("N43"), G(0.3), V("G05"), G(0.4), V("G04"), G(0.8), V("N44"), G(1.8))
add(S("SCN09"), M("phone_ring"), G(3.0), V("N45"), G(0.5), V("S03"), G(0.5), V("N46"), G(0.3), V("A12"), G(0.4), V("S04"), G(0.3), M("phone_click"), G(2.0), V("N47"), G(0.8), M("train_run"), V("N48"), G(3.0))
add(S("SCN10"), V("N49", "N50"), G(0.5), V("S05"), G(0.6), V("N51"), G(0.5), V("S06"), G(0.8), V("N52"), G(0.6), V("N53"), G(1.0), V("N54"), G(2.0))
add(S("SCN11"), V("N55", "N56"), G(2.0))
add(S("SCN12"), V("N57"), G(0.6), V("N58"), G(1.6))
add(S("SCN13"), V("N59"), G(0.8), V("N60"), G(0.6), V("N61"), G(1.0), V("N62"), G(0.8), V("N63"), G(0.5), M("endcard"), G(5.0))

def render(i):
    out = f"{TMP}/{i}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path(i), "-af", FX[kind(i)], "-ar", str(SR), "-ac", "1", out], check=True)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", out, "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()

t = 0.0; clips = []; events = []; scenes = []; marks = {}
for typ, val in EV:
    if typ == "scene":
        if scenes: scenes[-1]["end"] = round(t, 3)
        scenes.append({"id": val, "start": round(t, 3)})
    elif typ == "gap":
        t += val if val >= 1.5 else round(val * 0.9, 3)   # tighten short gaps 10%; keep dead-air / SFX holds
    elif typ == "mark":
        marks.setdefault(val, []).append(round(t, 3))
    else:
        a = render(val)
        if kind(val) == "narr": gap_default = 0.40
        else: gap_default = 0.35
        clips.append((t, val, a)); d = len(a) / SR
        events.append({"id": val, "start": round(t, 3), "dur": round(d, 3), "kind": kind(val)})
        t += d + gap_default
scenes[-1]["end"] = round(t, 3)
total = t
buf = np.zeros((int(total * SR) + SR, 2), np.float32)
for st, i, a in clips:
    p = PAN.get(i, 0.0); gl, gr = np.sqrt((1 - p) / 2) * 1.414, np.sqrt((1 + p) / 2) * 1.414
    s = int(st * SR); buf[s:s + len(a), 0] += a * gl; buf[s:s + len(a), 1] += a * gr
buf = buf[: int(total * SR)]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", f"{OUT}/vo_master.wav"], input=buf.tobytes(), check=True)
json.dump({"sr": SR, "duration": round(total, 3), "scenes": scenes, "marks": marks, "events": events}, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print("total %.2fs (%d:%05.2f)" % (total, int(total // 60), total % 60))
for sc in scenes: print(f"  {sc['id']}  {sc['start']:7.2f} → {sc['end']:7.2f}  ({sc['end']-sc['start']:5.1f}s)")

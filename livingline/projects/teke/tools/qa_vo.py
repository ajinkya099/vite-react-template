"""Whisper QA for narrator takes: transcript, similarity to script, duration, edge silences."""
import json, subprocess, numpy as np, difflib, re, sys
from faster_whisper import WhisperModel
m = WhisperModel("medium", device="cpu", compute_type="int8")
def load(f):
    raw = subprocess.run(["ffmpeg","-v","error","-i",f,"-ac","1","-ar","16000","-f","f32le","-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32)
def norm(s):
    s = re.sub(r'[^ऀ-ॿ぀-ヿ一-鿿a-zA-Z0-9 ]', ' ', s)
    s = s.replace('़','').replace('ं','').replace('ँ','')        # nukta / nasal marks vary in ASR output
    return re.sub(r'\s+',' ',s).strip()
def edges(a, thr=0.01):
    idx = np.where(np.abs(a) > thr)[0]
    return (0,0) if len(idx)==0 else (idx[0]/16000, (len(a)-idx[-1])/16000)
rows=[]
L = json.load(open('audio/vo/narrator_lines.json'))
for l in L:
    f = f"audio/vo/narrator/{l['id']}.mp3"; a = load(f)
    segs,_ = m.transcribe(a, language="hi", beam_size=5)
    t = " ".join(s.text.strip() for s in segs)
    sim = difflib.SequenceMatcher(None, norm(l['text']), norm(t)).ratio()
    lead, tail = edges(a)
    rows.append(dict(id=l['id'], dur=round(len(a)/16000,2), lead=round(lead,2), tail=round(tail,2), sim=round(sim,2), asr=t))
    print(f"{l['id']} {len(a)/16000:5.2f}s sim={sim:.2f} | {t}", flush=True)
for f, lang in [("ghostjp_chloe","ja"),("ghostjp_quinn","ja"),("ghostjp_skye","ja"),("pajp_marcus","ja"),("pajp_kevin","ja"),("pajp_evan","ja"),("shun_peanutzippy","hi"),("shun_pixie","hi"),("shun_benji","hi"),("lib_mabel","hi"),("lib_tallulah","hi"),("lib_vesper","hi")]:
    a = load(f"audio/auditions_v2/{f}.mp3"); segs,_ = m.transcribe(a, language=lang, beam_size=5)
    print(f"AUD {f:18s} {len(a)/16000:5.2f}s | {' '.join(s.text.strip() for s in segs)}", flush=True)
json.dump(rows, open('audio/vo/narrator_qa.json','w'), ensure_ascii=False, indent=1)

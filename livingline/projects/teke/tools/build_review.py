"""Build review/index.html from the markdown docs (v2)."""
import re, html, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
def inline(t):
    t = html.escape(t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)
    return re.sub(r'`(.+?)`', r'<code>\1</code>', t)
def md(s):
    out = []; lines = s.split('\n'); i = 0
    while i < len(lines):
        l = lines[i]
        if l.startswith('|'):
            tb = []
            while i < len(lines) and lines[i].startswith('|'): tb.append(lines[i]); i += 1
            cells = [[c.strip() for c in r.strip('|').split('|')] for r in tb if not re.match(r'^\|[\s\-|:]+\|$', r)]
            h = '<div class="tw"><table><thead><tr>' + ''.join(f'<th>{inline(c)}</th>' for c in cells[0]) + '</tr></thead><tbody>'
            for r in cells[1:]: h += '<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in r) + '</tr>'
            out.append(h + '</tbody></table></div>'); continue
        if l.startswith('### '): out.append(f'<h3>{inline(l[4:])}</h3>')
        elif l.startswith('## '): out.append(f'<h2>{inline(l[3:])}</h2>')
        elif l.startswith('# '): pass
        elif l.startswith('> '): out.append(f'<blockquote>{inline(l[2:])}</blockquote>')
        elif l.startswith('- '):
            items = []
            while i < len(lines) and lines[i].startswith('- '): items.append(f'<li>{inline(lines[i][2:])}</li>'); i += 1
            out.append('<ul>' + ''.join(items) + '</ul>'); continue
        elif l.strip() == '---': out.append('<hr>')
        elif l.strip(): out.append(f'<p>{inline(l)}</p>')
        i += 1
    return '\n'.join(out)
roles = [
 ("आओई · Aoi (16)", "त… तुम्हारे पैर बावन वाली पैसेंजर में हैं… प्लेटफ़ॉर्म नंबर तीन पर।  (audition line from v1; same voices)",
  [("anaya_maya","Maya","cleanest transcript",1),("anaya_zoe","Zoe","",0),("anaya_pixie","Pixie","",0),("anaya_luna","Luna","may say 'पहर' for 'पैर'",0)]),
 ("शुन · Shun (9)", "नी-चान… खिड़की के बाहर कुछ है… टेके… टेके…",
  [("shun_pixie","Pixie","7.8 s · cleanest transcript, lightest timbre",1),("shun_peanutzippy","Peanut Zippy (your Living Line voice)","9.9 s",0),("shun_benji","Benji","10.4 s · dropped one 'टेके'",0)]),
 ("लाइब्रेरियन · Librarian", "हर सर्दी कोई न कोई बच्चा यही ढूँढने आता है… पचास साल पहले।",
  [("lib_tallulah","Tallulah","10.1 s · slowest, cleanest transcript",1),("lib_mabel","Mabel","8.9 s",0),("lib_vesper","Vesper","8.0 s",0)]),
 ("テケテケ · Ghost (Japanese)", "私の… 足は… どこ?",
  [("ghostjp_chloe","Chloe","clear Japanese, whispered",1),("ghostjp_quinn","Quinn","",0),("ghostjp_skye","Skye","",0)]),
 ("駅アナウンス · Station announcer (Japanese)", "お客様にお知らせいたします。大雪のため、最終列車は二十分ほど遅れております。",
  [("pajp_kevin","Kevin","5.8 s · crisp, natural JR cadence",1),("pajp_marcus","Marcus","7.1 s",0),("pajp_evan","Evan","8.0 s",0)]),
]
aud = '''  <section class="aud">
    <div class="eyebrow">Audio checkpoint 2 · casting approved</div>
    <h2>Narration done. Now pick the character voices.</h2>
    <p class="lede">All 63 narration lines are generated in Landon's voice, and a local Whisper model checked each one against the script. Three were regenerated: two said "Machine Expressway" instead of "Meishin", and one had a slurred ending. Below is the full narration in order with reference-style pauses, before any music or effects (8:27). Then the five roles still to cast, loudness-matched. My marked picks come only from measurements, so please choose by ear.</p>
    <div class="ad rec" style="margin:10px 0 18px"><b>Full narration preview · Landon · 8:27</b><span>Dry voice with planned pauses; music, ambience and effects come next.</span><audio id="a_narr_full" controls preload="none" src="aud/narration_landon_preview.mp3"></audio></div>
'''
for t, line, c in roles:
    aud += f'    <h3>{t}</h3><p class="vo">“{line}”</p><div class="auds">'
    for fid, name, note, rec in c:
        aud += f'<div class="ad{" rec" if rec else ""}"><b>{name}{" · my pick" if rec else ""}</b><span>{note}</span><audio id="a_{fid}" controls preload="none" src="aud/{fid}.mp3"></audio></div>'
    aud += '</div>\n'
aud += '  </section>\n'
script = md(open('SCRIPT_HI_v2.md').read()); treat = md(open('DIRECTOR_TREATMENT_v2.md').read()); audio = md(open('AUDIO_DIRECTION.md').read())
page = open('tools/page_template.html').read()
for k, v in {"{SCRIPT}": script, "{TREAT}": treat, "{AUDIO}": audio, "{AUD}": aud}.items(): page = page.replace(k, v)
open('review/index.html', 'w').write(page); print(len(page))

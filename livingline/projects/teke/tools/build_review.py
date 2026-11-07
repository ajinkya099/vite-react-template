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
 ("नैरेटर · Narrator (still valid)", "अगर कभी कोहरे वाली रात में… तो भागना मत। वो आपसे तेज़ है।",
  [("narr_landon","Landon","10.3 s · slowest, most deliberate · Roopkund voice",1),("narr_katie","Katie Narrator (your Living Line voice)","8.9 s",0),("narr_gideon","Gideon","9.8 s",0),("narr_alistair","Alistair","9.6 s",0)]),
 ("आओई · Aoi (same voices, auditioned on the old Anaya line)", "त… तुम्हारे पैर बावन वाली पैसेंजर में हैं… प्लेटफ़ॉर्म नंबर तीन पर।",
  [("anaya_maya","Maya","4.4 s · cleanest transcript",1),("anaya_zoe","Zoe","4.7 s",0),("anaya_pixie","Pixie","4.8 s",0),("anaya_luna","Luna","4.7 s · may say 'पहर' for 'पैर'",0)]),
 ("テケテケ · the ghost (whisper; will be re-auditioned in Japanese)", "मेरे… पैर… कहाँ हैं?",
  [("chanda_chloe","Chloe","quietest, so most likely a true whisper",1),("chanda_quinn","Quinn","",0),("chanda_skye","Skye","loudest, so least whispered",0)]),
]
aud = '''  <section class="aud">
    <details><summary>Earlier voice auditions that still apply (loudness-matched)</summary>
    <p class="lede">These voices carry over to v2. Shun (a 9-year-old boy), the librarian, the Japanese station announcer and the Japanese-language ghost line need new auditions after you approve the script (about 3 credits).</p>
'''
for t, line, c in roles:
    aud += f'    <h3>{t}</h3><p class="vo">“{line}”</p><div class="auds">'
    for fid, name, note, rec in c:
        aud += f'<div class="ad{" rec" if rec else ""}"><b>{name}{" · my pick" if rec else ""}</b><span>{note}</span><audio id="a_{fid}" controls preload="none" src="aud/{fid}.mp3"></audio></div>'
    aud += '</div>\n'
aud += '    </details>\n  </section>\n'
script = md(open('SCRIPT_HI_v2.md').read()); treat = md(open('DIRECTOR_TREATMENT_v2.md').read()); audio = md(open('AUDIO_DIRECTION.md').read())
page = open('tools/page_template.html').read()
for k, v in {"{SCRIPT}": script, "{TREAT}": treat, "{AUDIO}": audio, "{AUD}": aud}.items(): page = page.replace(k, v)
open('review/index.html', 'w').write(page); print(len(page))

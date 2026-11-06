/* Living Line — Segment 01 master posing. Every value is a pure function of film time t (s).
   Frame-exact beats use f = round(t*24). Timing mirrors scripts/make_audio.py and STORYBOARD.md v1. */
(function () {
  const { rng, clamp, smooth, lerp } = window.INK;
  const FPS = 24, T_CUT = 3.6, T_SNAP = 5.0, T_GASP = 5.3, T_DART = 7.8, T_PRESS = 8.4;
  const pulse = (t, t0, up, down) => t < t0 ? 0 : t < t0 + up ? smooth(t0, t0 + up, t) : 1 - smooth(t0 + up, t0 + up + down, t);
  const easeOutBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };
  // seeded tremor on twos (holds 2 frames, like hand-drawn shakes)
  function tremor(t, amp, seed) { const k = Math.floor(t * 12), r = rng(seed + k * 7919); return [(r() - 0.5) * 2 * amp, (r() - 0.5) * 2 * amp]; }

  function closeupPose(t) {
    const f = Math.round(t * FPS), fs = Math.round(T_SNAP * FPS);
    const p = { t };
    // eyes: REM twitches, anticipation squeeze, snap on ones (f-2 half, f-1 most, f overshoot), settle
    let open = 0;
    if (f === fs - 2) open = 0.35; else if (f === fs - 1) open = 0.8; else if (f >= fs) open = 1 + 0.12 * (1 - smooth(T_SNAP, T_SNAP + 0.17, t));
    p.eyeOpen = open;
    p.flutter = f < fs - 2 ? Math.max(pulse(t, 3.88, 0.06, 0.18) * 0.8, pulse(t, 4.38, 0.06, 0.2) * 0.9, smooth(4.5, 4.88, t)) : 0;
    p.browKnit = f < fs - 2 ? lerp(0.4, 1, smooth(4.4, 4.88, t)) : lerp(0.9, 0.55, smooth(T_SNAP, T_SNAP + 0.4, t));
    p.browRaise = f < fs - 1 ? 0 : 1 + 0.15 * (1 - smooth(T_SNAP, T_SNAP + 0.25, t));
    p.pupil = f < fs ? 0.55 : lerp(0.55, 0.36, smooth(T_SNAP, T_SNAP + 0.13, t));
    // head: lift off the pillow on the snap, follow-through settle
    const lift = f < fs - 1 ? 0 : t < T_SNAP + 0.12 ? -12 * easeOutBack(clamp((t - T_SNAP + 0.04) / 0.16)) : lerp(-12, -4, smooth(T_SNAP + 0.12, T_SNAP + 0.5, t));
    p.headY = lift; p.headX = 0;
    // mouth: shock part, gasp in the narration pause, then shivering clench on twos
    p.mouthOpen = f < fs ? 0 : t < T_GASP ? 0.15 : t < 5.9 ? lerp(0.15, 0.75, smooth(T_GASP, T_GASP + 0.2, t)) : lerp(0.75, 0.1, smooth(5.9, 6.25, t));
    p.clench = t < 6.25 || t > 9.7 ? 0 : 0.55 + 0.35 * ((Math.floor(t * 12) % 3) === 0 ? 1 : 0);
    p.vapor = t < T_GASP ? -1 : (t - T_GASP) / 1.15;
    // shiver 6.1–9.7, frozen stillness after
    if (t > 6.1 && t < 9.7) { const [x, y] = tremor(t, 2.6, 17); p.headX += x; p.headY += y; }
    // gaze: wide centre, dart screen-left at 7.8 (2-frame move), hold
    p.gazeX = lerp(0, -0.85, smooth(T_DART, T_DART + 2 / FPS, t)); p.gazeY = -0.15;
    p.sweat = f < fs ? 0.0 : 1; p.sweatSlide = smooth(6.5, 8.0, t);
    p.breath = t < T_SNAP ? Math.sin((t - T_CUT) * 1.6) * 0.5 + 0.5 : (Math.sin(t * 7.5) * 0.5 + 0.5) * (t < 9.7 ? 1 : 0);
    p.wallPress = pulse(t, T_PRESS, 0.22, 0.45);
    p.lantern = (f === fs || f === fs + 1 ? 1.15 : 1) * lerp(1, 0.7, smooth(9.0, 9.7, t));
    return p;
  }

  function camera(t) {
    const f = Math.round(t * FPS), fs = Math.round(T_SNAP * FPS);
    const jolt = f >= fs && f < fs + 5 ? [6, -4].map(v => v * (1 - (f - fs) / 5)) : [0, 0];
    const push = t < T_SNAP ? lerp(1, 1.015, smooth(T_CUT, T_SNAP, t)) : lerp(1.015, 1.055, smooth(5.3, 9.7, t));
    return { jolt, push, cx: 1300, cy: 380 };
  }

  function renderAt(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 1920, 1080);
    if (t >= T_CUT) {
      const c = camera(t);
      ctx.translate(c.cx + c.jolt[0], c.cy + c.jolt[1]); ctx.scale(c.push, c.push); ctx.translate(-c.cx, -c.cy);
      window.SHOT_CLOSEUP.drawCloseup(ctx, closeupPose(t));
    } else if (window.SHOT_WIDE) {
      window.SHOT_WIDE.drawWide(ctx, t);
    }
    ctx.restore();
  }
  window.SEG01 = { renderAt, closeupPose, camera, T_CUT, T_SNAP };
})();

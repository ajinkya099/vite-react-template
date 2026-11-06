/* Living Line — Segment 01 master posing + camera direction (v3). Pure functions of film time t (s).
   Timing mirrors scripts/make_audio.py and STORYBOARD.md. Frame-exact beats use f = round(t*24).

   DIRECTOR'S CAMERA NOTES — SHOT 2 (close-up, 3.60–10.00)
   3.60–4.90  CREEP      slow push 1.000→1.030 on his eyes, sine in-out. Dread builds while he sleeps.
   4.90–5.00  HOLD       dead still for 2 frames: the breath before the hit.
   5.00       JOLT       8 px kick up-right on the snap frame, decays over 5 frames; punch-in 1.030→1.045 (expo out, 0.2 s).
   5.20–7.70  FLOAT      faint handheld drift ±3 px at ~0.5 Hz (smooth noise). He's awake, we're uneasy.
   7.78–8.60  PAN        motivated by his eye dart: drift 70 px toward screen-left + push to 1.065 (power2 in-out),
                         bringing the tent wall into frame just before it presses in at 8.40.
   8.60–9.70  HOLD+FLOAT new framing, float halves.
   9.70–10.00 LOCK       locked off, no float. Stillness carries the cut to segment 02.
   (Shot 1 notes live in STORYBOARD.md; the wide is built after the style frame is approved.) */
(function () {
  const { rng, makeNoise, clamp, smooth, lerp } = window.INK;
  const FPS = 24, T_CUT = 3.6, T_SNAP = 5.0, T_GASP = 5.3, T_DART = 7.8, T_PRESS = 8.4, T_FREEZE = 9.7;
  const N1 = makeNoise(17), N2 = makeNoise(29), N3 = makeNoise(43);
  const pulse = (t, t0, up, down) => t < t0 ? 0 : t < t0 + up ? smooth(t0, t0 + up, t) : 1 - smooth(t0 + up, t0 + up + down, t);
  const easeOutBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };
  const easeOutQuart = (x) => 1 - (1 - clamp(x)) ** 4;
  const easeOutExpo = (x) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x));
  const inOut2 = (x) => { x = clamp(x); return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
  const sn = (nz, x) => (nz(x, 0.5) - 0.5) * 2;     // smooth signed noise -1..1

  // head offset (local px): lift on the snap with follow-through, then a continuous, fluid shiver
  function headOffset(t) {
    let y = 0, x = 0;
    if (t >= T_SNAP - 1 / FPS) y = t < T_SNAP + 0.12 ? -12 * easeOutBack(clamp((t - T_SNAP + 1 / FPS) / 0.16)) : lerp(-12, -4, smooth(T_SNAP + 0.12, T_SNAP + 0.55, t));
    const shiver = smooth(6.0, 6.4, t) * (1 - smooth(9.5, T_FREEZE, t));
    x += shiver * 2.2 * sn(N1, t * 9.0); y += shiver * 1.8 * sn(N2, t * 10.5);
    // eyes lead, head follows: small turn toward the wall 4 frames after the dart
    x += -9 * inOut2((t - T_DART - 4 / FPS) / 0.5);
    return [x, y];
  }

  function closeupPose(t) {
    const f = Math.round(t * FPS), fs = Math.round(T_SNAP * FPS);
    const p = { t };
    // lids: REM twitches, anticipation squeeze, snap on ones (half / most / overshoot), settle
    let open = 0;
    if (f === fs - 2) open = 0.35; else if (f === fs - 1) open = 0.8; else if (f >= fs) open = 1 + 0.12 * (1 - smooth(T_SNAP, T_SNAP + 0.17, t));
    // a slow, frightened blink at 6.9 (lids only, 5 frames)
    if (t > 6.9 && t < 6.9 + 5 / FPS) open *= 1 - Math.sin(((t - 6.9) / (5 / FPS)) * Math.PI) * 0.9;
    p.eyeOpen = open;
    p.flutter = f < fs - 2 ? Math.max(pulse(t, 3.88, 0.06, 0.18) * 0.8, pulse(t, 4.38, 0.06, 0.2) * 0.9, smooth(4.5, 4.88, t)) : 0;
    // brows LEAD the lids by one frame and overshoot
    p.browRaise = t < T_SNAP - 3 / FPS ? 0 : 1.15 * easeOutQuart((t - (T_SNAP - 3 / FPS)) / (3 / FPS)) - 0.15 * smooth(T_SNAP, T_SNAP + 0.3, t);
    p.browKnit = f < fs - 2 ? lerp(0.4, 1, smooth(4.4, 4.88, t)) : lerp(0.9, 0.55, smooth(T_SNAP, T_SNAP + 0.4, t)) + 0.25 * smooth(T_DART, T_DART + 0.3, t);
    p.pupil = f < fs ? 0.55 : lerp(0.55, 0.36, smooth(T_SNAP, T_SNAP + 0.13, t));
    const [hx, hy] = headOffset(t), [lx, ly] = headOffset(t - 0.07);
    p.headX = hx; p.headY = hy;
    p.hairLagX = (lx - hx) * 0.9; p.hairLagY = (ly - hy) * 0.9;            // hair follow-through
    p.headRot = -0.012 * inOut2((t - T_DART - 4 / FPS) / 0.5);
    // mouth: shock part -> gasp (in the VO pause) -> close -> shivering clench (smooth, not stepped)
    p.mouthOpen = f < fs ? 0 : t < T_GASP ? 0.18 : t < 5.9 ? lerp(0.18, 0.7, easeOutQuart((t - T_GASP) / 0.2)) : lerp(0.7, 0.06, smooth(5.9, 6.3, t));
    p.clench = smooth(6.2, 6.5, t) * (1 - smooth(9.5, T_FREEZE, t)) * (0.62 + 0.22 * sn(N3, t * 6));
    p.vapor = t < T_GASP ? -1 : (t - T_GASP) / 1.15;
    // gaze: centre -> dart screen-left (3-frame ease-out), hold
    p.gazeX = -0.85 * easeOutQuart((t - T_DART) / (3 / FPS)); p.gazeY = -0.15 + 0.05 * easeOutQuart((t - T_DART) / (3 / FPS));
    p.sweat = smooth(T_SNAP, T_SNAP + 0.3, t); p.sweatSlide = smooth(6.5, 8.0, t);
    p.breath = t < T_SNAP ? Math.sin((t - T_CUT) * 1.6) * 0.5 + 0.5 : (Math.sin(t * 7.0) * 0.5 + 0.5) * (1 - smooth(9.5, T_FREEZE, t)) * 0.7;
    p.wallPress = pulse(t, T_PRESS, 0.22, 0.5);
    const flick = 1 + 0.05 * sn(N1, t * 3.1 + 40);
    p.lantern = flick * (f === fs || f === fs + 1 ? 1.12 : 1) * lerp(1, 0.7, smooth(9.0, T_FREEZE, t));
    return p;
  }

  function camera(t) {
    const f = Math.round(t * FPS), fs = Math.round(T_SNAP * FPS);
    let push = lerp(1, 1.03, smooth(T_CUT, 4.9, t));
    push += 0.015 * easeOutExpo((t - T_SNAP) / 0.2);
    push += 0.02 * inOut2((t - 7.78) / 0.82);
    const jolt = f >= fs && f < fs + 5 ? [8 * (1 - (f - fs) / 5), -6 * (1 - (f - fs) / 5)] : [0, 0];
    const fl = smooth(5.2, 5.6, t) * (t > 8.6 ? 0.5 : 1) * (1 - smooth(9.55, T_FREEZE, t));
    const float = [fl * 3 * sn(N2, t * 0.5 + 9), fl * 2.4 * sn(N3, t * 0.45 + 3)];
    const pan = 70 * inOut2((t - 7.78) / 0.82);
    return { push, ox: jolt[0] + float[0] + pan, oy: jolt[1] + float[1], cx: 1300, cy: 380 };
  }

  function renderAt(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 1920, 1080);
    if (t >= T_CUT - 1e-6) {
      const c = camera(t);
      ctx.translate(c.cx + c.ox, c.cy + c.oy); ctx.scale(c.push, c.push); ctx.translate(-c.cx, -c.cy);
      window.SHOT_CLOSEUP.drawCloseup(ctx, closeupPose(t));
    } else if (window.SHOT_WIDE) {
      window.SHOT_WIDE.drawWide(ctx, t);
    }
    ctx.restore();
  }
  window.SEG01 = { renderAt, closeupPose, camera, T_CUT, T_SNAP };
})();

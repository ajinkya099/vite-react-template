/* Living Line — Shot 1 wide: tent interior from the foot, 0.00–3.60. Pure code drawing (Canvas2D).
   DIRECTOR'S NOTES: 0.00–0.50 locked on black (only the forming drip glints). 0.50–1.40 the lantern ember
   fades up. 0.50–3.60 slow dolly-in 1.00→1.06 (sine in-out) with a 20 px tilt down toward the sleeper.
   The right wall breathes in on two gusts (1.0–2.6, 3.0–3.6). Drip 1 falls at 0.30, drip 2 at 2.15 and splashes.
   LIGHT: moon key from screen-right wall (outside), lantern as a small warm practical; everything else falls to ink. */
(function () {
  const { rng, makeNoise, sample, pathFrom, fill, stroke, taper, clump, hatch, clipped, paper, radial, lerp, clamp, smooth } = window.INK;
  const C = window.SHOT_CLOSEUP.C;
  const N = makeNoise(77), sn = (x) => (N(x, 0.3) - 0.5) * 2;
  const pulse = (t, a, b) => smooth(a, a + (b - a) * 0.45, t) * (1 - smooth(a + (b - a) * 0.55, b, t));
  const HUB = [960, 96], LAMP = [960, 330], DRIP = [1062, 252], FLOOR = 742;
  const BACK = [[612, 672], [690, 420], [820, 268], [960, 222], [1100, 268], [1230, 420], [1308, 672]];

  function gust(t) { return Math.max(pulse(t, 1.0, 2.6), 0.6 * pulse(t, 3.0, 3.9)); }

  function walls(ctx, t, g) {
    ctx.fillStyle = "#07090a"; ctx.fillRect(0, 0, 1920, 1080);
    // floor (groundsheet) in perspective
    const floor = [[612, 672], [1308, 672], [2140, 1120], [-220, 1120]];
    fill(ctx, floor, "#0e1213"); hatch(ctx, floor, { angle: 0.15, gap: 8, w: 1, color: "rgba(0,0,0,.6)", seed: 2 });
    // back wall under the dome apex (head end)
    fill(ctx, BACK, radial(ctx, 960, 470, 20, 420, [[0, "#151d20"], [1, "#090c0d"]]));
    hatch(ctx, BACK, { angle: 0.4, gap: 6, w: 1, color: "rgba(0,0,0,.5)", seed: 3, cross: true });
    // left wall (away from the moon)
    const L = [[-40, -40], [960, -40], [HUB[0], HUB[1]], [960, 222], [820, 268], [690, 420], [612, 672], [-220, 1120], [-40, 1120]];
    fill(ctx, L, radial(ctx, 380, 420, 30, 900, [[0, "#1b272b"], [1, "#0a0f11"]]));
    clipped(ctx, L, () => {
      const r = rng(4);
      for (let i = 0; i < 7; i++) { const a = 2.0 + i * 0.13, e = [HUB[0] + Math.cos(a) * 1300, HUB[1] + Math.sin(a) * 1300], m = [(HUB[0] + e[0]) / 2 + (r() - .5) * 90, (HUB[1] + e[1]) / 2];
        clump(ctx, [HUB, m, e], 50 + r() * 50, "rgba(0,0,0,.28)", 0.08, 0.8); stroke(ctx, [[HUB[0] - 6, HUB[1]], [m[0] - 16, m[1]], [e[0] - 20, e[1]]], 3, "rgba(150,190,196,.12)", taper(0.1, 0.6)); }
      hatch(ctx, L, { angle: -0.9, gap: 7, w: 1.2, color: "rgba(0,0,0,.45)", seed: 5 });
    });
    // right wall: moonlit from outside, bows inward with the gust
    const bw = (x, y, k) => [x - g * 110 * k, y + g * 14 * k];
    const R = [[960, -40], [1960, -40], [1960, 1120], [2140, 1120], [1308, 672], bw(1230, 420, 0.5), [1100, 268], [960, 222], [HUB[0], HUB[1]]];
    const Rbow = [[960, -40], [1960, -40], [1960, 1120], [2140, 1120], bw(1560, 860, 0.7), bw(1460, 600, 1), bw(1300, 380, 0.6), [1100, 268], [960, 222], [HUB[0], HUB[1]]];
    const mx = 1600 - g * 100;
    fill(ctx, Rbow, radial(ctx, mx, 420, 40, 950, [[0, `rgb(${105 + g * 35},${152 + g * 34},${162 + g * 30})`], [0.4, C.moon], [0.78, C.nylon], [1, C.nylonDeep]]));
    clipped(ctx, Rbow, () => {
      const r = rng(12);
      for (let i = 0; i < 9; i++) {
        const a = 0.25 + i * 0.13, Lg = 1100 + r() * 400, bend = (r() - 0.5) * 100 - g * 90;
        const e = [HUB[0] + Math.cos(a) * Lg, HUB[1] + Math.sin(a) * Lg], m = [(HUB[0] + e[0]) / 2 + bend, (HUB[1] + e[1]) / 2 + g * 40];
        clump(ctx, [HUB, m, e], 50 + r() * 60, "rgba(6,14,18,.3)", 0.08, 0.8);
        stroke(ctx, [[HUB[0] + 8, HUB[1] + 4], [m[0] + 18, m[1] - 4], [e[0] + 20, e[1] - 8]], 3 + r() * 4, "rgba(185,222,226,.25)", taper(0.1, 0.6));
      }
      hatch(ctx, [[1300, 640], [1960, 520], [1960, 1120], [1400, 1120]], { angle: -1.1, gap: 7, w: 1.2, color: "rgba(4,10,12,.5)", seed: 13, cross: true });
      stroke(ctx, [[1100, 268], [1440 - g * 50, 340], [1760, 640], [1900, 1100]], 12, "rgba(8,14,16,.55)", taper(0.02, 0.02));    // pole shadow through the nylon
    });
    // seams (ridge + wall/back junctions) with frost
    const seams = [[[HUB[0], HUB[1]], [960, 222]], [[960, 222], [820, 268], [690, 420], [612, 672]], [[960, 222], [1100, 268], [1230 - g * 55, 420], [1308, 672]], [[HUB[0], HUB[1]], [400, -40]], [[HUB[0], HUB[1]], [1520, -40]]];
    for (const sm of seams) {
      stroke(ctx, sm, 6, "#0a1012", taper(0.02, 0.05));
      const pts = sample(sm, false, 8), r = rng(Math.round(sm[0][0] + sm[sm.length - 1][1]));
      for (let i = 0; i < pts.length; i += 2) { const [x, y] = pts[i]; stroke(ctx, [[x, y], [x + (r() - .5) * 10, y - 4 - r() * 8]], 1.3, "rgba(200,225,228,.45)", taper(0.1, 0.7)); }
    }
    stroke(ctx, [[612, 672], [1308, 672]], 3, "rgba(0,0,0,.8)", () => 1);
  }

  function lantern(ctx, t, lvl) {
    const [x, y] = LAMP, sway = Math.sin(t * 1.3) * 1.5 + sn(t * 0.7) * 1.2, X = x + sway;
    stroke(ctx, [[HUB[0], HUB[1] + 18], [X, y - 70]], 2, "#2a2a24", () => 1);                      // hanging cord
    // glow (atmosphere layer)
    if (lvl > 0) {
      ctx.save(); ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = radial(ctx, X, y + 10, 4, 400, [[0, `rgba(227,154,59,${0.5 * lvl})`], [0.22, `rgba(227,154,59,${0.14 * lvl})`], [1, "rgba(227,154,59,0)"]]);
      ctx.fillRect(X - 600, y - 600, 1200, 1200); ctx.restore();
    }
    // body: cap, wire guard, globe, tank
    fill(ctx, [[X - 26, y - 56], [X + 26, y - 56], [X + 34, y - 40], [X - 34, y - 40]], "#3c3020");
    stroke(ctx, [[X - 22, y - 70], [X, y - 84], [X + 22, y - 70]], 3, "#4a3b26", taper(0.1, 0.1));
    const globe = [[X - 30, y - 40], [X + 30, y - 40], [X + 36, y + 10], [X + 26, y + 46], [X - 26, y + 46], [X - 36, y + 10]];
    fill(ctx, globe, `rgba(${60 + 120 * lvl},${50 + 70 * lvl},${30 + 20 * lvl},.85)`);
    ctx.beginPath(); ctx.ellipse(X, y + 14, 5, 10 + 3 * sn(t * 9), 0, 0, 6.283); ctx.fillStyle = `rgba(255,214,140,${0.25 + 0.75 * lvl})`; ctx.fill();   // ember flame
    for (const dx of [-30, 0, 30]) stroke(ctx, [[X + dx * 0.9, y - 40], [X + dx * 1.15, y + 10], [X + dx * 0.85, y + 46]], 2.2, "#2b2418", taper(0.05, 0.05));
    stroke(ctx, globe, 2.6, C.ink, () => 1, true);
    stroke(ctx, [[X - 26, y - 30], [X - 30, y + 10]], 2, `rgba(255,230,190,${0.3 + 0.4 * lvl})`, taper(0.2, 0.3));
    fill(ctx, [[X - 40, y + 46], [X + 40, y + 46], [X + 36, y + 80], [X - 36, y + 80]], "#3a2e1e");
    stroke(ctx, [[X - 40, y + 46], [X + 40, y + 46], [X + 36, y + 80], [X - 36, y + 80]], 2.6, C.ink, () => 1, true);
    stroke(ctx, [[X - 34, y + 50], [X + 20, y + 50]], 2, `rgba(240,180,100,${0.6 * lvl})`, taper(0.2, 0.4));
  }

  function bag(ctx, t, lvl) {
    // mummy bag on the floor, foreshortened: wide at the foot (camera), narrow at the hood (head end)
    const rise = 7 * pulse(t, 1.4, 2.6);
    const B = [[700, 1120], [690, 960 - rise], [740, 830 - rise], [800, 740 - rise * 0.6], [870, 690 - rise * 0.3], [960, 676], [1050, 690 - rise * 0.3], [1120, 740 - rise * 0.6], [1180, 830 - rise], [1230, 960 - rise], [1220, 1120]];
    fill(ctx, B, C.bag);
    clipped(ctx, B, () => {
      for (let i = 0; i < 8; i++) {
        const u = i / 8, y = lerp(1100, 720, u ** 0.8) - rise * (1 - u * 0.5), w = lerp(280, 110, u);
        const seam = [[960 - w, y + 18 * (1 - u)], [960, y - 10 * (1 - u)], [960 + w, y + 18 * (1 - u)]];
        fill(ctx, seam.concat([[960 + w, y + 30 * (1 - u) + 6], [960, y + 4], [960 - w, y + 30 * (1 - u) + 6]]), C.bagSh);
        stroke(ctx, seam, lerp(3.4, 1.8, u), C.ink, taper(0.05, 0.05));
        stroke(ctx, seam.map(q => [q[0], q[1] - lerp(18, 7, u)]), lerp(5, 2, u), "rgba(150,165,100,.28)", taper(0.2, 0.4));
      }
      hatch(ctx, [[690, 820], [900, 760], [900, 1120], [690, 1120]], { angle: -0.8, gap: 7, w: 1.1, color: "rgba(5,6,2,.55)", seed: 22 });
      ctx.fillStyle = radial(ctx, 1500, 700, 30, 700, [[0, "rgba(150,200,210,.25)"], [1, "rgba(150,200,210,0)"]]); ctx.fillRect(650, 640, 650, 500);
      ctx.fillStyle = radial(ctx, 960, LAMP[1], 10, 520, [[0, `rgba(227,154,59,${0.35 * lvl})`], [1, "rgba(227,154,59,0)"]]); ctx.fillRect(650, 640, 650, 500);
      const r = rng(5); for (let i = 0; i < 160; i++) { ctx.fillStyle = `rgba(214,230,232,${0.2 + r() * 0.4})`; ctx.fillRect(690 + r() * 540, 680 + r() * 440, 2, 2); }
    });
    stroke(ctx, B, 4.5, C.ink, taper(0.02, 0.02));
    // hood at the head end: small dark opening, messy hair just visible
    const hood = [[915, 688], [960, 680], [1005, 688], [996, 708], [924, 708]];
    fill(ctx, hood, "#040506"); stroke(ctx, hood, 2.4, C.ink, () => 1, true);
    const r = rng(9); for (let i = 0; i < 8; i++) { const x = 926 + i * 9; stroke(ctx, [[x, 706], [x + 2, 694 - r() * 6], [x + 6, 688 - r() * 5]], 4, C.hair, taper(0.2, 0.9)); }
  }

  function props(ctx, t, lvl) {
    // rucksack against the left wall near the door, boots + tin mug on the groundsheet (rim-lit by the moon)
    const rk = [[150, 1120], [130, 780], [190, 660], [370, 650], [440, 760], [470, 1120]];
    fill(ctx, rk, "#2a2f1f"); hatch(ctx, rk, { angle: -0.6, gap: 6, w: 1.1, color: "rgba(0,0,0,.5)", seed: 31 });
    stroke(ctx, [[370, 650], [440, 760], [470, 1120]], 5, "rgba(140,180,186,.35)", taper(0.05, 0.3));
    stroke(ctx, rk, 4, C.ink, taper(0.02, 0.02));
    stroke(ctx, [[190, 700], [205, 920], [210, 1120]], 12, "#171a10", taper(0.05, 0.05)); stroke(ctx, [[400, 700], [392, 920], [384, 1120]], 12, "#171a10", taper(0.05, 0.05));
    const flap = [[190, 800], [380, 790], [392, 860], [200, 872]];
    fill(ctx, flap, "#20241a"); stroke(ctx, flap, 2.6, C.ink, () => 1, true);
    fill(ctx, [[280, 856], [300, 856], [300, 880], [280, 880]], "#6b6046");
    for (const [bx, sc] of [[470, 1], [590, 0.95]]) {
      const P = (x, y) => [bx + x * sc, 1060 - (1060 - y) * sc];
      const boot = [P(0, 1060), P(6, 940), P(14, 880), P(80, 874), P(88, 960), P(170, 996), P(176, 1060)];
      fill(ctx, boot, "#30251a"); hatch(ctx, boot, { angle: -0.5, gap: 5, w: 1, color: "rgba(0,0,0,.5)", seed: bx });
      stroke(ctx, [P(80, 874), P(88, 960), P(170, 996)], 4, "rgba(150,190,196,.35)", taper(0.1, 0.4));
      stroke(ctx, boot, 3.4, C.ink, taper(0.02, 0.02));
      for (let k = 0; k < 4; k++) stroke(ctx, [P(18, 900 + k * 22), P(70, 896 + k * 22)], 1.8, "#8a7a5a", () => 1);
      stroke(ctx, [P(2, 1054), P(176, 1054)], 8, "#0b0b08", () => 1);
      const r = rng(bx); for (let i = 0; i < 30; i++) { ctx.fillStyle = "rgba(210,228,230,.5)"; ctx.fillRect(bx + r() * 170, 880 + r() * 170, 2, 2); }
    }
    const mug = [[1300, 930], [1370, 930], [1364, 1010], [1306, 1010]];
    fill(ctx, mug, "#5a5d58"); stroke(ctx, mug, 2.6, C.ink, () => 1, true);
    ctx.beginPath(); ctx.ellipse(1335, 930, 35, 8, 0, 0, 6.283); ctx.fillStyle = "#1a1c1a"; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.4; ctx.stroke();
    stroke(ctx, [[1370, 948], [1394, 960], [1366, 992]], 3.4, C.ink, taper(0.1, 0.1));
    stroke(ctx, [[1308, 940], [1310, 1000]], 3, `rgba(200,225,230,${0.35 + 0.15 * lvl})`, taper(0.2, 0.3));
    stroke(ctx, [[40, -40], [70, 520], [20, 1120]], 9, "#0c1012", () => 1);                 // door zip, far left
  }

  function drips(ctx, t) {
    // forming drop on the seam near the lantern, falls at 0.30 and 2.15 (gravity), splashes on the floor
    const fallT = [0.30, 2.15];
    let hang = 1, fy = null;
    for (const t0 of fallT) {
      if (t >= t0 && t < t0 + 0.42) { const d = t - t0; fy = DRIP[1] + 0.5 * 3800 * d * d; hang = 0; }
      if (t >= t0 + 0.42 && t < t0 + 1.2) hang = smooth(t0 + 0.42, t0 + 1.2, t);
    }
    const s = hang;
    if (s > 0.05) dropShape(ctx, DRIP[0], DRIP[1] + 8 * s, 0.6 + 0.6 * s);
    if (fy !== null && fy < FLOOR) dropShape(ctx, DRIP[0], fy, 0.8, 1.4);
    for (const t0 of fallT) {                     // splash ring on the floor
      const d = t - (t0 + Math.sqrt(2 * (FLOOR - DRIP[1]) / 3800));
      if (d > 0 && d < 0.5) {
        ctx.save(); ctx.strokeStyle = `rgba(190,220,224,${0.7 * (1 - d / 0.5)})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(DRIP[0], FLOOR, 8 + d * 90, 2 + d * 16, 0, 0, 6.283); ctx.stroke(); ctx.restore();
        const r = rng(Math.round(t0 * 100));
        for (let i = 0; i < 6; i++) { const a = -0.3 - r() * 2.5, v = 140 + r() * 120; ctx.fillStyle = `rgba(200,225,228,${1 - d / 0.5})`; ctx.fillRect(DRIP[0] + Math.cos(a) * v * d, FLOOR + Math.sin(a) * v * d + 300 * d * d, 3, 3); }
      }
    }
  }
  function dropShape(ctx, x, y, s, stretch = 1) {
    const p = [[x, y - 14 * s * stretch], [x + 7 * s, y + 4 * s], [x, y + 12 * s], [x - 7 * s, y + 4 * s]];
    fill(ctx, p, "rgba(170,212,218,.75)"); stroke(ctx, p, 1.6, "rgba(8,14,16,.9)", () => 1, true);
    fill(ctx, [[x - 3 * s, y], [x - 1 * s, y - 4 * s], [x, y + 2 * s]], "rgba(245,252,252,.95)");
  }

  function motes(ctx, t, lvl) {
    const r = rng(404);
    for (let i = 0; i < 60; i++) {
      const x0 = 600 + r() * 760, y0 = 120 + r() * 640, sp = 6 + r() * 14, ph = r() * 6.28;
      const x = x0 + Math.sin(t * 0.4 + ph) * 20 + t * sp * 0.3, y = y0 - t * sp + Math.cos(t * 0.5 + ph) * 10;
      const d = Math.hypot(x - LAMP[0], y - LAMP[1]), a = clamp(1 - d / 520) * 0.6 * lvl;
      if (a > 0.02) { ctx.fillStyle = `rgba(255,220,170,${a})`; ctx.fillRect(x, y, 2, 2); }
    }
  }

  function drawWide(ctx, t) {
    const lvl = smooth(0.5, 1.4, t) * (1 + 0.06 * sn(t * 3.1));
    const g = gust(t);
    // camera: locked on black, then slow dolly-in with a tilt down toward the sleeper
    const k = smooth(0.5, 3.6, t), push = lerp(1, 1.06, k), tilt = 20 * k;
    ctx.save();
    // mirrored so the moonlit wall is on Dev's right (screen-left), matching the close-up across the cut
    ctx.translate(960, 0); ctx.scale(-1, 1); ctx.translate(-960, 0);
    ctx.translate(960, 560 + tilt); ctx.scale(push, push); ctx.translate(-960, -560);
    walls(ctx, t, g); lantern(ctx, t, lvl); bag(ctx, t, lvl); props(ctx, t, lvl); motes(ctx, t, lvl); drips(ctx, t);
    ctx.restore();
    // exposure: from black (only the drip glint) up to the dim scene as the ember rises
    const expo = smooth(0.35, 1.4, t);
    ctx.save();
    ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "rgb(178,184,190)"; ctx.fillRect(0, 0, 1920, 1080);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = radial(ctx, 960, 520, 360, 1200, [[0, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,.66)"]]); ctx.fillRect(0, 0, 1920, 1080);
    ctx.fillStyle = `rgba(0,0,0,${1 - expo})`; ctx.fillRect(0, 0, 1920, 1080);
    if (t < 0.9) { ctx.save(); ctx.translate(1920, 0); ctx.scale(-1, 1); ctx.globalAlpha = 1 - smooth(0.5, 0.9, t); drips(ctx, t); ctx.restore(); }     // the glint reads through the black
    ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.38; ctx.drawImage(paper(1920, 1080, 11), 0, 0);
    ctx.restore();
  }

  window.SHOT_WIDE = { drawWide, gust };
})();

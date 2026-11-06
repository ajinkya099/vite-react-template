/* Living Line — Shot 2 close-up: DEV in the tent. Pure code drawing (Canvas2D), no image assets.
   drawCloseup(ctx, p) where p = pose/scene params (see DEFAULT_POSE). Deterministic. */
(function () {
  const { rng, makeNoise, sample, pathFrom, fill, stroke, taper, clump, hatch, clipped, paper, radial, lerp, clamp, smooth, lp } = window.INK;
  const C = {
    ink: "#0b0e10", night: "#0d1214", nylonDeep: "#121c20", nylon: "#24343a", moon: "#5f8f9a", moonHi: "#9cc3c8",
    skin: "#8c6549", skinLit: "#a8784f", skinSh: "#5b3e2e", skinDeep: "#3d2920", hair: "#121014", hairHi: "#3b3742",
    bag: "#3f4628", bagSh: "#262b18", bagHi: "#5d6638", fleece: "#26272b", fleeceHi: "#3d3e44", pillow: "#341c18", pillowSh: "#1e0f0d",
    ember: "#e39a3b", white: "#d8cdbb", iris: "#3a2618",
  };
  const DEFAULT_POSE = { eyeOpen: 1, gazeX: 0, gazeY: -0.15, pupil: 0.42, browRaise: 1, browKnit: 0.5, flutter: 0, mouthOpen: 0.15, clench: 0,
    headX: 0, headY: 0, headRot: 0, lantern: 1, wallPress: 0, breath: 0, sweat: 1, sweatSlide: 0, drip: 0, vapor: -1, hairLagX: 0, hairLagY: 0, t: 0 };

  // ---------------- background: tent wall, seams, frost, pillow
  function tentWall(ctx, p) {
    const W = 1920, H = 1080;
    ctx.fillStyle = C.night; ctx.fillRect(0, 0, W, H);
    // moonlit nylon panel (screen-left), pushed by wallPress
    const press = p.wallPress;
    const wall = [[-40, -40], [980, -40], [860, 300], [700, 700], [560, 1120], [-40, 1120]];
    fill(ctx, wall, radial(ctx, 300 + press * 40, 360, 20, 900, [[0, "#6f9da6"], [0.35, C.moon], [0.7, C.nylon], [1, C.nylonDeep]]));
    // fabric: crumpled folds (short varied ridges/valleys), denser hatching in shadow
    const r = rng(41), hub = [360, 120];
    clipped(ctx, wall, () => {
      for (let i = 0; i < 11; i++) {                     // long folds radiating from the seam hub
        const a = 1.0 + i * 0.13 + (r() - 0.5) * 0.06, L = 650 + r() * 500, bend = (r() - 0.5) * 140 + press * 50;
        const e = [hub[0] + Math.cos(a) * L, hub[1] + Math.sin(a) * L], m = [(hub[0] + e[0]) / 2 + bend, (hub[1] + e[1]) / 2 - bend * 0.3];
        clump(ctx, [hub, m, e], 40 + r() * 60, "rgba(8,16,20,.24)", 0.08, 0.8);
        stroke(ctx, [[hub[0] - 6, hub[1] + 6], [m[0] - 20, m[1] - 6], [e[0] - 24, e[1] - 10]], 3 + r() * 4, "rgba(180,218,222,.22)", taper(0.1, 0.6));
      }
      for (let i = 0; i < 40; i++) {                     // small creases
        const x = r() * 880, y = 200 + r() * 880, a = 0.9 + r() * 0.9, L = 40 + r() * 110;
        const e = [x + Math.cos(a) * L, y + Math.sin(a) * L];
        stroke(ctx, [[x, y], [(x + e[0]) / 2 + (r() - .5) * 14, (y + e[1]) / 2], e], 1.6 + r(), "rgba(6,10,12,.55)", taper(0.3, 0.5));
        stroke(ctx, [[x - 4, y - 3], [e[0] - 4, e[1] - 3]], 1.4, "rgba(180,218,222,.25)", taper(0.3, 0.5));
      }
      hatch(ctx, [[-40, 600], [660, 520], [520, 1120], [-40, 1120]], { angle: -1.0, gap: 7, w: 1.3, color: "rgba(6,12,14,.5)", seed: 7, cross: true });
      hatch(ctx, [[560, 0], [980, -40], [820, 440], [620, 400]], { angle: 0.9, gap: 7, w: 1.2, color: "rgba(6,12,14,.45)", seed: 8 });
      frost(ctx, 61);
    });
    // seams + pole sleeve meeting at the hub
    for (const [e, w] of [[[980, -10], 16], [[-40, 380], 14], [[-40, 80], 10], [[200, 1120], 10]]) {
      stroke(ctx, [hub, [(hub[0] + e[0]) / 2, (hub[1] + e[1]) / 2 + 8], e], w, "#0d1416", taper(0.02, 0.05));
      stroke(ctx, [[hub[0], hub[1] - 3], [(hub[0] + e[0]) / 2, (hub[1] + e[1]) / 2 + 3], [e[0], e[1] - 4]], 2.2, "rgba(170,210,214,.5)", taper(0.05, 0.3));
      frostLine(ctx, hub, e, Math.round(e[0] + e[1]));
    }
    fill(ctx, [[hub[0] - 22, hub[1] - 16], [hub[0] + 20, hub[1] - 18], [hub[0] + 24, hub[1] + 16], [hub[0] - 18, hub[1] + 20]], "#0b1012");
    stroke(ctx, [[hub[0] - 22, hub[1] - 16], [hub[0] + 20, hub[1] - 18], [hub[0] + 24, hub[1] + 16], [hub[0] - 18, hub[1] + 20]], 3, C.ink, () => 1, true);
    // deep interior behind the head (screen-right)
    fill(ctx, [[860, 300], [980, -40], [1960, -40], [1960, 1120], [560, 1120], [700, 700]], radial(ctx, 1500, 200, 40, 1000, [[0, "#1a2226"], [1, "#090c0e"]]));
    hatch(ctx, [[980, -40], [1960, -40], [1960, 260], [1100, 200]], { angle: 0.25, gap: 6, w: 1, color: "rgba(0,0,0,.5)", seed: 9, cross: true });
    // pillow / stuff sack behind head
    const pil = [[900, 330], [1060, 150], [1400, 90], [1760, 130], [1960, 260], [1960, 860], [1600, 900], [1100, 760], [920, 560]];
    fill(ctx, pil, C.pillow);
    clipped(ctx, pil, () => {
      ctx.fillStyle = radial(ctx, 1850, 760, 30, 700, [[0, `rgba(227,154,59,${0.22 * p.lantern})`], [1, "rgba(227,154,59,0)"]]); ctx.fillRect(800, 0, 1200, 1100);
      for (let gx = 0; gx < 8; gx++) for (let gy = 0; gy < 7; gy++) {
        const cx = 960 + gx * 140 + (gy % 2) * 70, cy = 120 + gy * 120;
        const d = [[cx, cy - 66], [cx + 72, cy], [cx, cy + 66], [cx - 72, cy]];
        fill(ctx, d.map(q => [q[0] * 0.92 + cx * 0.08, q[1] * 0.92 + cy * 0.08 - 8]), "rgba(120,62,48,.35)");
        stroke(ctx, d, 2.6, "rgba(12,5,4,.8)", () => 1, true);
        hatch(ctx, [[cx - 72, cy], [cx, cy + 66], [cx + 72, cy], [cx + 30, cy + 20], [cx - 30, cy + 20]], { angle: -0.4, gap: 5, w: 1, color: "rgba(10,3,2,.55)", seed: gx * 13 + gy, bounds: [cx - 72, cy - 10, cx + 72, cy + 66] });
      }
    });
    stroke(ctx, pil, 5, C.ink, () => 1, true);
    // drip forming on the seam (falls in shot 1; here it hangs)
    drop(ctx, 470, 205 + p.drip * 6, 1 + p.drip * 0.3);
  }

  function frost(ctx, seed) {
    const r = rng(seed);
    for (let k = 0; k < 120; k++) {
      const x = r() * 820, y = r() * 1000, s = 8 + r() * 26, a0 = r() * 6.28;
      ctx.globalAlpha = 0.12 + r() * 0.22;
      fern(ctx, x, y, a0, s, r, 2);
      ctx.globalAlpha = 1;
    }
  }
  function fern(ctx, x, y, a, len, r, depth) {
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    stroke(ctx, [[x, y], [x2, y2]], 1.4, "#cfe3e4", taper(0.05, 0.6));
    if (depth <= 0) return;
    for (let i = 1; i <= 4; i++) {
      const t = i / 5, bx = x + (x2 - x) * t, by = y + (y2 - y) * t, l = len * (0.45 - t * 0.3);
      fern(ctx, bx, by, a + 0.9, l, r, depth - 1); fern(ctx, bx, by, a - 0.9, l, r, depth - 1);
    }
  }
  function frostLine(ctx, a, b, seed) {
    const r = rng(seed);
    for (let i = 0; i < 26; i++) {
      const t = r(), x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      ctx.globalAlpha = 0.6; fern(ctx, x, y, -1.57 + (r() - 0.5) * 1.6, 6 + r() * 12, r, 1); ctx.globalAlpha = 1;
    }
  }
  function drop(ctx, x, y, s) {
    const pts = [[x, y - 14 * s], [x + 7 * s, y + 4 * s], [x, y + 12 * s], [x - 7 * s, y + 4 * s]];
    fill(ctx, pts, "rgba(160,205,210,.55)"); stroke(ctx, pts, 1.6, "rgba(10,18,20,.9)", () => 1, true);
    fill(ctx, [[x - 3 * s, y], [x - 1 * s, y - 4 * s], [x, y + 2 * s]], "rgba(240,250,250,.9)");
  }

  // ---------------- DEV head rig v3 (local coords: eye line y=0, face centre x=0)
  // LIGHTING MODEL (one rule, applied everywhere):
  //   KEY  = cool moonlight through the nylon, from upper screen-LEFT (~30° above eye line).
  //   FORM SHADOW = every plane facing right or down (nose side plane, cheek past the terminator,
  //                 under brow ridge, under nose, under lower lip, under jaw onto the neck).
  //   BOUNCE = dying lantern, low screen-RIGHT: a thin warm rim INSIDE the shadow side only
  //            (jaw edge, ear rim, right nostril wing). Never a broad warm wash over lit planes.
  const FACE_SIDE = [[-168, -120], [-182, -34], [-180, 54], [-170, 140], [-148, 206], [-104, 252], [-40, 276], [18, 276], [86, 252], [140, 206], [174, 138], [194, 54], [200, -34], [196, -120]];
  const FACE = FACE_SIDE.concat([[170, -205], [70, -262], [-60, -262], [-150, -210]]);
  // terminator: where the cheek turns away from the key (right side)
  const CHEEK_SHADOW = [[120, -40], [150, -10], [176, 40], [194, 54], [174, 138], [140, 206], [86, 252], [40, 268], [70, 230], [104, 186], [128, 132], [134, 80], [124, 24]];

  function eye(ctx, cx, cy, w, p, side) {
    const o = clamp(p.eyeOpen, 0, 1.15), h = w * 0.36, sq = p.flutter;
    const lidT = clamp(o);
    const upOpen = [[cx - w / 2, cy + 3], [cx - w * 0.24, cy - h * 1.0], [cx + w * 0.2, cy - h * 1.02], [cx + w / 2, cy - 2]];
    const upShut = [[cx - w / 2, cy + 3], [cx - w * 0.2, cy + 7 + sq * 3], [cx + w * 0.2, cy + 7 + sq * 3], [cx + w / 2, cy + 1]];
    const lowOpen = [[cx + w / 2 - 3, cy - 1], [cx + w * 0.18, cy + h * 0.6], [cx - w * 0.2, cy + h * 0.58], [cx - w / 2 + 2, cy + 3]];
    const lowShut = [[cx + w / 2 - 3, cy + 1], [cx + w * 0.18, cy + 8], [cx - w * 0.2, cy + 8], [cx - w / 2 + 2, cy + 3]];
    const up = lp(upShut, upOpen, lidT).map((q, i) => [q[0], q[1] - (i === 1 || i === 2 ? (o - lidT) * h * 0.6 : 0)]);
    const low = lp(lowShut, lowOpen, Math.min(1, lidT * 1.4));
    // socket: soft occlusion under the brow ridge (form shadow, key from upper-left -> stronger on inner/right)
    fill(ctx, [[cx - w * 0.55, cy - h * 0.6], [cx - w * 0.2, cy - h * 1.55], [cx + w * 0.3, cy - h * 1.6], [cx + w * 0.62, cy - h * 0.4], [cx + w * 0.3, cy - h * 1.05], [cx - w * 0.25, cy - h * 1.1]], "rgba(70,44,30,.32)");
    if (lidT > 0.04) {
      const white = up.concat(low);
      clipped(ctx, white, () => {
        fill(ctx, white, C.white);
        // eyeball shading: darker toward the corners
        ctx.fillStyle = radial(ctx, cx, cy, w * 0.15, w * 0.55, [[0, "rgba(0,0,0,0)"], [1, "rgba(60,40,30,.45)"]]); ctx.fillRect(cx - w, cy - w, w * 2, w * 2);
        const ir = w * 0.235, ix = cx + p.gazeX * w * 0.27, iy = cy + p.gazeY * h * 0.5 + (1 - lidT) * h * 0.25;
        ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.283);
        ctx.fillStyle = radial(ctx, ix, iy + ir * 0.3, ir * 0.1, ir, [[0, "#7a5536"], [0.6, "#4b301e"], [1, "#24160d"]]); ctx.fill();
        const rs = rng(side > 0 ? 71 : 72);                         // iris striations
        for (let k = 0; k < 26; k++) { const a = k / 26 * 6.283 + rs() * 0.1, r0 = ir * (p.pupil + 0.08), r1 = ir * (0.78 + rs() * 0.18);
          stroke(ctx, [[ix + Math.cos(a) * r0, iy + Math.sin(a) * r0], [ix + Math.cos(a) * r1, iy + Math.sin(a) * r1]], 1, `rgba(${k % 2 ? "150,110,70" : "20,12,8"},.45)`, taper(0.3, 0.3)); }
        ctx.beginPath(); ctx.arc(ix, iy, ir * p.pupil, 0, 6.283); ctx.fillStyle = "#050404"; ctx.fill();
        ctx.lineWidth = 2.4; ctx.strokeStyle = "rgba(12,8,6,.95)"; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.283); ctx.stroke(); // limbal ring
        stroke(ctx, up.map(q => [q[0], q[1] + 7]), 14, "rgba(30,20,15,.5)", taper(0.1, 0.1));           // lid cast shadow
        // catchlights: key (upper-left, cool) + bounce (lower-right, warm)
        ctx.beginPath(); ctx.ellipse(ix - ir * 0.38, iy - ir * 0.36, ir * 0.2, ir * 0.15, -0.5, 0, 6.283); ctx.fillStyle = "rgba(235,246,248,.95)"; ctx.fill();
        ctx.beginPath(); ctx.arc(ix + ir * 0.42, iy + ir * 0.4, ir * 0.07, 0, 6.283); ctx.fillStyle = `rgba(240,180,110,${0.8 * p.lantern})`; ctx.fill();
      });
      // lower lid: rim + wet tear line + sparse lower lashes
      stroke(ctx, low, 1.8, "rgba(20,12,8,.9)", taper(0.35, 0.5));
      stroke(ctx, low.map(q => [q[0], q[1] - 2]), 1.2, "rgba(230,215,200,.5)", taper(0.3, 0.3));
      for (let k = 1; k < 5; k++) { const q = sample(low, false, 6)[k * 3]; if (q) stroke(ctx, [q, [q[0] + side * 2, q[1] + 5]], 1, "rgba(20,12,8,.7)", taper(0.1, 0.8)); }
      // inner corner (caruncle)
      const ic = side < 0 ? up[up.length - 1] : up[0];
      fill(ctx, [[ic[0] - side * 2, ic[1]], [ic[0] - side * 9, ic[1] + 2], [ic[0] - side * 5, ic[1] + 6]], "rgba(150,80,70,.8)");
      // terror bags: two thin lines under the eye
      stroke(ctx, [[cx - w * 0.34, cy + h * 0.95], [cx, cy + h * 1.08], [cx + w * 0.3, cy + h * 0.9]], 1.3, "rgba(40,24,16,.55)", taper(0.3, 0.3));
      stroke(ctx, [[cx - w * 0.2, cy + h * 1.3], [cx + w * 0.05, cy + h * 1.36], [cx + w * 0.24, cy + h * 1.24]], 1.1, "rgba(40,24,16,.35)", taper(0.3, 0.3));
    } else {
      // closed: lash line hangs, lower lashes meet it, lid skin highlight above
      for (let k = 0; k < 7; k++) { const q = sample(upShut, false, 6)[3 + k * 2]; if (q) stroke(ctx, [q, [q[0] - side * 3, q[1] + 6]], 1.2, "rgba(15,10,8,.85)", taper(0.1, 0.8)); }
      stroke(ctx, upShut.map(q => [q[0], q[1] - 10]), 6, "rgba(180,135,100,.25)", taper(0.3, 0.3));
    }
    // upper lid: lash line (thick) + lid edge, outer lash flick, crease (brows lead lids: crease uses browRaise)
    stroke(ctx, up, lerp(6, 7.5, lidT), C.ink, taper(0.1, 0.06));
    const oc = side < 0 ? up[0] : up[up.length - 1], dir = side < 0 ? -1 : 1;
    stroke(ctx, [oc, [oc[0] + dir * 9, oc[1] - 3 - lidT * 3], [oc[0] + dir * 16, oc[1] - 2 - lidT * 7]], 4, C.ink, taper(0.05, 0.9));
    const crease = up.map((q, i) => [q[0] + (i - 1.5) * 1.5, q[1] - 11 - lidT * 7 - sq * 3 - p.browRaise * 3]);
    stroke(ctx, crease, 2, "rgba(30,18,12,.8)", taper(0.25, 0.4));
    stroke(ctx, crease.map(q => [q[0], q[1] + 3]), 3, "rgba(185,140,105,.3)", taper(0.3, 0.3));
  }

  function brow(ctx, inner, outer, p, side) {
    const raise = p.browRaise, knit = p.browKnit;
    const ix = inner[0] - side * knit * 7, iy = inner[1] - raise * 20 + knit * 5 + p.flutter * 6;
    const mx = (inner[0] + outer[0]) / 2, my = (inner[1] + outer[1]) / 2 - 8 - raise * 8;
    const ox = outer[0], oy = outer[1] + raise * 2;
    const spine = [[ix, iy], [mx, my], [ox, oy]];
    clump(ctx, spine, 20, "#2a1c16", 0.25, 0.7);                       // base
    const pts = sample(spine, false, 10), r = rng(side > 0 ? 5 : 6);
    for (let i = 0; i < pts.length - 2; i++) {                          // individual hairs: inner ones rise, outer ones sweep out
      const [x, y] = pts[i], t = i / pts.length, ang = lerp(-1.9, side > 0 ? -0.35 : -2.8, t);
      for (let k = 0; k < 2; k++) {
        const L = 10 + r() * 8, yy = y + 6 - r() * 10;
        stroke(ctx, [[x, yy + 4], [x + Math.cos(ang) * L * 0.5, yy + Math.sin(ang) * L * 0.5], [x + Math.cos(ang) * L, yy + Math.sin(ang) * L]], 1.6, "#0d0908", taper(0.15, 0.7));
      }
    }
    // knit creases between the brows
    if (side > 0 && knit > 0.3) { stroke(ctx, [[-14, -40], [-8, -60], [-10, -76]], 1.4, `rgba(30,18,12,${0.5 * knit})`, taper(0.3, 0.5)); stroke(ctx, [[2, -42], [6, -58]], 1.2, `rgba(30,18,12,${0.4 * knit})`, taper(0.3, 0.5)); }
  }

  function nose(ctx, p) {
    // side plane (faces right -> form shadow), bridge, rounded tip with key highlight, alae, nostrils, cast shadow
    fill(ctx, [[4, -24], [10, 30], [20, 84], [22, 108], [12, 116], [4, 96], [-2, 40]], C.skinSh);
    hatch(ctx, [[4, -24], [10, 30], [20, 84], [22, 108], [12, 116], [4, 96], [-2, 40]], { angle: -1.3, gap: 4, w: 0.9, color: "rgba(30,14,8,.45)", seed: 31 });
    stroke(ctx, [[2, -26], [8, 30], [16, 82]], 1.8, "rgba(28,16,10,.75)", taper(0.15, 0.6));               // bridge edge
    stroke(ctx, [[-22, -10], [-20, 40], [-24, 92]], 5, "rgba(206,170,135,.35)", taper(0.3, 0.3));       // bridge highlight (lit side)
    fill(ctx, [[-34, 132], [-4, 130], [18, 126], [12, 146], [-16, 152], [-36, 146]], C.skinSh);           // cast shadow under the nose (down-right)
    // tip
    fill(ctx, [[-40, 100], [-24, 90], [0, 94], [12, 108], [6, 124], [-20, 128], [-38, 120]], C.skin);
    fill(ctx, [[-30, 100], [-18, 94], [-6, 98], [-12, 108], [-26, 110]], "rgba(214,178,142,.8)");
    // alae (wings): near (right) wing in shadow with warm bounce rim, far (left) wing lit
    fill(ctx, [[8, 100], [24, 108], [26, 124], [12, 132], [4, 122]], C.skinSh);
    stroke(ctx, [[10, 98], [24, 108], [24, 124], [10, 132]], 2.4, C.ink, taper(0.2, 0.25));
    stroke(ctx, [[22, 112], [24, 122]], 1.6, `rgba(214,140,70,${0.7 * p.lantern})`, taper(0.2, 0.2));
    stroke(ctx, [[-42, 104], [-50, 118], [-42, 130]], 2.2, C.ink, taper(0.25, 0.3));
    // nostrils: comma shapes, near one larger
    fill(ctx, [[-2, 126], [10, 124], [14, 130], [4, 134]], "#160a07");
    fill(ctx, [[-36, 126], [-28, 124], [-24, 128], [-32, 131]], "#24120c");
    // tip underside contour (columella)
    stroke(ctx, [[-32, 124], [-18, 130], [-4, 128]], 2, C.ink, taper(0.3, 0.3));
    // philtrum
    stroke(ctx, [[-22, 140], [-24, 160]], 1.2, "rgba(40,24,16,.45)", taper(0.3, 0.3)); stroke(ctx, [[-6, 140], [-4, 160]], 1.2, "rgba(40,24,16,.45)", taper(0.3, 0.3));
  }

  function mouth(ctx, p) {
    const o = clamp(p.mouthOpen), c = clamp(p.clench), mx = -14, my = 182, sw = 1 + c * 0.12 + o * 0.04;
    const X = (x) => mx + (x - mx) * sw;
    // lip line (where the lips meet) — splits into upper/lower edges when open
    // fear: corners pull DOWN and in as the jaw drops (oval gasp); clench pulls corners down-and-out (grimace)
    const cy = my + 2 + o * 12 + c * 6, cxL = X(-64) + o * 10, cxR = X(38) - o * 10;
    const upEdge = [[cxL, cy], [X(-40), my - 2 - o * 6], [X(-14), my - o * 8], [X(12), my - 2 - o * 6], [cxR, cy - 1]];
    const lowY = o * 40 + c * 9;
    const lowEdge = [[cxR, cy - 1], [X(14), my + 2 + lowY * 0.95], [X(-14), my + 4 + lowY], [X(-42), my + 2 + lowY * 0.95], [cxL, cy]];
    // upper lip (faces down -> darker), cupid's bow
    const upLip = [[cxL, cy], [X(-46), my - 9 - o * 2], [X(-26), my - 14], [X(-14), my - 11], [X(-2), my - 14], [X(18), my - 9 - o * 2], [cxR, cy - 1]].concat(upEdge.slice().reverse());
    fill(ctx, upLip, "#6a4130");
    stroke(ctx, [[X(-46), my - 9], [X(-26), my - 14], [X(-14), my - 11], [X(-2), my - 14], [X(18), my - 9]], 1.2, "rgba(40,22,14,.6)", taper(0.3, 0.3));
    // lower lip (faces up -> catches the key), with highlight on the lit (left) half
    const lowLip = lowEdge.concat([[X(-52), my + 14 + lowY], [X(-14), my + 22 + lowY], [X(26), my + 13 + lowY]]);
    fill(ctx, lowLip, "#80523a");
    stroke(ctx, [[X(-40), my + 10 + lowY], [X(-22), my + 13 + lowY], [X(-6), my + 11 + lowY]], 3, "rgba(200,150,115,.55)", taper(0.3, 0.3));
    fill(ctx, [[X(-44), my + 24 + lowY], [X(-14), my + 30 + lowY], [X(22), my + 22 + lowY], [X(6), my + 38 + lowY], [X(-26), my + 38 + lowY]], C.skinSh);   // shadow under lower lip
    if (o > 0.04 || c > 0.04) {
      const hole = upEdge.concat(lowEdge);
      clipped(ctx, hole, () => {
        fill(ctx, hole, "#1b0b09");
        if (o > 0.3 || c > 0.04) {                                       // upper incisors only once really open
          const th = c > 0.04 ? 10 : 7 * clamp((o - 0.3) / 0.3);
          fill(ctx, [[X(-40), my - 8], [X(16), my - 8], [X(14), my + th], [X(-38), my + th]], "#a99c86");
          for (let i = -2; i <= 1; i++) stroke(ctx, [[mx + i * 14, my - 6], [mx + i * 14, my + th]], 1, "rgba(70,50,40,.5)", () => 1);
        }
        if (c > 0.04) { fill(ctx, [[X(-36), my + 3], [X(12), my + 3], [X(12), my + lowY + 4], [X(-36), my + lowY + 4]], "#978a75"); stroke(ctx, [[X(-44), my + 3], [X(-14), my + 4], [X(20), my + 3]], 1.8, "rgba(30,18,12,.85)", taper(0.2, 0.2)); }
        if (o > 0.4) fill(ctx, [[X(-40), my + lowY + 4], [X(-14), my + lowY - 8], [X(14), my + lowY + 4]], "#5a2723");      // tongue
      });
    }
    stroke(ctx, upEdge, 3, C.ink, (s) => 0.5 + 0.6 * Math.sin(s * Math.PI));
    if (o > 0.04 || c > 0.04) stroke(ctx, lowEdge, 1.6, "rgba(15,8,6,.9)", taper(0.3, 0.3));
    // corners: small tension ticks (stronger when clenched)
    stroke(ctx, [[cxL, cy], [cxL - 6, cy + 6 + c * 6 + o * 4]], 2 + c, C.ink, taper(0.1, 0.8));
    stroke(ctx, [[cxR, cy - 1], [cxR + 6, cy + 5 + c * 6 + o * 4]], 2 + c, C.ink, taper(0.1, 0.8));
    if (c > 0.05) { stroke(ctx, [[X(-74), my - 6], [X(-82), my + 10]], 1.2, "rgba(30,18,12,.6)", taper(0.3, 0.3)); stroke(ctx, [[X(48), my - 6], [X(54), my + 10]], 1.2, "rgba(30,18,12,.6)", taper(0.3, 0.3)); }
  }

  // S-curved lock with a pointed tip
  function lock(ctx, r, x0, y0, ang, L, curl, w, color, hi) {
    const ux = Math.cos(ang), uy = Math.sin(ang), vx = -uy, vy = ux;
    const c1 = curl * (0.3 + r() * 0.3), c2 = -curl * (0.1 + r() * 0.3), c3 = curl * (0.5 + r() * 0.5);
    const P = (t, c) => [x0 + ux * L * t + vx * c, y0 + uy * L * t + vy * c];
    const sp = [[x0, y0], P(0.3, c1), P(0.62, c2), P(0.88, c3), P(1.0, c3 + curl * 0.25)];
    clump(ctx, sp, w, color, 0.18, 0.62);
    stroke(ctx, sp.slice(1), 1.4, "rgba(0,0,0,.8)", taper(0.2, 0.9));          // ink separation on one side
    if (hi) stroke(ctx, [P(0.1, c1 * 0.3 + w * 0.12), P(0.38, c1 + w * 0.1), P(0.6, c2 + w * 0.06)], 1.8, hi, taper(0.2, 0.7));
  }

  function hair(ctx, p, front) {
    const r = rng(front ? 300 : 200), MOON = "rgba(135,178,186,.65)";
    if (!front) {
      fill(ctx, [[-206, -20], [-232, -160], [-188, -300], [-70, -366], [80, -368], [210, -310], [266, -190], [260, -40], [228, -20], [198, -130], [0, -220], [-184, -120]], C.hair);
      for (let i = 0; i < 52; i++) {
        const a = Math.PI * (0.94 + (i / 52) * 1.14) + (r() - 0.5) * 0.08, R = 205 + r() * 28;
        const x0 = 14 + Math.cos(a) * R * 1.08, y0 = -172 + Math.sin(a) * R * 0.95;
        const hi = a > 3.3 && a < 4.4 ? MOON : r() < 0.4 ? C.hairHi : null;
        lock(ctx, r, x0, y0, a + 0.35 + (r() - 0.5) * 0.4, 70 + r() * 80, (r() - 0.5) * 50 + 20, 24 + r() * 14, C.hair, hi);
      }
      return;
    }
    ctx.save(); ctx.translate(p.hairLagX || 0, p.hairLagY || 0);     // follow-through: hair trails head motion
    fill(ctx, [[-190, -130], [-176, -250], [-80, -320], [60, -324], [184, -262], [208, -140], [150, -186], [60, -204], [-40, -200], [-130, -180]], C.hair);
    for (let i = 0; i < 8; i++) lock(ctx, r, -150 - r() * 30, -240 + i * 14, 1.85 + r() * 0.25, 60 + r() * 40, -16 - r() * 20, 24 + r() * 8, C.hair, i % 2 ? MOON : null);
    for (let i = 0; i < 6; i++) lock(ctx, r, 170 + r() * 30, -240 + i * 18, 1.4 - r() * 0.25, 90 + r() * 50, 18 + r() * 24, 24 + r() * 10, C.hair, null);
    // wavy fringe falling over the forehead (longer, pointed, damp)
    for (let i = 0; i < 30; i++) {
      const u = i / 29, x0 = lerp(-160, 176, u) + (r() - 0.5) * 16, y0 = -296 - Math.sin(u * Math.PI) * 24 + (r() - 0.5) * 14;
      const ang = 1.57 + (u - 0.5) * 0.7 + (r() - 0.5) * 0.25, L = 150 + r() * 70 - Math.abs(u - 0.45) * 40;
      lock(ctx, r, x0, y0, ang, L, (u < 0.5 ? -1 : 1) * (18 + r() * 26), 24 + r() * 12, C.hair, r() < 0.6 ? (u < 0.4 ? MOON : C.hairHi) : null);
    }
    { const rs = rng(333);
      for (let i = 0; i < 70; i++) {
        const x = -190 + rs() * 400, y = -340 + rs() * 200, a = 1.35 + rs() * 0.5 + (x > 0 ? -0.25 : 0.25), L = 40 + rs() * 70, c = (rs() - 0.5) * 24;
        const col = x < -50 ? `rgba(135,178,186,${0.25 + rs() * 0.35})` : `rgba(74,70,84,${0.3 + rs() * 0.4})`;
        stroke(ctx, [[x, y], [x + Math.cos(a) * L * 0.5 - Math.sin(a) * c, y + Math.sin(a) * L * 0.5 + Math.cos(a) * c], [x + Math.cos(a) * L, y + Math.sin(a) * L]], 1.3 + rs(), col, taper(0.2, 0.6));
      }
    }
    for (let i = 0; i < 6; i++) { const x = -110 + i * 40 + r() * 16; stroke(ctx, [[x, -190], [x + 8 + r() * 18, -150], [x - 4 + r() * 8, -104 - r() * 20]], 2.2, C.hair, taper(0.1, 0.9)); }
    ctx.restore();
  }

  function ear(ctx, p) {
    const e = [[198, -34], [226, -60], [258, -50], [270, -6], [264, 46], [246, 86], [224, 108], [204, 100], [198, 70]];
    fill(ctx, e, C.skinSh);                                                        // ear sits on the shadow side
    stroke(ctx, [[226, -56], [256, -46], [268, -4], [262, 46], [244, 86]], 4, `rgba(214,136,66,${0.75 * p.lantern})`, taper(0.2, 0.3)); // lantern rim
    fill(ctx, [[214, -22], [240, -36], [252, 0], [246, 44], [228, 70], [232, 30], [222, -2]], C.skinDeep);
    stroke(ctx, e, 3.4, C.ink, taper(0.05, 0.05));
    stroke(ctx, [[220, -30], [244, -38], [254, 0], [244, 46], [228, 70]], 2.2, C.ink, taper(0.2, 0.3));       // helix inner
    stroke(ctx, [[232, -8], [240, 20], [232, 50]], 1.8, C.ink, taper(0.2, 0.3));                               // antihelix
    stroke(ctx, [[208, 30], [216, 40], [210, 52]], 2, C.ink, taper(0.2, 0.3));                                 // tragus
  }

  function head(ctx, p) {
    ctx.save();
    ctx.translate(1340 + p.headX, 360 + p.headY);
    ctx.rotate(-0.13 + p.headRot);
    ctx.scale(1.2, 1.2);
    // neck: in the cast shadow of the jaw; sternocleidomastoid + throat
    const neck = [[-118, 230], [-132, 330], [-150, 470], [190, 470], [168, 330], [152, 190]];
    fill(ctx, neck, C.skinSh);
    fill(ctx, [[-110, 250], [-60, 296], [40, 306], [150, 236], [176, 470], [-150, 470]], C.skinDeep);
    stroke(ctx, [[-70, 290], [-30, 380], [-10, 470]], 2, "rgba(20,10,6,.6)", taper(0.2, 0.5));
    stroke(ctx, [[-118, 236], [-132, 330], [-146, 440]], 3, C.ink, taper(0.05, 0.4));
    stroke(ctx, [[156, 200], [170, 330], [186, 440]], 8, `rgba(205,128,60,${0.45 * p.lantern})`, taper(0.1, 0.4));
    stroke(ctx, [[152, 196], [168, 330], [186, 440]], 3.2, C.ink, taper(0.05, 0.4));
    hatch(ctx, [[-60, 300], [150, 240], [180, 470], [-80, 470]], { angle: -0.6, gap: 5, w: 1.1, color: "rgba(16,8,4,.55)", seed: 14, cross: true });
    hair(ctx, p, false);
    ear(ctx, p);
    fill(ctx, FACE, C.skin);
    clipped(ctx, FACE, () => {
      // key light: cool-tinted lift on the lit (left/upper) half
      fill(ctx, [[-184, -120], [-60, -126], [-40, -60], [-60, 60], [-70, 150], [-120, 220], [-176, 150], [-186, 40]], "rgba(170,138,112,.28)");
      // form shadows
      fill(ctx, [[-176, -150], [-100, -192], [0, -204], [100, -192], [200, -160], [206, -118], [100, -146], [0, -158], [-100, -148], [-180, -112]], C.skinSh);   // under the hair
      fill(ctx, CHEEK_SHADOW, C.skinSh);
      fill(ctx, [[60, 250], [130, 206], [172, 140], [200, 140], [160, 228], [90, 276], [30, 290]], C.skinDeep);  // jaw underside
      hatch(ctx, CHEEK_SHADOW, { angle: -1.1, gap: 5, w: 1.1, color: "rgba(30,16,10,.5)", seed: 21 });
      hatch(ctx, [[-176, -150], [0, -204], [200, -160], [206, -118], [0, -158], [-180, -112]], { angle: -0.3, gap: 5, w: 1, color: "rgba(30,16,10,.5)", seed: 22 });
      // bounce: warm rim inside the shadow, along the right jaw edge
      stroke(ctx, [[194, 54], [174, 138], [140, 206], [86, 252]], 10, `rgba(205,128,60,${0.5 * p.lantern})`, taper(0.2, 0.3));
      // key highlights on lit planes: forehead, left cheekbone, chin
      fill(ctx, [[-120, -130], [-40, -142], [30, -132], [-30, -120], [-100, -116]], "rgba(200,160,125,.35)");
      fill(ctx, [[-160, 20], [-120, 6], [-96, 30], [-130, 50], [-164, 52]], "rgba(200,165,135,.35)");
      fill(ctx, [[-60, 248], [-20, 240], [10, 250], [-20, 262]], "rgba(200,165,135,.25)");
      // stubble: blue-grey beard shadow + short hair strokes, densest on jaw/chin/mustache
      fill(ctx, [[-176, 120], [-140, 210], [-90, 256], [-20, 280], [60, 266], [140, 206], [176, 130], [120, 150], [40, 230], [-14, 238], [-80, 226], [-130, 170]], "rgba(40,48,56,.16)");
      fill(ctx, [[-70, 158], [-14, 152], [36, 158], [30, 170], [-14, 166], [-64, 172]], "rgba(40,48,56,.2)");
      const r = rng(55), nz = makeNoise(3);
      for (let i = 0; i < 2600; i++) {
        const x = -180 + r() * 380, y = 100 + r() * 190;
        const jaw = y > 150 + Math.abs(x + 10) * 0.12 - (Math.abs(x) > 120 ? 40 : 0);
        const lips = Math.abs(x + 14) < 64 && y > 166 && y < 216 + p.mouthOpen * 40;
        const mus = y > 150 && y < 170 && Math.abs(x + 14) < 60;
        if (((jaw && !lips) || mus) && nz(x / 24, y / 24) > 0.28) stroke(ctx, [[x, y], [x + 0.6, y + 3.2]], 1.4, "rgba(22,14,10,.5)", () => 1);
      }
    });
    stroke(ctx, FACE_SIDE.slice(0, 8), 4.5, "rgba(156,195,200,.85)", taper(0.15, 0.5));        // moon rim (key side)
    stroke(ctx, FACE_SIDE, 4.6, C.ink, (s) => 0.5 + 0.65 * Math.sin(s * Math.PI));
    stroke(ctx, [[-162, 56], [-130, 82], [-104, 92]], 1.8, "rgba(30,18,12,.55)", taper(0.3, 0.6));   // cheekbones
    stroke(ctx, [[130, 64], [146, 92], [138, 120]], 1.6, "rgba(30,18,12,.45)", taper(0.3, 0.6));
    brow(ctx, [-38, -44], [-150, -38], p, -1);
    brow(ctx, [20, -46], [154, -42], p, 1);
    eye(ctx, -88, 0, 84, p, -1);
    eye(ctx, 80, 2, 98, p, 1);
    nose(ctx, p);
    stroke(ctx, [[-62, 126], [-80, 166], [-78, 200]], 1.8, `rgba(30,18,12,${0.45 + p.clench * 0.3})`, taper(0.2, 0.6));   // nasolabial folds
    stroke(ctx, [[30, 124], [50, 164], [46, 196]], 1.8, `rgba(30,18,12,${0.45 + p.clench * 0.3})`, taper(0.2, 0.6));
    mouth(ctx, p);
    stroke(ctx, [[-30, 250], [-14, 256], [2, 250]], 1.4, "rgba(30,18,12,.45)", taper(0.3, 0.3));      // chin
    hair(ctx, p, true);
    if (p.sweat > 0) {
      const beads = [[60, -150, 1], [-130, -92, 0.8], [168, 40 + p.sweatSlide * 120, 1.2]];
      for (const [x, y, s] of beads) {
        const q = [[x, y - 9 * s], [x + 5 * s, y + 3 * s], [x, y + 8 * s], [x - 5 * s, y + 3 * s]];
        fill(ctx, q, `rgba(210,190,160,${0.55 * p.sweat})`); stroke(ctx, q, 1.4, `rgba(30,18,12,${0.8 * p.sweat})`, () => 1, true);
        fill(ctx, [[x - 2 * s, y], [x - 1 * s, y - 4 * s], [x + 0.5 * s, y + 1 * s]], `rgba(240,250,252,${0.9 * p.sweat})`);
      }
    }
    ctx.restore();
  }

  // ---------------- fleece collar + sleeping bag (frame coords): bag hood wraps the chin, zip runs down from under it
  function bagAndCollar(ctx, p) {
    const b = p.breath * 6, zx = 1296, zy = 792 - b;                // zip top sits right under the chin
    const r = rng(81);
    // fleece collar inside the bag opening
    const collar = [[1010, 900], [1040, 760], [1140, 680], [1260, 740], [1300, 790], [1360, 740], [1520, 690], [1700, 640], [1800, 720], [1840, 900]];
    fill(ctx, collar, C.fleece);
    clipped(ctx, collar, () => {
      hatch(ctx, collar, { angle: -0.9, gap: 6, w: 1.2, color: "rgba(0,0,0,.45)", seed: 82 });
      for (let i = 0; i < 420; i++) { const x = 1010 + r() * 830, y = 640 + r() * 260; stroke(ctx, [[x, y], [x + (r() - 0.5) * 12, y - 5 - r() * 9], [x + (r() - 0.5) * 10, y - 10 - r() * 8]], 3.2, r() < 0.4 ? C.fleeceHi : "#141518", taper(0.2, 0.9)); }
      stroke(ctx, [[1150, 690], [1250, 760], [1296, 800], [1360, 760], [1520, 700]], 18, "rgba(0,0,0,.45)", taper(0.1, 0.1)); // collar seam shadow
    });
    // bag: hood edge rises around both sides of the face, opening dips under the chin
    const rim = [[-40, 860 - b], [300, 770 - b], [640, 720 - b], [900, 700 - b], [1060, 740 - b], [1180, 800 - b], [zx, 836 - b], [1420, 800 - b], [1600, 760 - b], [1800, 780 - b], [1960, 820 - b]];
    const bag = rim.concat([[1960, 1120], [-40, 1120]]);
    fill(ctx, bag, C.bag);
    clipped(ctx, bag, () => {
      // baffles: rounded puffs between seams, three hard tones (lit crown / mid / shadow at the seam) + hatching
      const seamY = (i, x) => { const y0 = 880 + i * 72; const d = (x - zx) / 1000; return y0 + 30 * d * d * 4 - 26 + (x < zx ? 0 : 6) + i * 4 * Math.abs(d) - b; };
      const xs = []; for (let x = -40; x <= 1960; x += 80) xs.push(x);
      for (let i = 0; i < 4; i++) {
        const top = xs.map(x => [x, seamY(i, x)]), bot = xs.map(x => [x, seamY(i + 1, x)]);
        const mid = (f) => xs.map((x, k) => [x, lerp(top[k][1], bot[k][1], f)]);
        fill(ctx, top.concat(mid(0.45).reverse()), "rgba(104,118,66,.55)");                  // lit crown of the puff
        fill(ctx, mid(0.7).concat(bot.slice().reverse()), C.bagSh);                           // shadow rolling into the seam
        hatch(ctx, mid(0.62).concat(bot.slice().reverse()), { angle: -0.35, gap: 6, w: 1.1, color: "rgba(5,6,2,.6)", seed: 150 + i, bounds: [-40, seamY(i, zx) - 10, 1960, seamY(i + 1, 0) + 40] });
        stroke(ctx, mid(0.25), 4, "rgba(160,172,112,.3)", taper(0.1, 0.4));                    // specular ridge
        stroke(ctx, bot, 3.4, C.ink, taper(0.03, 0.03));                                        // seam stitch line
        for (let k = 0; k < xs.length; k++) if (k % 2) stroke(ctx, [[xs[k], bot[k][1] - 2], [xs[k] + 10, bot[k][1] + 2]], 1.4, "rgba(0,0,0,.6)", () => 1);
      }
      // rolled hood edge (thick tube along the rim)
      stroke(ctx, rim.map(q => [q[0], q[1] + 22]), 44, "rgba(30,34,18,.55)", taper(0.01, 0.01));
      stroke(ctx, rim.map(q => [q[0], q[1] + 8]), 10, "rgba(150,165,100,.35)", taper(0.05, 0.3));
      ctx.fillStyle = radial(ctx, 1780, 1100, 30, 760, [[0, `rgba(227,154,59,${0.22 * p.lantern})`], [1, "rgba(227,154,59,0)"]]); ctx.fillRect(0, 600, 1960, 600);
      ctx.fillStyle = radial(ctx, 220, 820, 30, 760, [[0, "rgba(150,200,210,.2)"], [1, "rgba(150,200,210,0)"]]); ctx.fillRect(0, 600, 1960, 600);
      for (let i = 0; i < 380; i++) { const x = r() * 1000, y = 720 + r() * 360; ctx.fillStyle = `rgba(214,230,232,${0.2 + r() * 0.45})`; ctx.fillRect(x, y - b, 2, 2); }
      // zip: tape, interlocking teeth, slight left drift with the body's curve
      const zpath = [[zx, zy + 40], [zx - 8, 940], [zx - 30, 1110]];
      stroke(ctx, zpath, 22, "#171a0f", () => 1);
      const zs = sample(zpath, false, 20);
      for (let i = 0; i < zs.length; i += 2) { const [x, y] = zs[i]; fill(ctx, [[x - 7, y], [x + 1, y - 1], [x + 1, y + 3], [x - 7, y + 3]], "#57563f"); fill(ctx, [[x - 1, y + 3], [x + 7, y + 2], [x + 7, y + 6], [x - 1, y + 6]], "#4a4936"); }
    });
    stroke(ctx, rim, 5.5, C.ink, taper(0.02, 0.02));
    stroke(ctx, rim.slice(0, 6).map(q => [q[0], q[1] + 6]), 3, "rgba(160,200,205,.5)", taper(0.1, 0.4));
    // slider + pull tab + cord loop, hanging (swings slightly with breath)
    const sw = Math.sin(p.t * 1.7) * 2 + p.breath * 2;
    const slider = [[zx - 15, zy + 40], [zx + 15, zy + 40], [zx + 11, zy + 66], [zx - 11, zy + 66]];
    fill(ctx, slider, "#5d5b45"); stroke(ctx, slider, 2.6, C.ink, () => 1, true);
    const tab = [[zx - 9 + sw * 0.3, zy + 64], [zx + 9 + sw * 0.3, zy + 64], [zx + 7 + sw, zy + 112], [zx - 7 + sw, zy + 112]];
    fill(ctx, tab, "#68654c"); stroke(ctx, tab, 2.4, C.ink, () => 1, true);
    fill(ctx, [[zx - 3 + sw, zy + 92], [zx + 3 + sw, zy + 92], [zx + 3 + sw, zy + 104], [zx - 3 + sw, zy + 104]], "#20200f");
    stroke(ctx, [[zx - 2 + sw, zy + 110], [zx - 12 + sw * 1.4, zy + 150], [zx + 4 + sw * 1.6, zy + 186], [zx + 10 + sw, zy + 150], [zx + 3 + sw, zy + 110]], 4, "#6b5a40", taper(0.05, 0.05));
    stroke(ctx, slider.slice(0, 2), 1.6, "rgba(200,210,190,.5)", () => 1);
  }

  function grade(ctx, p) {
    ctx.save();
    // overall night density (multiply), then lantern warmth / moon cool, vignette, locked paper grain
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgb(150,160,168)"; ctx.fillRect(0, 0, 1920, 1080);
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = radial(ctx, 1880, 1000, 40, 1100, [[0, `rgba(227,154,59,${0.4 * p.lantern})`], [1, "rgba(227,154,59,0)"]]); ctx.fillRect(0, 0, 1920, 1080);
    ctx.fillStyle = radial(ctx, 220, 260, 40, 1000, [[0, "rgba(120,180,195,.5)"], [1, "rgba(120,180,195,0)"]]); ctx.fillRect(0, 0, 1920, 1080);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = radial(ctx, 1150, 430, 380, 1200, [[0, "rgba(0,0,0,0)"], [1, "rgba(0,0,0,.8)"]]); ctx.fillRect(0, 0, 1920, 1080);
    ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.38;
    ctx.drawImage(paper(1920, 1080, 11), 0, 0);
    ctx.restore();
  }

  // breath vapour: seeded soft puffs + inked wisps leaving the mouth toward screen-left. age 0..1
  function vapor(ctx, p) {
    const age = p.vapor; if (age < 0 || age > 1) return;
    const m = [1300 + p.headX, 578 + p.headY], r = rng(909);
    for (let i = 0; i < 14; i++) {
      const k = i / 14, life = clamp((age - k * 0.35) / 0.65); if (life <= 0) continue;
      const x = m[0] - life * (180 + r() * 160), y = m[1] - life * (90 + r() * 90) + Math.sin(life * 5 + i) * 12;
      const rad = 18 + life * (50 + r() * 40), a = (1 - life) * 0.3;
      ctx.fillStyle = radial(ctx, x, y, 0, rad, [[0, `rgba(205,215,214,${a})`], [1, "rgba(205,215,214,0)"]]);
      ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.283); ctx.fill();
      if (i % 3 === 0) stroke(ctx, [[x + rad * 0.5, y], [x, y - rad * 0.3], [x - rad * 0.6, y - rad * 0.1]], 1.4, `rgba(220,228,228,${a * 1.4})`, taper(0.3, 0.6));
    }
  }

  function drawCloseup(ctx, pose) {
    const p = Object.assign({}, DEFAULT_POSE, pose);
    tentWall(ctx, p);
    head(ctx, p);
    bagAndCollar(ctx, p);
    vapor(ctx, p);
    grade(ctx, p);
  }

  window.SHOT_CLOSEUP = { drawCloseup, DEFAULT_POSE, C };
})();

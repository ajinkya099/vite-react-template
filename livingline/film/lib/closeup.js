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
    headX: 0, headY: 0, headRot: 0, lantern: 1, wallPress: 0, breath: 0, sweat: 1, sweatSlide: 0, drip: 0, vapor: -1, t: 0 };

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

  // ---------------- DEV head rig (local coords: eye line y=0, face centre x=0)
  const FACE_SIDE = [[-170, -120], [-184, -30], [-180, 60], [-170, 146], [-146, 212], [-100, 256], [-34, 278], [24, 276], [92, 250], [144, 204], [176, 136], [196, 52], [202, -30], [198, -120]];
  const FACE = FACE_SIDE.concat([[170, -205], [70, -262], [-60, -262], [-150, -210]]);

  function eye(ctx, cx, cy, w, p, side) {
    const o = clamp(p.eyeOpen), h = w * 0.36;
    const sq = p.flutter;                                   // squeeze (nightmare)
    const upOpen = [[cx - w / 2, cy + 3], [cx - w * 0.22, cy - h * 1.02], [cx + w * 0.22, cy - h * 1.0], [cx + w / 2, cy - 2]];
    const upShut = [[cx - w / 2, cy + 3], [cx - w * 0.2, cy + 7 + sq * 3], [cx + w * 0.2, cy + 7 + sq * 3], [cx + w / 2, cy + 1]];
    const lowOpen = [[cx + w / 2 - 3, cy - 1], [cx + w * 0.18, cy + h * 0.62], [cx - w * 0.2, cy + h * 0.6], [cx - w / 2 + 2, cy + 3]];
    const lowShut = [[cx + w / 2 - 3, cy + 1], [cx + w * 0.18, cy + 8], [cx - w * 0.2, cy + 8], [cx - w / 2 + 2, cy + 3]];
    const up = lp(upShut, upOpen, o), low = lp(lowShut, lowOpen, Math.min(1, o * 1.4));
    // socket shading around the eye
    fill(ctx, [[cx - w * 0.62, cy + 4], [cx - w * 0.3, cy - h * 1.5], [cx + w * 0.35, cy - h * 1.55], [cx + w * 0.62, cy], [cx + w * 0.3, cy + h * 0.9], [cx - w * 0.3, cy + h * 0.9]], "rgba(60,38,28,.16)");
    if (o > 0.04) {
      const white = up.concat(low);
      clipped(ctx, white, () => {
        fill(ctx, white, C.white);
        const ir = w * 0.235, ix = cx + p.gazeX * w * 0.27, iy = cy + p.gazeY * h * 0.5 + (1 - o) * h * 0.25;
        ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.283); ctx.fillStyle = C.iris; ctx.fill();
        ctx.beginPath(); ctx.arc(ix, iy, ir * 0.8, 0, 6.283); ctx.fillStyle = "#4e3422"; ctx.fill();
        ctx.beginPath(); ctx.arc(ix, iy, ir * p.pupil, 0, 6.283); ctx.fillStyle = "#070505"; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(ix, iy, ir, 0, 6.283); ctx.stroke();
        ctx.beginPath(); ctx.arc(ix - ir * 0.35, iy - ir * 0.38, ir * 0.18, 0, 6.283); ctx.fillStyle = "rgba(245,240,230,.95)"; ctx.fill();
        // upper-lid shadow band on the white
        stroke(ctx, up.map(q => [q[0], q[1] + 6]), 12, "rgba(40,28,22,.45)", taper(0.1, 0.1));
      });
      stroke(ctx, low, 2.0, C.ink, taper(0.3, 0.5));
      // terror: under-eye lines
      stroke(ctx, [[cx - w * 0.32, cy + h * 0.95], [cx, cy + h * 1.08], [cx + w * 0.28, cy + h * 0.9]], 1.4, "rgba(30,20,15,.6)", taper(0.3, 0.3));
    } else {
      stroke(ctx, lowShut.map(q => [q[0], q[1] + 4]), 1.2, "rgba(30,20,15,.5)", taper(0.3, 0.3));
    }
    // upper lid line (thick, tapered) + lash flick at the outer corner
    const outer = side < 0 ? 0 : up.length - 1;
    stroke(ctx, up, lerp(5.5, 7, o), C.ink, taper(0.12, 0.08));
    const oc = up[outer], dir = side < 0 ? -1 : 1;
    stroke(ctx, [oc, [oc[0] + dir * 9, oc[1] - 3 - o * 3], [oc[0] + dir * 15, oc[1] - 2 - o * 6]], 4, C.ink, taper(0.05, 0.9));
    // crease
    const crease = up.map((q, i) => [q[0] + (i - 1.5) * 1.5, q[1] - 10 - o * 7 - sq * 3]);
    stroke(ctx, crease.slice(0, 4), 2, "rgba(25,16,12,.75)", taper(0.25, 0.4));
  }

  function brow(ctx, inner, outer, p, side) {
    const raise = p.browRaise, knit = p.browKnit;
    const ix = inner[0] - side * knit * 7, iy = inner[1] - raise * 20 + knit * 5 + p.flutter * 6;
    const mx = (inner[0] + outer[0]) / 2, my = (inner[1] + outer[1]) / 2 - 8 - raise * 8;
    const ox = outer[0], oy = outer[1] + raise * 2;
    clump(ctx, [[ix, iy], [mx, my], [ox, oy]], 21, "#120d0c", 0.25, 0.7);
    // hair texture ticks on the brow
    const r = rng(side > 0 ? 5 : 6);
    for (let i = 0; i < 12; i++) {
      const t = i / 12, x = lerp(ix, ox, t), y = lerp(iy, oy, t) - Math.sin(t * Math.PI) * (8 + raise * 8);
      stroke(ctx, [[x, y + 5], [x + side * 6, y - 4 + r() * 2]], 1.4, "#2a2220", taper(0.2, 0.6));
    }
  }

  function mouth(ctx, p) {
    const o = clamp(p.mouthOpen), c = clamp(p.clench), mx = -18, my = 184, sw = 1 + c * 0.14;
    const X = (x) => mx + (x - mx) * sw;
    const top = [[X(-76), my + 2], [X(-44), my - 6 - o * 6], [X(-18), my - 3 - o * 6], [X(8), my - 6 - o * 6], [X(42), my + 1]];
    const botY = my + 6 + o * 44 + c * 12;
    const bot = [[X(42), my + 1], [X(14), botY], [X(-20), botY + 4], [X(-52), botY], [X(-76), my + 2]];
    if (o > 0.05 || c > 0.05) {
      const hole = top.concat(bot);
      clipped(ctx, hole, () => {
        fill(ctx, hole, "#1a0c0a");
        const tTop = my - 6, tH = 12 + c * 6;
        ctx.fillStyle = "#cdbfa6"; ctx.fillRect(X(-70), tTop, X(36) - X(-70), tH);              // upper teeth
        if (c > 0.05) { ctx.fillRect(X(-66), botY - 14, X(34) - X(-66), 12); }                    // lower teeth when clenched
        for (let i = -3; i <= 2; i++) { stroke(ctx, [[mx + i * 17, tTop], [mx + i * 17, tTop + tH]], 1.1, "rgba(60,40,30,.6)", () => 1); }
        stroke(ctx, top.map(q => [q[0], q[1] + 8]), 8, "rgba(20,10,8,.5)", taper(0.1, 0.1));
      });
      stroke(ctx, bot, 1.8, C.ink, taper(0.3, 0.3));
    }
    stroke(ctx, top, 3.4, C.ink, taper(0.18, 0.18));
    // lower-lip volume
    stroke(ctx, [[X(-44), botY + 18], [X(-18), botY + 22], [X(12), botY + 17]], 2, "rgba(40,24,18,.7)", taper(0.3, 0.3));
    fill(ctx, [[X(-50), botY + 20], [X(-18), botY + 26], [X(16), botY + 19], [X(0), botY + 32], [X(-36), botY + 32]], "rgba(70,44,32,.45)");
  }

  // S-curved lock: start, direction angle, length, curl amounts, width
  function lock(ctx, r, x0, y0, ang, L, curl, w, color, hi) {
    const ux = Math.cos(ang), uy = Math.sin(ang), vx = -uy, vy = ux;
    const c1 = curl * (0.3 + r() * 0.4), c2 = -curl * (0.2 + r() * 0.5), c3 = curl * (0.6 + r() * 0.6);
    const P = (t, c) => [x0 + ux * L * t + vx * c, y0 + uy * L * t + vy * c];
    const sp = [[x0, y0], P(0.33, c1), P(0.66, c2), P(1, c3)];
    const hk = P(0.86 + r() * 0.1, c3 + Math.sign(curl || 1) * (10 + r() * 16));
    sp.push(hk);
    clump(ctx, sp, w, color, 0.22, 0.7);
    if (hi) stroke(ctx, [P(0.08, c1 * 0.2 + w * 0.15), P(0.36, c1 + w * 0.12), P(0.62, c2 + w * 0.08)], 1.6, hi, taper(0.2, 0.7));
  }

  function hair(ctx, p, front) {
    const r = rng(front ? 300 : 200);
    if (!front) {
      // silhouette mass, then a fringe of curly locks around the crown
      fill(ctx, [[-210, -20], [-236, -160], [-190, -300], [-70, -366], [80, -368], [210, -310], [268, -190], [262, -40], [230, -20], [200, -130], [0, -220], [-186, -120]], C.hair);
      for (let i = 0; i < 64; i++) {
        const a = Math.PI * (0.95 + (i / 64) * 1.12) + (r() - 0.5) * 0.08, R = 205 + r() * 30;
        const x0 = 14 + Math.cos(a) * R * 1.1, y0 = -170 + Math.sin(a) * R * 0.95;
        const hi = a > 3.4 && a < 4.3 ? "rgba(130,172,180,.55)" : r() < 0.5 ? C.hairHi : null;
        lock(ctx, r, x0, y0, a + (r() - 0.5) * 0.5, 50 + r() * 70, (r() - 0.5) * 60, 20 + r() * 16, C.hair, hi);
      }
      return;
    }
    fill(ctx, [[-190, -110], [-176, -250], [-80, -320], [60, -324], [184, -262], [210, -110], [186, -140], [160, -112], [130, -150], [96, -118], [60, -146], [24, -108], [-12, -142], [-48, -112], [-84, -146], [-120, -116], [-156, -140]], C.hair);
    // side hair over the temples
    for (let i = 0; i < 9; i++) lock(ctx, r, -150 - r() * 30, -230 + i * 18, 1.75 + r() * 0.3, 90 + r() * 60, -20 - r() * 30, 26 + r() * 10, C.hair, i % 2 ? "rgba(130,172,180,.6)" : null);
    for (let i = 0; i < 7; i++) lock(ctx, r, 170 + r() * 30, -240 + i * 18, 1.45 - r() * 0.3, 80 + r() * 50, 20 + r() * 30, 24 + r() * 10, C.hair, null);
    // damp bangs: long S-curved locks from the crown falling over the forehead
    for (let i = 0; i < 30; i++) {
      const u = i / 29, x0 = lerp(-150, 170, u) + (r() - 0.5) * 20, y0 = -300 - Math.sin(u * Math.PI) * 30 + (r() - 0.5) * 16;
      const ang = 1.57 + (u - 0.45) * 0.9 + (r() - 0.5) * 0.35;
      const L = 120 + r() * 120 - Math.abs(u - 0.5) * 30;
      lock(ctx, r, x0, y0, ang, L, (r() - 0.5) * 70, 22 + r() * 14, C.hair, r() < 0.55 ? (u < 0.35 ? "rgba(130,172,180,.6)" : C.hairHi) : null);
    }
    // heavy fringe locks hanging straight down over the brow line
    for (let i = 0; i < 16; i++) {
      const x0 = -170 + i * 23 + (r() - 0.5) * 10, y0 = -220 + (r() - 0.5) * 20;
      lock(ctx, r, x0, y0, 1.57 + (r() - 0.5) * 0.5, 90 + r() * 50, (r() - 0.5) * 36, 20 + r() * 12, C.hair, r() < 0.4 ? C.hairHi : null);
    }
    { const rs = rng(333);
      for (let i = 0; i < 90; i++) {
        const x = -200 + rs() * 440, y = -350 + rs() * 230, a = 1.2 + rs() * 0.8 + (x > 0 ? -0.4 : 0.4), L = 30 + rs() * 60, c = (rs() - 0.5) * 30;
        const col = x < -60 ? `rgba(130,172,180,${0.25 + rs() * 0.35})` : `rgba(70,68,80,${0.35 + rs() * 0.4})`;
        stroke(ctx, [[x, y], [x + Math.cos(a) * L * 0.5 - Math.sin(a) * c, y + Math.sin(a) * L * 0.5 + Math.cos(a) * c], [x + Math.cos(a) * L, y + Math.sin(a) * L]], 1.3 + rs(), col, taper(0.2, 0.6));
      }
    }
    // stray wet strands stuck to the forehead
    for (let i = 0; i < 8; i++) {
      const x = -120 + i * 34 + r() * 16;
      stroke(ctx, [[x, -210], [x + 10 + r() * 22, -160], [x - 4 + r() * 10, -110 - r() * 26]], 2.4, C.hair, taper(0.1, 0.9));
    }
  }

  function head(ctx, p) {
    ctx.save();
    ctx.translate(1340 + p.headX, 360 + p.headY);
    ctx.rotate(-0.13 + p.headRot);
    ctx.scale(1.2, 1.2);
    // neck
    const neck = [[-118, 230], [-132, 330], [-150, 470], [190, 470], [168, 330], [152, 190]];
    fill(ctx, neck, C.skinSh);
    fill(ctx, [[-110, 250], [-60, 290], [40, 300], [150, 240], [176, 470], [-150, 470]], C.skinDeep);
    hatch(ctx, [[-60, 300], [150, 250], [180, 470], [-80, 470]], { angle: -0.6, gap: 6, w: 1.2, color: "rgba(20,10,6,.55)", seed: 14 });
    stroke(ctx, [[-118, 230], [-132, 330], [-146, 440]], 3, C.ink, taper(0.05, 0.4));
    stroke(ctx, [[152, 190], [168, 330], [186, 440]], 3.2, C.ink, taper(0.05, 0.4));
    hair(ctx, p, false);
    // ear (screen-right)
    const ear = [[200, -30], [230, -58], [262, -42], [270, 10], [260, 62], [238, 100], [212, 110], [198, 80]];
    fill(ctx, ear, C.skinLit);
    fill(ctx, [[214, -20], [244, -36], [254, 10], [244, 60], [224, 84], [230, 40], [222, 0]], C.skinSh);
    stroke(ctx, ear, 3.4, C.ink, taper(0.05, 0.05));
    stroke(ctx, [[222, -24], [246, -30], [252, 14], [238, 58], [224, 76]], 2.2, C.ink, taper(0.2, 0.3));
    stroke(ctx, [[232, 20], [222, 40], [230, 58]], 1.8, C.ink, taper(0.2, 0.3));
    // face base
    fill(ctx, FACE, C.skin);
    clipped(ctx, FACE, () => {
      // warm lantern bounce low-right, cool moon on the left cheek
      ctx.fillStyle = radial(ctx, 220, 260, 10, 300, [[0, `rgba(196,128,64,${0.55 * p.lantern})`], [1, "rgba(196,128,64,0)"]]); ctx.fillRect(-300, -300, 700, 700);
      ctx.fillStyle = radial(ctx, -230, -40, 10, 200, [[0, "rgba(120,170,180,.35)"], [1, "rgba(120,170,180,0)"]]); ctx.fillRect(-300, -300, 700, 700);
      // cel shadows (hard edged)
      const sh = C.skinSh;
      fill(ctx, [[-176, -150], [-100, -192], [0, -204], [100, -192], [200, -160], [206, -118], [100, -146], [0, -158], [-100, -148], [-180, -112]], sh); // under hairline
      fill(ctx, [[-14, -22], [-4, 40], [4, 96], [-6, 124], [-22, 128], [-14, 98], [-22, 40]], sh);                    // nose side plane
      fill(ctx, [[-66, 140], [-34, 148], [2, 138], [-8, 154], [-40, 160]], C.skinDeep);                                 // under nose
      fill(ctx, [[150, 24], [190, 4], [206, 70], [184, 150], [140, 214], [104, 196], [150, 124], [162, 70]], sh);       // right cheek plane
      fill(ctx, [[30, 252], [118, 206], [168, 140], [196, 140], [156, 220], [82, 270], [18, 282]], sh);                 // jaw
      fill(ctx, [[-62, 216], [-18, 224], [28, 214], [14, 232], [-20, 238], [-52, 230]], sh);                            // under lip
      hatch(ctx, [[150, 24], [190, 4], [206, 70], [184, 150], [140, 214], [104, 196], [150, 124], [162, 70]], { angle: -1.1, gap: 6, w: 1.1, color: "rgba(30,16,10,.55)", seed: 21 });
      hatch(ctx, [[-176, -150], [0, -204], [200, -160], [206, -118], [0, -158], [-180, -112]], { angle: -0.3, gap: 5, w: 1, color: "rgba(30,16,10,.5)", seed: 22 });
      hatch(ctx, [[30, 252], [118, 206], [168, 140], [196, 140], [156, 220], [82, 270], [18, 282]], { angle: 0.6, gap: 5, w: 1.1, color: "rgba(25,12,8,.6)", seed: 23, cross: true });
      hatch(ctx, [[-14, -22], [-4, 40], [4, 96], [-6, 124], [-22, 128], [-14, 98], [-22, 40]], { angle: -1.2, gap: 4, w: 0.9, color: "rgba(25,12,8,.5)", seed: 24 });
      hatch(ctx, [[-180, 40], [-120, 90], [-150, 180], [-176, 140]], { angle: -0.9, gap: 6, w: 1, color: "rgba(25,12,8,.4)", seed: 25 });
      // forehead + nose-bridge highlights
      fill(ctx, [[-90, -130], [-20, -140], [40, -128], [-10, -118], [-70, -116]], "rgba(190,140,96,.45)");
      stroke(ctx, [[-26, -4], [-24, 50], [-30, 104]], 4, "rgba(186,140,100,.35)", taper(0.3, 0.3));
      // stubble
      const r = rng(55), nz = makeNoise(3);
      for (let i = 0; i < 1400; i++) {
        const x = -170 + r() * 370, y = 110 + r() * 200;
        const inJaw = (y > 140 + Math.abs(x + 10) * 0.18) && !(Math.abs(x + 18) < 70 && y > 180 && y < 240 + (p.mouthOpen * 44));
        const inMus = y > 160 && y < 186 && Math.abs(x + 18) < 64;
        if ((inJaw || inMus) && nz(x / 30, y / 30) > 0.35) { ctx.fillStyle = "rgba(25,16,12,.55)"; ctx.fillRect(x, y, 1.8, 1.8); }
      }
    });
    // moon rim on the left contour, ink contour
    stroke(ctx, FACE_SIDE.slice(0, 8), 4.5, "rgba(156,195,200,.8)", taper(0.15, 0.5));
    stroke(ctx, FACE_SIDE, 4.6, C.ink, (s) => 0.55 + 0.6 * Math.sin(s * Math.PI));
    // brows, eyes, nose, mouth
    brow(ctx, [-38, -44], [-150, -38], p, -1);
    brow(ctx, [20, -46], [154, -42], p, 1);
    eye(ctx, -88, 0, 86, p, -1);
    eye(ctx, 80, 2, 98, p, 1);
    stroke(ctx, [[-14, -14], [-8, 50], [-4, 98]], 2, "rgba(25,15,10,.8)", taper(0.2, 0.4));
    stroke(ctx, [[-52, 116], [-36, 132], [-14, 134], [2, 122]], 2.6, C.ink, taper(0.2, 0.2));
    stroke(ctx, [[-64, 108], [-68, 128], [-54, 142]], 2.8, C.ink, taper(0.2, 0.3));
    stroke(ctx, [[2, 104], [12, 124], [0, 140]], 2.8, C.ink, taper(0.2, 0.3));
    fill(ctx, [[-50, 134], [-40, 131], [-36, 138], [-46, 140]], "#120a08");
    fill(ctx, [[-12, 134], [-2, 131], [2, 137], [-8, 140]], "#120a08");
    mouth(ctx, p);
    stroke(ctx, [[-160, 60], [-130, 84], [-104, 92]], 1.8, "rgba(30,18,12,.55)", taper(0.3, 0.6));
    stroke(ctx, [[176, 60], [150, 92], [128, 104]], 1.8, "rgba(30,18,12,.55)", taper(0.3, 0.6));
    // nasolabial fold (tension)
    stroke(ctx, [[-70, 126], [-84, 170], [-80, 206]], 1.8, "rgba(30,18,12,.6)", taper(0.2, 0.6));
    stroke(ctx, [[18, 120], [40, 166], [36, 200]], 1.8, "rgba(30,18,12,.6)", taper(0.2, 0.6));
    hair(ctx, p, true);
    // sweat beads
    if (p.sweat > 0) {
      const beads = [[60, -150, 1], [-130, -92, 0.8], [168, 40 + p.sweatSlide * 120, 1.2]];
      for (const [x, y, s] of beads) {
        const q = [[x, y - 9 * s], [x + 5 * s, y + 3 * s], [x, y + 8 * s], [x - 5 * s, y + 3 * s]];
        fill(ctx, q, "rgba(210,190,160,.55)"); stroke(ctx, q, 1.4, "rgba(30,18,12,.8)", () => 1, true);
        fill(ctx, [[x - 2 * s, y], [x - 1 * s, y - 4 * s], [x + 0.5 * s, y + 1 * s]], "rgba(255,250,240,.9)");
      }
    }
    ctx.restore();
  }

  // ---------------- fleece collar + sleeping bag (frame coords)
  function bagAndCollar(ctx, p) {
    const b = p.breath * 6;
    // high-pile fleece collar hugging the jaw
    const collar = [[1000, 930], [1030, 740], [1130, 650], [1290, 690], [1420, 720], [1560, 680], [1720, 630], [1810, 720], [1850, 930]];
    fill(ctx, collar, C.fleece);
    const r = rng(81);
    clipped(ctx, collar, () => {
      hatch(ctx, collar, { angle: -0.9, gap: 6, w: 1.2, color: "rgba(0,0,0,.45)", seed: 82 });
      for (let i = 0; i < 420; i++) {
        const x = 1030 + r() * 800, y = 690 + r() * 240;
        stroke(ctx, [[x, y], [x + (r() - 0.5) * 12, y - 5 - r() * 9], [x + (r() - 0.5) * 10, y - 10 - r() * 8]], 3.2, r() < 0.4 ? C.fleeceHi : "#141518", taper(0.2, 0.9));
      }
    });
    for (let i = 0; i < 70; i++) { // fuzzy top edge
      const t = i / 70, x = lerp(1060, 1790, t), y = 700 + Math.sin(t * 9) * 30 + 20;
      stroke(ctx, [[x, y + 10], [x + (r() - 0.5) * 14, y - 8 - r() * 8]], 4, "#1b1c20", taper(0.2, 0.9));
    }
    // sleeping bag: puffed baffles converging on the zip
    const top = [[-40, 880 - b], [260, 790 - b], [560, 730 - b], [860, 712 - b], [1080, 760 - b], [1250, 820 - b], [1500, 800 - b], [1960, 830 - b]];
    const bag = top.concat([[1960, 1120], [-40, 1120]]);
    fill(ctx, bag, C.bag);
    const zx = 1190;
    clipped(ctx, bag, () => {
      // baffle seams: curves from the edges sweeping into the zip, each with a puff above and crease below
      const seams = [];
      for (let i = 0; i < 3; i++) {
        const yL = 880 + i * 96 + (i % 2) * 22, yR = 900 + i * 90 - (i % 2) * 16;
        seams.push([[-40, yL + 60], [220, yL - 30 + i * 10], [520, yL + 24], [820, yL - 6], [zx - 20, yL + 54 + i * 16]]);
        seams.push([[zx + 20, yR + 40 + i * 12], [1380, yR - 18], [1640, yR + 14], [1960, yR - 24]]);
      }
      for (let k = 0; k < seams.length; k++) {
        const sm = seams[k].map(q => [q[0], q[1] - b]);
        const puff = sm.map(q => [q[0], q[1] - 54]);
        fill(ctx, puff.concat(sm.slice().reverse()), "rgba(100,112,62,.55)");                 // lit upper face of the puff
        fill(ctx, sm.concat(sm.map(q => [q[0], q[1] + 26]).reverse()), C.bagSh);              // crease shadow
        hatch(ctx, sm.concat(sm.map(q => [q[0], q[1] + 30]).reverse()), { angle: -0.4, gap: 6, w: 1.1, color: "rgba(5,6,2,.6)", seed: 140 + k });
        stroke(ctx, sm, 3.6, C.ink, taper(0.05, 0.05));
        stroke(ctx, puff.map(q => [q[0], q[1] + 8]), 5, "rgba(140,152,96,.35)", taper(0.2, 0.4));
      }
      ctx.fillStyle = radial(ctx, 1760, 1100, 30, 760, [[0, `rgba(227,154,59,${0.25 * p.lantern})`], [1, "rgba(227,154,59,0)"]]); ctx.fillRect(0, 600, 1960, 600);
      ctx.fillStyle = radial(ctx, 200, 820, 30, 700, [[0, "rgba(150,200,210,.18)"], [1, "rgba(150,200,210,0)"]]); ctx.fillRect(0, 600, 1960, 600);
      for (let i = 0; i < 360; i++) { const x = r() * 980, y = 730 + r() * 360; ctx.fillStyle = `rgba(214,230,232,${0.2 + r() * 0.45})`; ctx.fillRect(x, y - b, 2, 2); }
    });
    stroke(ctx, top, 5.5, C.ink, taper(0.02, 0.02));
    stroke(ctx, top.slice(0, 5).map(q => [q[0], q[1] + 6]), 3, "rgba(160,200,205,.45)", taper(0.1, 0.4));
    // zip
    stroke(ctx, [[zx, 770 - b], [zx - 14, 920], [zx - 40, 1110]], 12, "#15170e", () => 1);
    for (let i = 0; i < 26; i++) { const t = i / 26, x = lerp(zx, zx - 40, t * t * 0.5 + t * 0.5), y = lerp(770 - b, 1110, t); ctx.fillStyle = "#4d4c3b"; ctx.fillRect(x - 6, y, 12, 3); }
    const tab = [[zx - 18, 790 - b], [zx + 18, 790 - b], [zx + 13, 856 - b], [zx - 13, 856 - b]];
    fill(ctx, tab, "#5a5843"); stroke(ctx, tab, 2.6, C.ink, () => 1, true);
    fill(ctx, [[zx - 6, 802 - b], [zx + 6, 802 - b], [zx + 4, 826 - b], [zx - 4, 826 - b]], "#1c1c14");
    stroke(ctx, [[zx, 856 - b], [zx - 8, 910 - b], [zx + 6, 966 - b], [zx - 2, 990 - b]], 4.5, "#6b5a40", taper(0.1, 0.5));
  }

  function grade(ctx, p) {
    ctx.save();
    // overall night density (multiply), then lantern warmth / moon cool, vignette, locked paper grain
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgb(150,160,168)"; ctx.fillRect(0, 0, 1920, 1080);
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = radial(ctx, 1880, 1000, 40, 1100, [[0, `rgba(227,154,59,${0.6 * p.lantern})`], [1, "rgba(227,154,59,0)"]]); ctx.fillRect(0, 0, 1920, 1080);
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
    const m = [1300 + p.headX, 588 + p.headY], r = rng(909);
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

/* Living Line — ink toolkit. Pure Canvas2D, fully deterministic (all randomness seeded).
   Exposes window.INK. Every drawing call is a function of its inputs only. */
(function () {
  const TAU = Math.PI * 2;

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // 2D value noise (seeded, smooth)
  function makeNoise(seed) {
    const r = rng(seed), P = new Float32Array(512);
    for (let i = 0; i < 512; i++) P[i] = r();
    const h = (x, y) => P[((x * 73856093) ^ (y * 19349663)) & 511];
    const s = (t) => t * t * (3 - 2 * t);
    return function (x, y) {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
      const u = s(xf), v = s(yf);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
  }

  // Catmull-Rom sampling through control points -> dense polyline
  function sample(pts, closed, per = 10) {
    const out = [], n = pts.length;
    if (n < 2) return pts.slice();
    const get = (i) => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    const segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
        ]);
      }
    }
    if (!closed) out.push(pts[n - 1].slice());
    return out;
  }

  function pathFrom(ctx, pts, closed = true, per = 10) {
    const s = sample(pts, closed, per);
    ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]);
    for (let i = 1; i < s.length; i++) ctx.lineTo(s[i][0], s[i][1]);
    if (closed) ctx.closePath();
  }

  function fill(ctx, pts, color, closed = true) { pathFrom(ctx, pts, closed); ctx.fillStyle = color; ctx.fill(); }

  // Variable-width ink stroke. profile(s) in 0..1 -> width multiplier. Default: tapered both ends.
  const taper = (a = 0.15, b = 0.15) => (s) => Math.min(1, s / a, (1 - s) / b) ** 0.7;
  function stroke(ctx, pts, w, color = "#0b0e10", profile = taper(), closed = false) {
    const s = sample(pts, closed, 12);
    if (closed) s.push(s[0]);
    const n = s.length; if (n < 2) return;
    let len = [0];
    for (let i = 1; i < n; i++) len.push(len[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]));
    const L = len[n - 1] || 1, left = [], right = [];
    for (let i = 0; i < n; i++) {
      const a = s[Math.max(0, i - 1)], b = s[Math.min(n - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const hw = 0.5 * w * Math.max(0.04, profile(len[i] / L));
      left.push([s[i][0] - dy * hw, s[i][1] + dx * hw]); right.push([s[i][0] + dy * hw, s[i][1] - dx * hw]);
    }
    ctx.beginPath(); ctx.moveTo(left[0][0], left[0][1]);
    for (const p of left) ctx.lineTo(p[0], p[1]);
    for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  }

  // Tapered filled "clump" along a spine (hair locks, folds). widths: [w0,wmax,wEnd]
  function clump(ctx, spine, wmax, color, startTaper = 0.35, endTaper = 0.9) {
    stroke(ctx, spine, wmax, color, (s) => {
      if (s < startTaper) return 0.55 + 0.45 * (s / startTaper);
      return Math.max(0.02, 1 - ((s - startTaper) / (1 - startTaper)) ** (1 / endTaper) * 0.98);
    });
  }

  // Hatching clipped to a region. region: array of control pts (closed spline) or a callback that builds a path.
  function hatch(ctx, region, { angle = -0.7, gap = 7, w = 1.1, color = "rgba(8,10,12,.55)", seed = 1, jitter = 0.35, cross = false, bounds } = {}) {
    const r = rng(seed);
    ctx.save();
    if (typeof region === "function") region(ctx); else pathFrom(ctx, region, true);
    ctx.clip();
    let bx0, by0, bx1, by1;
    if (bounds) [bx0, by0, bx1, by1] = bounds;
    else { const s = sample(region, true, 4); bx0 = Math.min(...s.map(p => p[0])); bx1 = Math.max(...s.map(p => p[0])); by0 = Math.min(...s.map(p => p[1])); by1 = Math.max(...s.map(p => p[1])); }
    const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2, R = Math.hypot(bx1 - bx0, by1 - by0) / 2 + 10;
    const passes = cross ? [angle, angle + 1.2] : [angle];
    for (const ang of passes) {
      const ux = Math.cos(ang), uy = Math.sin(ang), vx = -uy, vy = ux;
      for (let o = -R; o <= R; o += gap) {
        const off = o + (r() - 0.5) * gap * jitter;
        const a0 = -R * (0.75 + r() * 0.25), a1 = R * (0.75 + r() * 0.25);
        const p0 = [cx + vx * off + ux * a0, cy + vy * off + uy * a0], p1 = [cx + vx * off + ux * a1, cy + vy * off + uy * a1];
        const mid = [(p0[0] + p1[0]) / 2 + vx * (r() - 0.5) * 2, (p0[1] + p1[1]) / 2 + vy * (r() - 0.5) * 2];
        stroke(ctx, [p0, mid, p1], w * (0.7 + r() * 0.6), color, taper(0.2, 0.2));
      }
    }
    ctx.restore();
  }

  // Clip helper
  function clipped(ctx, pts, fn) { ctx.save(); pathFrom(ctx, pts, true); ctx.clip(); fn(); ctx.restore(); }

  // Locked paper grain + fibre texture (computed once per seed; identical every frame)
  const grainCache = {};
  function paper(w, h, seed = 11) {
    const key = w + "x" + h + ":" + seed; if (grainCache[key]) return grainCache[key];
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"), img = g.createImageData(w, h), r = rng(seed), nz = makeNoise(seed + 1);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const v = 128 + (r() - 0.5) * 70 + (nz(x / 90, y / 90) - 0.5) * 50 + (nz(x / 7, y / 7) - 0.5) * 30;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    // fibres
    g.globalAlpha = 0.18;
    for (let k = 0; k < 900; k++) {
      const x = r() * w, y = r() * h, a = r() * TAU, l = 6 + r() * 26;
      g.strokeStyle = r() < 0.5 ? "#000" : "#fff"; g.lineWidth = 0.6;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (r() - .5) * 6, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    grainCache[key] = c; return c;
  }

  function radial(ctx, x, y, r0, r1, stops) {
    const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
    for (const [o, c] of stops) g.addColorStop(o, c);
    return g;
  }

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
  const lp = (P, Q, t) => P.map((p, i) => [lerp(p[0], Q[i][0], t), lerp(p[1], Q[i][1], t)]);

  window.INK = { TAU, rng, makeNoise, sample, pathFrom, fill, stroke, taper, clump, hatch, clipped, paper, radial, lerp, clamp, smooth, lp };
})();

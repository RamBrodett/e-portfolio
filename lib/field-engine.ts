/*
  Field engine: a self-moving, pointer-reactive particle background on a 2D canvas.

  Modes
    orbit   – square particles drift on a slow, swirling current; the pointer gathers
              them into a breathing ring. Click empty space to scatter them.
    lattice – a grid of short dashes that sway as waves pass; around the pointer they
              line up like iron filings and turn orange. Click to send a ripple.
    streams – wind-map trails that follow the current; the pointer is a vortex that
              pulls the grey wind in and turns it orange.

  When the pointer is idle or absent (touch screens), the focus wanders on its own,
  so the background is always alive. Respects prefers-reduced-motion (draws one still frame).
*/

export type FieldMode = "orbit" | "lattice" | "streams";
export type FieldTheme = "light" | "dark";

export interface FieldOptions {
  mode?: FieldMode;
  theme?: FieldTheme;
}

export interface FieldHandle {
  setMode(mode: FieldMode): void;
  setTheme(theme: FieldTheme): void;
  destroy(): void;
}

const TAU = Math.PI * 2;
const ACCENT = "249,115,22";
const INK: Record<FieldTheme, string> = { dark: "236,231,225", light: "40,34,29" };
const BUCKETS = 12;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const angDiff = (b: number, a: number) => {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  else if (d < -Math.PI) d += TAU;
  return d;
};

// Smooth angle field, used for the lattice's resting orientation.
function flow(x: number, y: number, t: number) {
  const s = 0.0017;
  return (
    Math.sin(x * s + t * 0.21) * 1.6 +
    Math.cos(y * s * 1.27 - t * 0.17) * 1.6 +
    Math.sin((x - y) * s * 0.63 + t * 0.09) * 1.2
  );
}

// Divergence-free drift (curl of a moving potential), so particles never clump.
const CURL = { x: 0, y: 0 };
function curl(x: number, y: number, t: number) {
  const a = 0.0021, b = 0.0027, c = 0.0013;
  const p1 = x * a + t * 0.23, p2 = y * b - t * 0.19, p3 = (x + y) * c + t * 0.11;
  const q1 = (x - y) * 0.0034 - t * 0.29;
  const dpdx = a * Math.cos(p1) * Math.cos(p2) + c * 0.8 * Math.cos(p3) + 0.0034 * 0.35 * Math.cos(q1);
  const dpdy = -b * Math.sin(p1) * Math.sin(p2) + c * 0.8 * Math.cos(p3) - 0.0034 * 0.35 * Math.cos(q1);
  CURL.x = dpdy * 380;
  CURL.y = -dpdx * 380;
  return CURL;
}

interface Pulse { x: number; y: number; t0: number }

export function createField(canvas: HTMLCanvasElement, opts: FieldOptions = {}): FieldHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { setMode() {}, setTheme() {}, destroy() {} };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mode: FieldMode = opts.mode ?? "orbit";
  let theme: FieldTheme = opts.theme ?? "dark";

  let W = 0, H = 0, DPR = 1;
  let t = 0, lastTs = 0, raf = 0, intensity = 1;
  const ptr = { x: 0, y: 0, vx: 0, vy: 0, active: false, last: -1e9 };
  const focus = { x: 0, y: 0, s: 0 };
  let scrollV = 0, lastScroll = window.scrollY, scrollPhase = 0;
  const pulses: Pulse[] = [];

  // particles (orbit, streams)
  let N = 0;
  let X = new Float32Array(0), Y = new Float32Array(0), VX = new Float32Array(0), VY = new Float32Array(0);
  let PX = new Float32Array(0), PY = new Float32Array(0), L = new Float32Array(0);
  let S = new Uint8Array(0), K = new Uint8Array(0), B = new Uint8Array(0);
  // lattice
  let G = 0, gStep = 28;
  let GX = new Float32Array(0), GY = new Float32Array(0), GA = new Float32Array(0);
  let DX = new Float32Array(0), DY = new Float32Array(0), LEN = new Float32Array(0);

  const ringRadius = () => clamp(Math.min(W, H) * 0.17, 90, 180);

  function spawn(i: number) {
    X[i] = PX[i] = Math.random() * W;
    Y[i] = PY[i] = Math.random() * H;
    VX[i] = VY[i] = 0;
    S[i] = Math.random() < 0.88 ? 0 : 1;
    K[i] = Math.random() < 0.62 ? 0 : 1;
    L[i] = 80 + Math.random() * 220;
  }

  function setup() {
    ctx!.clearRect(0, 0, W, H);
    const area = W * H;
    if (mode === "lattice") {
      gStep = W < 640 ? 22 : 28;
      const cols = Math.ceil(W / gStep) + 2;
      const rows = Math.ceil(H / gStep) + 3;
      G = cols * rows;
      GX = new Float32Array(G); GY = new Float32Array(G); GA = new Float32Array(G);
      DX = new Float32Array(G); DY = new Float32Array(G); LEN = new Float32Array(G);
      B = new Uint8Array(G); K = new Uint8Array(G);
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          GX[i] = (c - 0.5) * gStep + (r % 2 ? gStep * 0.5 : 0);
          GY[i] = (r - 1) * gStep;
          GA[i] = flow(GX[i] * 0.8, GY[i] * 0.8, 0) * 0.9;
        }
      }
    } else {
      const cap = mode === "streams" ? 1500 : 2000;
      N = Math.round(Math.min(area / (mode === "streams" ? 1250 : 1500), cap));
      X = new Float32Array(N); Y = new Float32Array(N);
      VX = new Float32Array(N); VY = new Float32Array(N);
      PX = new Float32Array(N); PY = new Float32Array(N);
      L = new Float32Array(N);
      S = new Uint8Array(N); K = new Uint8Array(N); B = new Uint8Array(N);
      for (let i = 0; i < N; i++) spawn(i);
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!focus.x) { focus.x = W * 0.5; focus.y = H * 0.45; }
    setup();
    if (reduceMotion) drawStill();
  }

  function updateFocus(dt: number) {
    const now = performance.now();
    const idle = !ptr.active || now - ptr.last > 3500;
    let tx: number, ty: number, ts: number;
    if (idle) {
      tx = W * (0.5 + 0.32 * Math.sin(t * 0.093));
      ty = H * (0.48 + 0.22 * Math.sin(t * 0.141 + 1.2));
      ts = 0.35;
    } else {
      tx = ptr.x; ty = ptr.y; ts = 1;
    }
    const k = 1 - Math.pow(1 - (idle ? 0.012 : 0.16), dt);
    focus.x += (tx - focus.x) * k;
    focus.y += (ty - focus.y) * k;
    focus.s += (ts - focus.s) * (1 - Math.pow(0.97, dt));
    const decay = Math.pow(0.86, dt);
    ptr.vx *= decay; ptr.vy *= decay;
  }

  function strokeBuckets(count: number, kind: number, col: string, path: (i: number) => void) {
    for (let b = 0; b < BUCKETS; b++) {
      let any = false;
      ctx!.beginPath();
      for (let i = 0; i < count; i++) {
        if (B[i] !== b || K[i] !== kind) continue;
        path(i);
        any = true;
      }
      if (any) {
        ctx!.strokeStyle = `rgba(${col},${((b + 0.5) / BUCKETS).toFixed(3)})`;
        ctx!.stroke();
      }
    }
  }

  // ---------- orbit ----------
  function stepOrbit(dt: number) {
    const R = ringRadius() * (1 + 0.07 * Math.sin(t * 1.3));
    const infl = R * 2.8, infl2 = infl * infl;
    const damp = Math.pow(0.935, dt);
    for (let i = 0; i < N; i++) {
      let x = X[i], y = Y[i];
      const f = curl(x, y, t);
      let ax = f.x * 0.032;
      let ay = f.y * 0.032 - scrollV * 0.003;
      const dx = focus.x - x, dy = focus.y - y, d2 = dx * dx + dy * dy;
      let w = 0;
      if (d2 < infl2) {
        const d = Math.sqrt(d2) + 1e-3, nx = dx / d, ny = dy / d;
        w = 1 - d / infl;
        w = w * w * focus.s;
        const ang = Math.atan2(-ny, -nx);
        const band = ((i * 0.6180339) % 1) - 0.5;
        const r = R * (1 + band * 0.55 + 0.14 * Math.sin(ang * 3 - t * 0.9) + 0.05 * Math.sin(ang * 5 + t * 1.7));
        const pull = (d - r) * 0.005 * w;
        ax += nx * pull; ay += ny * pull;
        const sw = 0.28 * w;
        ax += -ny * sw; ay += nx * sw;
        ax += ptr.vx * 0.01 * w; ay += ptr.vy * 0.01 * w;
      }
      VX[i] = (VX[i] + ax * dt) * damp;
      VY[i] = (VY[i] + ay * dt) * damp;
      x += VX[i] * dt; y += VY[i] * dt;
      if (x < -10) x += W + 20; else if (x > W + 10) x -= W + 20;
      if (y < -10) y += H + 20; else if (y > H + 10) y -= H + 20;
      X[i] = x; Y[i] = y;
      const sp = Math.abs(VX[i]) + Math.abs(VY[i]);
      const alpha = ((K[i] === 0 ? 0.15 : 0.08) + w * 0.5 + Math.min(sp * 0.02, 0.08)) * intensity;
      B[i] = Math.min(BUCKETS - 1, (alpha * BUCKETS) | 0);
    }
  }

  function drawOrbit() {
    ctx!.clearRect(0, 0, W, H);
    ctx!.lineCap = "butt";
    for (let k = 0; k < 2; k++) {
      const col = k === 0 ? ACCENT : INK[theme];
      for (let s = 0; s < 2; s++) {
        const lw = s === 0 ? 2 : 3.4;
        ctx!.lineWidth = lw;
        for (let b = 0; b < BUCKETS; b++) {
          let any = false;
          ctx!.beginPath();
          for (let i = 0; i < N; i++) {
            if (B[i] !== b || K[i] !== k || S[i] !== s) continue;
            const vx = VX[i], vy = VY[i];
            const sp = Math.sqrt(vx * vx + vy * vy);
            const len = Math.max(lw, sp * 1.8);
            let ux = 1, uy = 0;
            if (sp > 0.05) { ux = vx / sp; uy = vy / sp; }
            const hx = ux * len * 0.5, hy = uy * len * 0.5;
            ctx!.moveTo(X[i] - hx, Y[i] - hy);
            ctx!.lineTo(X[i] + hx, Y[i] + hy);
            any = true;
          }
          if (any) {
            ctx!.strokeStyle = `rgba(${col},${((b + 0.5) / BUCKETS).toFixed(3)})`;
            ctx!.stroke();
          }
        }
      }
    }
  }

  // ---------- streams ----------
  function stepStreams(dt: number) {
    ctx!.globalCompositeOperation = "destination-out";
    ctx!.fillStyle = `rgba(0,0,0,${Math.min(0.085 * dt, 0.5)})`;
    ctx!.fillRect(0, 0, W, H);
    ctx!.globalCompositeOperation = "source-over";
    const R = ringRadius();
    const infl = R * 3, infl2 = infl * infl;
    for (let i = 0; i < N; i++) {
      const ox = X[i], oy = Y[i];
      const f = curl(ox, oy, t * 0.8);
      let vx = f.x * 1.25;
      let vy = f.y * 1.25 - scrollV * 0.04;
      const dx = focus.x - ox, dy = focus.y - oy, d2 = dx * dx + dy * dy;
      let w = 0;
      if (d2 < infl2) {
        const d = Math.sqrt(d2) + 1e-3, nx = dx / d, ny = dy / d;
        if (d < 14) { spawn(i); B[i] = 255; continue; }
        w = 1 - d / infl;
        w = w * w * focus.s;
        vx += (-ny * 3.4 + nx * 0.8) * w;
        vy += (nx * 3.4 + ny * 0.8) * w;
      }
      VX[i] += (vx - VX[i]) * 0.25;
      VY[i] += (vy - VY[i]) * 0.25;
      const x = ox + VX[i] * dt, y = oy + VY[i] * dt;
      L[i] -= dt;
      if (L[i] <= 0 || x < -20 || x > W + 20 || y < -20 || y > H + 20) {
        spawn(i); B[i] = 255; continue;
      }
      PX[i] = ox; PY[i] = oy; X[i] = x; Y[i] = y;
      K[i] = w > 0.05 ? 0 : 1;
      const life = Math.min(1, L[i] / 40);
      const alpha = (K[i] === 0 ? 0.3 + w * 0.7 : 0.09) * life * intensity;
      B[i] = Math.min(BUCKETS - 1, (alpha * BUCKETS) | 0);
    }
    ctx!.lineWidth = 1.3;
    ctx!.lineCap = "round";
    for (let k = 0; k < 2; k++) {
      strokeBuckets(N, k, k === 0 ? ACCENT : INK[theme], (i) => {
        ctx!.moveTo(PX[i], PY[i]);
        ctx!.lineTo(X[i], Y[i]);
      });
    }
  }

  // ---------- lattice ----------
  function stepLattice(dt: number) {
    const R = ringRadius() * 0.95 * (1 + 0.06 * Math.sin(t * 1.2));
    const infl = R * 3.2;
    const yOff = -((window.scrollY * 0.25) % gStep);
    scrollPhase += scrollV * 0.004;
    const ease = 1 - Math.pow(0.86, dt);
    for (let i = 0; i < G; i++) {
      const x = GX[i], y = GY[i] + yOff;
      const amb = flow(x * 0.8, y * 0.8, t * 0.5) * 0.9;
      const wv = Math.sin((x * 0.7 + y) * 0.008 - t * 0.9 + scrollPhase);
      const crest = wv > 0 ? wv * wv * wv : 0;
      const dx = x - focus.x, dy = y - focus.y;
      const d = Math.sqrt(dx * dx + dy * dy) + 1e-3;
      let align = 0, halo = 0;
      if (d < infl) {
        align = 1 - d / infl;
        align = align * align * focus.s;
        const q = (d - R) / (R * 0.55);
        halo = Math.exp(-q * q) * focus.s;
      }
      let pul = 0;
      for (let p = 0; p < pulses.length; p++) {
        const P = pulses[p], age = t - P.t0;
        const q2 = (Math.hypot(x - P.x, y - P.y) - age * 520) / 38;
        pul += Math.exp(-q2 * q2) * Math.max(0, 1 - age / 1.4);
      }
      const tang = Math.atan2(dy, dx) + Math.PI / 2 + 0.25;
      const target = amb + angDiff(tang, amb) * Math.min(1, align * 2.2);
      GA[i] += angDiff(target, GA[i]) * ease;
      const push = halo * 10;
      DX[i] = x + (dx / d) * push;
      DY[i] = y + (dy / d) * push;
      LEN[i] = 2.2 + crest * 4.5 + halo * 13 + pul * 10;
      const alpha = (0.08 + crest * 0.2 + halo * 0.8 + pul * 0.6) * intensity;
      K[i] = halo + pul > 0.18 ? 0 : 1;
      B[i] = Math.min(BUCKETS - 1, (alpha * BUCKETS) | 0);
    }
  }

  function drawLattice() {
    ctx!.clearRect(0, 0, W, H);
    ctx!.lineCap = "butt";
    for (let k = 0; k < 2; k++) {
      ctx!.lineWidth = k === 0 ? 2 : 1.6;
      strokeBuckets(G, k, k === 0 ? ACCENT : INK[theme], (i) => {
        const h = LEN[i] * 0.5, c = Math.cos(GA[i]) * h, s = Math.sin(GA[i]) * h;
        ctx!.moveTo(DX[i] - c, DY[i] - s);
        ctx!.lineTo(DX[i] + c, DY[i] + s);
      });
    }
  }

  function step(dt: number) {
    if (mode === "lattice") { stepLattice(dt); drawLattice(); }
    else if (mode === "streams") stepStreams(dt);
    else { stepOrbit(dt); drawOrbit(); }
  }

  function drawStill() {
    focus.s = 0.6;
    intensity = theme === "light" ? 1.25 : 1;
    if (mode === "streams") { for (let i = 0; i < 40; i++) stepStreams(1); }
    else step(1);
  }

  function frame(ts: number) {
    raf = requestAnimationFrame(frame);
    const dt = lastTs ? Math.min((ts - lastTs) / 16.667, 3) : 1;
    lastTs = ts;
    t += dt / 60;
    const sy = window.scrollY;
    scrollV += clamp(sy - lastScroll, -40, 40);
    lastScroll = sy;
    scrollV *= Math.pow(0.88, dt);
    intensity = (1 - Math.min(1, sy / H) * 0.55) * (theme === "light" ? 1.25 : 1);
    updateFocus(dt);
    step(dt);
    for (let p = pulses.length - 1; p >= 0; p--) if (t - pulses[p].t0 > 1.5) pulses.splice(p, 1);
  }

  function pulse(x: number, y: number) {
    pulses.push({ x, y, t0: t });
    if (mode === "lattice") return;
    const r = 320;
    for (let i = 0; i < N; i++) {
      const dx = X[i] - x, dy = Y[i] - y, d = Math.sqrt(dx * dx + dy * dy) + 1e-3;
      if (d < r) {
        const f = (1 - d / r) * (mode === "streams" ? 4 : 6);
        VX[i] += (dx / d) * f; VY[i] += (dy / d) * f;
      }
    }
  }

  const onMove = (e: PointerEvent) => {
    if (ptr.active) {
      ptr.vx = ptr.vx * 0.6 + (e.clientX - ptr.x) * 0.4;
      ptr.vy = ptr.vy * 0.6 + (e.clientY - ptr.y) * 0.4;
    }
    ptr.x = e.clientX; ptr.y = e.clientY;
    ptr.active = true; ptr.last = performance.now();
  };
  const onLeave = () => { ptr.active = false; };
  const onDown = (e: PointerEvent) => {
    onMove(e);
    const el = e.target as Element | null;
    if (el?.closest?.("a,button,input,select,textarea,label,[role=button],[role=tab]")) return;
    pulse(e.clientX, e.clientY);
  };
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);
  window.addEventListener("resize", onResize);
  resize();
  if (!reduceMotion) raf = requestAnimationFrame(frame);

  return {
    setMode(next) {
      if (next === mode) return;
      mode = next;
      setup();
      if (reduceMotion) drawStill();
    },
    setTheme(next) {
      theme = next === "light" ? "light" : "dark";
      if (reduceMotion) drawStill();
    },
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("resize", onResize);
    },
  };
}

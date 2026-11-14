import type { ComponentType, ReactNode } from "react";

/*
  Vector card covers. Inline SVG so they follow the light/dark theme through Tailwind
  color classes and stay crisp at any size. Every cover shares one frame (grid, orange
  mark, title, tag); each project adds a small line drawing on the right.
  Keep drawings inside x ≥ 320 and y ≤ 260 so they never collide with the title.
*/

const W = 640;
const H = 360;
const LINE = "fill-none stroke-foreground/35";
const ACCENT = "fill-none stroke-primary";
const MONO = { font: "500 10px var(--font-geist-mono), ui-monospace, monospace", letterSpacing: "0.08em" };

const range = (from: number, to: number, step: number) => {
  const out: number[] = [];
  for (let v = from; v < to; v += step) out.push(v);
  return out;
};

/** Fine grid drawn behind every cover, in CSS so it fills boxes of any shape. */
export const COVER_GRID = {
  backgroundImage:
    "linear-gradient(color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), " +
    "linear-gradient(90deg, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

function Frame({ title, tag, children }: { title: string; tag: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 bg-muted" style={COVER_GRID}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${title}: ${tag}`}
        className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
      >
      {children}
      <rect x={36} y={36} width={10} height={10} className="fill-primary" />
      <text
        x={36}
        y={304}
        className="fill-foreground"
        style={{ font: "600 40px var(--font-geist-sans), ui-sans-serif, sans-serif", letterSpacing: "-0.04em" }}
      >
        {title}
      </text>
      <text
        x={37}
        y={330}
        className="fill-muted-foreground"
        style={{ font: "500 12px var(--font-geist-mono), ui-monospace, monospace", letterSpacing: "0.14em" }}
      >
        {tag.toUpperCase()}
      </text>
      </svg>
    </div>
  );
}

/* Polytrades: a lighting-plan fragment with counted fixtures, a fence and a measured run. */
function PolytradesArt() {
  const fixtures: [number, number, boolean][] = [
    [372, 92, true], [408, 92, true], [372, 132, true], [408, 132, false],
    [372, 178, false], [408, 178, true], [476, 92, false], [556, 92, false],
    [476, 192, false], [556, 192, false],
  ];
  return (
    <Frame title="Polytrades" tag="Bid intake · Electrical takeoff">
      <rect x={340} y={58} width={250} height={168} className={LINE} strokeWidth={2} />
      <path d="M440 58 V150 H520 M520 150 V226" className={LINE} strokeWidth={2} />
      <rect x={352} y={72} width={76} height={128} className={ACCENT} strokeWidth={1.5} strokeDasharray="5 4" />
      {fixtures.map(([x, y, counted]) => (
        <g key={`${x}-${y}`} className={counted ? ACCENT : LINE} strokeWidth={1.5}>
          <circle cx={x} cy={y} r={7} />
          <path d={`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}`} />
        </g>
      ))}
      <rect x={530} y={164} width={52} height={18} className="fill-primary/15 stroke-primary" strokeWidth={1} />
      <text x={538} y={177} className="fill-primary" style={MONO}>L2A 9</text>
      <path d="M340 244 H590 M340 238 V250 M590 238 V250" className={LINE} strokeWidth={1.5} />
      <text x={445} y={262} className="fill-muted-foreground" style={MONO}>80.2 FT</text>
    </Frame>
  );
}

/* Wheatland Health: a week of home visits and the route that links them. */
function WheatlandArt() {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const visits: [number, number, number, boolean][] = [
    [0, 82, 34, false], [0, 128, 22, false], [1, 96, 40, false], [2, 80, 26, true],
    [2, 118, 30, false], [3, 90, 22, false], [3, 124, 36, false], [4, 84, 44, false],
  ];
  return (
    <Frame title="Wheatland Health" tag="Home health operations">
      {days.map((d, i) => (
        <g key={d}>
          <text x={342 + i * 52} y={66} className="fill-muted-foreground" style={MONO}>{d}</text>
          <line x1={338 + i * 52} y1={74} x2={338 + i * 52} y2={176} className={LINE} strokeWidth={1} />
        </g>
      ))}
      <line x1={598} y1={74} x2={598} y2={176} className={LINE} strokeWidth={1} />
      {visits.map(([col, y, h, accent]) => (
        <rect
          key={`${col}-${y}`}
          x={342 + col * 52}
          y={y}
          width={44}
          height={h}
          className={accent ? "fill-primary/80" : "fill-foreground/10 stroke-foreground/30"}
          strokeWidth={1}
        />
      ))}
      <polyline points="356,236 430,212 502,240 580,214" className={LINE} strokeWidth={1.5} strokeDasharray="4 4" />
      {[[356, 236], [430, 212], [502, 240]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={5} className="fill-foreground/50" />
      ))}
      <rect x={575} y={209} width={10} height={10} className="fill-primary" />
    </Frame>
  );
}

/* MedBid: providers bidding on one care request; the best bid wins. */
function MedBidArt() {
  const bids: [string, number, boolean][] = [
    ["PROVIDER A", 150, false],
    ["PROVIDER B", 124, false],
    ["PROVIDER C", 92, true],
    ["PROVIDER D", 136, false],
  ];
  return (
    <Frame title="MedBid" tag="Care marketplace">
      <text x={340} y={66} className="fill-muted-foreground" style={MONO}>CARE REQUEST · 4 BIDS</text>
      <line x1={340} y1={76} x2={600} y2={76} className={LINE} strokeWidth={1} />
      {bids.map(([label, len, best], i) => {
        const y = 102 + i * 36;
        return (
          <g key={label}>
            <text x={340} y={y + 4} className={best ? "fill-primary" : "fill-muted-foreground"} style={MONO}>{label}</text>
            <rect x={440} y={y - 5} width={len} height={10} className={best ? "fill-primary" : "fill-foreground/20"} />
            {best && (
              <path d={`M${448 + len} ${y} l5 5 l9 -10`} className={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            )}
          </g>
        );
      })}
      <g className={LINE} strokeWidth={1.5}>
        <rect x={340} y={236} width={18} height={14} />
        <path d="M344 236 v-5 a5 5 0 0 1 10 0 v5" />
      </g>
      <text x={366} y={247} className="fill-muted-foreground" style={MONO}>ESCROW</text>
    </Frame>
  );
}

/* Hearsona: a text prompt becomes a waveform, refined with parameters. */
const WAVE = range(0, 42, 1).map((i) => {
  const env = Math.sin((Math.PI * (i + 0.5)) / 42);
  const h = (0.3 + 0.7 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37))) * env * 62 + 4;
  return { x: 344 + i * 6, h: Math.round(h * 10) / 10 };
});

function HearsonaArt() {
  const sliders: [string, number][] = [["PITCH", 0.62], ["LENGTH", 0.35], ["TIMBRE", 0.8]];
  return (
    <Frame title="Hearsona" tag="Text to personalized audio">
      <rect x={340} y={52} width={252} height={30} className={LINE} strokeWidth={1.5} />
      <text x={352} y={71} className="fill-foreground/70" style={MONO}>&quot;WARM CHIME, RISING&quot;</text>
      <path d="M466 88 V104 M461 99 l5 5 l5 -5" className={LINE} strokeWidth={1.5} />
      {WAVE.map(({ x, h }) => (
        <line
          key={x}
          x1={x}
          y1={146 - h / 2}
          x2={x}
          y2={146 + h / 2}
          className={x >= 428 && x <= 500 ? "stroke-primary" : "stroke-foreground/40"}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
      {sliders.map(([label, v], i) => {
        const y = 202 + i * 20;
        return (
          <g key={label}>
            <text x={340} y={y + 4} className="fill-muted-foreground" style={MONO}>{label}</text>
            <line x1={410} y1={y} x2={592} y2={y} className="stroke-foreground/25" strokeWidth={2} />
            <rect x={410 + v * 182 - 5} y={y - 5} width={10} height={10} className="fill-primary" />
          </g>
        );
      })}
    </Frame>
  );
}

/* O-VR Hear Space: a sound source rippling across a perspective floor toward the listener. */
const VP = { x: 470, y: 40 };
const FLOOR_TOP = 110;
const FLOOR_BOTTOM = 250;
const toTop = (bx: number) => bx + (VP.x - bx) * ((FLOOR_BOTTOM - FLOOR_TOP) / (FLOOR_BOTTOM - VP.y));
const FLOOR_X = range(0, 9, 1).map((i) => 330 + i * 35);
const FLOOR_Y = [250, 204, 172, 148, 130, 118, 110];

function OVRArt() {
  const left = FLOOR_X[0];
  const right = FLOOR_X[FLOOR_X.length - 1];
  const edgeAt = (bx: number, y: number) => bx + (VP.x - bx) * ((FLOOR_BOTTOM - y) / (FLOOR_BOTTOM - VP.y));
  return (
    <Frame title="O-VR Hear Space" tag="Spatial audio in VR">
      <g className="stroke-foreground/25" strokeWidth={1}>
        {FLOOR_X.map((bx) => (
          <line key={bx} x1={bx} y1={FLOOR_BOTTOM} x2={toTop(bx)} y2={FLOOR_TOP} />
        ))}
        {FLOOR_Y.map((y) => (
          <line key={y} x1={edgeAt(left, y)} y1={y} x2={edgeAt(right, y)} y2={y} />
        ))}
      </g>
      {[22, 42, 62].map((rx, i) => (
        <ellipse
          key={rx}
          cx={528}
          cy={168}
          rx={rx}
          ry={rx * 0.36}
          className="fill-none stroke-primary"
          strokeOpacity={1 - i * 0.3}
          strokeWidth={1.5}
        />
      ))}
      <rect x={523} y={163} width={10} height={10} className="fill-primary" />
      <text x={510} y={146} className="fill-primary" style={MONO}>SOURCE</text>
      <line x1={404} y1={220} x2={520} y2={172} className={LINE} strokeWidth={1.5} strokeDasharray="4 4" />
      <circle cx={398} cy={222} r={7} className="fill-foreground/60" />
      <text x={360} y={246} className="fill-muted-foreground" style={MONO}>LISTENER</text>
    </Frame>
  );
}

/* Lexson: stock levels with a low-stock flag, and the invoice they feed. */
function LexsonArt() {
  const rows: [string, number, boolean][] = [
    ["SKU 0142", 0.82, false],
    ["SKU 0187", 0.56, false],
    ["SKU 0203", 0.14, true],
    ["SKU 0219", 0.7, false],
    ["SKU 0251", 0.44, false],
  ];
  const receipt = "M540 56 H600 V220 l-7.5 8 l-7.5 -8 l-7.5 8 l-7.5 -8 l-7.5 8 l-7.5 -8 l-7.5 8 l-7.5 -8 V56 Z";
  return (
    <Frame title="Lexson" tag="Inventory · Billing">
      {rows.map(([sku, level, low], i) => {
        const y = 74 + i * 30;
        return (
          <g key={sku}>
            <text x={340} y={y + 4} className={low ? "fill-primary" : "fill-muted-foreground"} style={MONO}>{sku}</text>
            <rect x={412} y={y - 4} width={104} height={8} className="fill-none stroke-foreground/30" strokeWidth={1} />
            <rect x={412} y={y - 4} width={104 * level} height={8} className={low ? "fill-primary" : "fill-foreground/35"} />
          </g>
        );
      })}
      <path d={receipt} className={LINE} strokeWidth={1.5} />
      {[78, 96, 114, 132, 150].map((y, i) => (
        <line key={y} x1={550} y1={y} x2={i % 2 ? 578 : 590} y2={y} className="stroke-foreground/30" strokeWidth={2} />
      ))}
      <line x1={550} y1={182} x2={590} y2={182} className="stroke-primary" strokeWidth={3} />
    </Frame>
  );
}

/** Cover art by project slug. Projects without an entry fall back to their image or a typographic cover. */
export const projectArt: Record<string, ComponentType> = {
  polytrades: PolytradesArt,
  "wheatland-health": WheatlandArt,
  medbid: MedBidArt,
  hearsona: HearsonaArt,
  "o-vr-hear-space": OVRArt,
  lexson: LexsonArt,
};

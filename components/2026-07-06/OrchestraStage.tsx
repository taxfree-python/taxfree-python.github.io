import { instrumentMeta, FAMILY_COLOR, type Family } from './instruments';
import type { Positions } from './types';

/** Text colour drawn on top of each family dot, chosen for contrast. */
const FAMILY_TEXT: Record<Family, string> = {
  strings: '#ffffff',
  woodwinds: '#ffffff',
  brass: '#222222',
  percussion: '#222222',
};

const VIEW = 320;
const PAD = 30; // px margin so edge dots + labels never clip
const DOT_R = 15;

export type Bounds = { minX: number; maxX: number; minY: number; maxY: number };

/** Metric coords relative to listener at (0,0): front (az 0) is +y up, +az is left (−x). */
function toMetric(az: number, r: number): { xm: number; ym: number } {
  const rad = (az * Math.PI) / 180;
  return { xm: -r * Math.sin(rad), ym: r * Math.cos(rad) };
}

/** Raw bounding box over one or more layouts (listener origin included, no padding). */
export function boundsOf(list: Positions[]): Bounds {
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  for (const pos of list) {
    for (const code of Object.keys(pos)) {
      const { xm, ym } = toMetric(pos[code]!.az, pos[code]!.r);
      minX = Math.min(minX, xm);
      maxX = Math.max(maxX, xm);
      minY = Math.min(minY, ym);
      maxY = Math.max(maxY, ym);
    }
  }
  return { minX, maxX, minY, maxY };
}

type Props = {
  positions: Positions;
  /** Fixed bounds keep the scale stable across animated frames. Omit to auto-fit. */
  bounds?: Bounds;
};

export default function OrchestraStage({ positions, bounds }: Props) {
  const codes = Object.keys(positions);
  const placed = codes.map((code) => ({ code, ...toMetric(positions[code]!.az, positions[code]!.r) }));

  const raw = bounds ?? boundsOf([positions]);
  const spanX = raw.maxX - raw.minX || 1;
  const spanY = raw.maxY - raw.minY || 1;
  const padM = 0.06 * Math.max(spanX, spanY);
  const minX = raw.minX - padM;
  const maxX = raw.maxX + padM;
  const minY = raw.minY - padM;
  const maxY = raw.maxY + padM;
  const bw = maxX - minX;
  const bh = maxY - minY;
  const scale = Math.min((VIEW - 2 * PAD) / bw, (VIEW - 2 * PAD) / bh);
  const ox = (VIEW - bw * scale) / 2;
  const oy = (VIEW - bh * scale) / 2;
  const toX = (xm: number) => ox + (xm - minX) * scale;
  const toY = (ym: number) => oy + (maxY - ym) * scale; // invert: up = +y

  const lx = toX(0);
  const ly = toY(0);

  return (
    <svg
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      style={{ width: '100%', height: 'auto', display: 'block', color: 'inherit' }}
      role="img"
      aria-label="オーケストラ配置の俯瞰図"
    >
      <text x={VIEW / 2} y={16} fontSize={11} textAnchor="middle" fill="currentColor" fillOpacity={0.5}>
        ↑ 正面
      </text>

      <circle cx={lx} cy={ly} r={6} fill="currentColor" fillOpacity={0.75} />
      <text x={lx} y={ly - 12} fontSize={10} textAnchor="middle" fill="currentColor" fillOpacity={0.5}>
        あなた
      </text>

      {placed.map((p) => {
        const meta = instrumentMeta(p.code);
        const x = toX(p.xm);
        const y = toY(p.ym);
        return (
          <g key={p.code}>
            <circle cx={x} cy={y} r={DOT_R} fill={FAMILY_COLOR[meta.family]} opacity={0.92} />
            <text
              x={x}
              y={y}
              fontSize={9}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="central"
              fill={FAMILY_TEXT[meta.family]}
              style={{ pointerEvents: 'none' }}
            >
              {meta.abbr}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

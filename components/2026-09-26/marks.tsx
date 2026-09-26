import type { CSSProperties } from 'react';
import { roleColors, type Role } from './palette';

export function svgStyle(mobile: boolean): CSSProperties {
  return { width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit', fontSize: mobile ? 11 : 13 };
}

/** Typographic minus, so negative tick labels line up with the prose. */
export const signed = (value: number, digits = 0) => (value < 0 ? `−${(-value).toFixed(digits)}` : value.toFixed(digits));

/**
 * One question's point. Q2 is the paraphrase of Q1's fact: same hue, lighter, and drawn as a
 * ring so it stays visible when it sits on Q1. No line style carries the distinction.
 */
export function QuestionMark({ role, cx, cy, r = 3.2, opacity }: { role: Role; cx: number; cy: number; r?: number; opacity?: number }) {
  return role === 'same_fact_b'
    ? <circle cx={cx} cy={cy} r={r - 0.6} fill="none" stroke={roleColors[role]} strokeWidth={1.3} opacity={opacity} />
    : <circle cx={cx} cy={cy} r={r} fill={roleColors[role]} opacity={opacity} />;
}

/**
 * Deterministic beeswarm: points in x order, each at the smallest vertical offset where it
 * overlaps no point placed so far.
 */
export function swarm(xs: number[], r: number): number[] {
  const order = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x || a.i - b.i);
  const placed: { x: number; y: number }[] = [];
  const out: number[] = [];
  const minDist = 2 * r + 0.3;
  for (const { x, i } of order) {
    for (let k = 0; ; k++) {
      const dy = (k % 2 === 1 ? 1 : -1) * Math.ceil(k / 2) * r * 0.8;
      if (placed.every(p => Math.abs(p.x - x) >= minDist || Math.hypot(p.x - x, p.y - dy) >= minDist)) {
        placed.push({ x, y: dy });
        out[i] = dy;
        break;
      }
    }
  }
  return out;
}

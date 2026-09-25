import type { CSSProperties } from 'react';
import { questionLabels, roleColors, roles, type Role } from './palette';

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

/** Draw order: Q3 first, then Q1, with the Q2 ring on top. */
export const drawOrder: Role[] = ['other_fact', 'same_fact_a', 'same_fact_b'];

/** A single legend row (two rows on mobile) naming the three questions. */
export function QuestionLegend({ x, y, mobile, line = false }: { x: number; y: number; mobile: boolean; line?: boolean }) {
  const charWidth = mobile ? 6 : 7;
  let cursor = x;
  return <g aria-hidden="true">
    {roles.map((role, index) => {
      const row = mobile && index === 2 ? 1 : 0;
      const left = row === 1 ? x : cursor;
      const top = y + row * 18;
      cursor = left + questionLabels[role].length * charWidth + 38;
      return <g key={role}>
        {line && <line x1={left - 2} x2={left + 14} y1={top} y2={top} stroke={roleColors[role]} strokeWidth={1.6} />}
        <QuestionMark role={role} cx={left + 6} cy={top} />
        <text x={left + 20} y={top} dominantBaseline="central" fill={roleColors[role]}>{questionLabels[role]}</text>
      </g>;
    })}
  </g>;
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

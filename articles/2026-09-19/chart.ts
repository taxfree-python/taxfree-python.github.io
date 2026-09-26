import type { CSSProperties } from 'react';
import { grey, neutral } from '@/lib/tokens';

/** Grayscale only: the article keeps every figure monochrome. */
export const chartColors = {
  ink: neutral.ink,
  muted: neutral.muted,
  barLight: '#d4d4d4',
  barDark: '#4d4d4d',
  grid: grey[800],
  axis: neutral.lineStrong,
  marker: neutral.text,
} as const;

export type Box = { left: number; right: number; top: number; bottom: number };
export type Inset = { left: number; right: number; top: number; bottom: number };

/** Plot rectangle in SVG user units, from the outer size and its margins. */
export function axes(width: number, height: number, inset: Inset): Box {
  return { left: inset.left, right: width - inset.right, top: inset.top, bottom: height - inset.bottom };
}

export function svgStyle(mobile: boolean): CSSProperties {
  return { width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit', fontSize: mobile ? 11 : 13 };
}

const niceSteps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 9, 10];

/** Smallest round number at or above `value`, for per-panel axis maxima. */
export function niceMax(value: number): number {
  if (!(value > 0)) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = niceSteps.find((candidate) => value <= candidate * magnitude) ?? 10;
  return step * magnitude;
}

/** `count + 1` evenly spaced tick values from 0 to `max`. */
export function ticksTo(max: number, count: number): number[] {
  return Array.from({ length: count + 1 }, (_, index) => (max * index) / count);
}

export function formatCount(value: number): string {
  return value.toLocaleString('en-US');
}

/** 0.8845 -> "88.5". Rounds the decimal value, not its binary approximation. */
export function formatPercent(ratio: number, digits = 1): string {
  return Number((ratio * 100).toPrecision(12)).toFixed(digits);
}

/** Rough advance width, enough to right-align a legend without measuring glyphs. */
export function approxTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.52;
}

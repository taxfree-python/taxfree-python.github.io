import type { CSSProperties } from 'react';
import { neutral } from '@/lib/tokens';

/** Grayscale only: the article keeps every figure monochrome. */
export const chartColors = {
  ink: neutral.ink,
  muted: neutral.muted,
  fill: neutral.ink,
  grid: neutral.line,
  axis: neutral.lineStrong,
  marker: neutral.text,
  /** The chance-level notch cut into a bar: the page background, so it reads by lightness alone. */
  notch: neutral.bg,
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

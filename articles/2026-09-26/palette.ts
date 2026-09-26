import { neutral } from '@/lib/tokens';

/**
 * The article's hues: three blues, two oranges and a gold. Every coloured mark picks one of
 * these; the greys are the site's (lib/tokens.ts).
 */
export const hues = {
  blue: '#88afbc',
  blueLight: '#b7d0d7',
  blueDeep: '#5f8fa6',
  orange: '#cf8a52',
  orangeLight: '#e0b48a',
  gold: '#c1ad7f',
} as const;

/** Colours shared by the card, the data figures and the schematics of 2026-09-26. */
export const palette = {
  ink: neutral.ink,
  muted: neutral.muted,
  rule: neutral.line,
  /** Grid lines of the data figures. */
  grid: neutral.line,
  state: hues.blue,
  /** The substituted run (P', span A') in the patching schematic: orange against the blue of P, kept apart from Q3's gold. */
  substitute: hues.orange,
} as const;

export const roles = ['same_fact_a', 'same_fact_b', 'other_fact'] as const;
export type Role = typeof roles[number];

export const roleColors: Record<Role, string> = {
  same_fact_a: hues.blue,
  same_fact_b: hues.blueLight,
  other_fact: hues.gold,
};

/** Question names shared by the schematics and the data figures. */
export const questionLabels: Record<Role, string> = {
  same_fact_a: 'Q1 · same fact',
  same_fact_b: 'Q2 · paraphrase',
  other_fact: 'Q3 · other fact',
};

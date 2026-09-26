/** Colours shared by the card, the data figures and the schematics of 2026-09-26. */
export const palette = {
  ink: '#deded8',
  muted: '#969991',
  rule: '#363934',
  /** Grid lines of the data figures. */
  grid: '#30342f',
  state: '#88afbc',
  /** The substituted run (P', span A') in the patching schematic: orange against the blue of P, kept apart from Q3's gold. */
  substitute: '#cf8a52',
} as const;

export const roles = ['same_fact_a', 'same_fact_b', 'other_fact'] as const;
export type Role = typeof roles[number];

export const roleColors: Record<Role, string> = {
  same_fact_a: '#88afbc',
  same_fact_b: '#b7d0d7',
  other_fact: '#c1ad7f',
};

/** Question names shared by the schematics and the data figures. */
export const questionLabels: Record<Role, string> = {
  same_fact_a: 'Q1 · same fact',
  same_fact_b: 'Q2 · paraphrase',
  other_fact: 'Q3 · other fact',
};

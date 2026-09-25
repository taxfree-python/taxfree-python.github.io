/** Colours shared by the card, the data figures and the schematics of 2026-09-14. */
export const palette = {
  ink: '#deded8',
  muted: '#969991',
  rule: '#363934',
  state: '#88afbc',
} as const;

export const roles = ['same_fact_a', 'same_fact_b', 'other_fact'] as const;
export type Role = typeof roles[number];

export const roleColors: Record<Role, string> = {
  same_fact_a: '#88afbc',
  same_fact_b: '#b7d0d7',
  other_fact: '#c1ad7f',
};

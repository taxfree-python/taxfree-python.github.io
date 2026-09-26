/**
 * The colours shared across the site. Shared code (app/, components/, lib/) may not spell a hex,
 * rgb() or rgba() literal outside this file (lib/color-literals.test.ts enforces it): the MUI theme
 * (lib/theme.ts) and the CSS custom properties (`--color-<group>-<name>`, see `colorCssVariables`)
 * read from here.
 *
 * Articles are not bound by this: each articles/<date>/ keeps its own palette, literals and all,
 * and imports a token from here only where its colour is one of these shared values. A hue moves
 * in here once shared code or a second article needs it.
 *
 * Near-duplicates are merged onto one role each: a hairline is `line` or `lineStrong`, a white
 * overlay behind text is `overlaySubtle`. Prefer an existing role over adding a grey a few steps
 * away from it.
 */

/** The dark greys of the page chrome, by role. Comments name the MUI palette slot each one fills. */
export const neutral = {
  /** background.default: the page. */
  bg: '#0d0d0d',
  /** background.paper. */
  surface: '#171717',
  /** text.primary. */
  text: '#f2f2f2',
  /** primary.main, grey.100. */
  ink: '#e0e0e0',
  /** primary.light, grey.50. */
  inkLight: '#f5f5f5',
  /** primary.dark. */
  inkDark: '#c2c2c2',
  /** secondary.main, grey.400. */
  accent: '#9e9e9e',
  /** secondary.light. */
  accentLight: '#bdbdbd',
  /** text.secondary. */
  muted: '#a8a8a8',
  /** secondary.dark, grey.500. */
  faint: '#7a7a7a',
  /** grey.700; card hover border, outlined chip border (and its hover). */
  lineStrong: '#3a3a3a',
  /** divider; figure grid lines and rules. */
  line: '#2a2a2a',
  /** action.active; outlined chip text. */
  active: '#d6d6d6',
  /** Contained primary button. */
  buttonBg: '#111111',
  buttonBgHover: '#1f1f1f',
  /** Border of an embedded PDF iframe (lib/remark-embed-pdf.ts). */
  embedBorder: '#ccc',
  /** Chip and text-button hover, code backgrounds in posts; theme.action has no slot at this alpha. */
  overlaySubtle: 'rgba(255, 255, 255, 0.05)',
  /** action.hover, action.disabledBackground, outlined button hover. */
  overlayHover: 'rgba(255, 255, 255, 0.08)',
  /** action.selected. */
  overlaySelected: 'rgba(255, 255, 255, 0.16)',
  /** action.focus. */
  overlayFocus: 'rgba(255, 255, 255, 0.2)',
  /** action.disabled. */
  overlayDisabled: 'rgba(255, 255, 255, 0.3)',
  /** Card background (surface at 30 %) and its hover (50 %). */
  surfaceGlass: 'rgba(23, 23, 23, 0.3)',
  surfaceGlassHover: 'rgba(23, 23, 23, 0.5)',
  /** Filled chip backgrounds. */
  chipPrimaryBg: 'rgba(229, 229, 229, 0.14)',
  chipSecondaryBg: 'rgba(158, 158, 158, 0.18)',
} as const;

/**
 * The grey ramp MUI exposes as palette.grey. Steps that coincide with a role above point at it;
 * steps nothing reads (200, 300, 600, 900) are left to MUI's defaults.
 */
export const grey = {
  50: neutral.inkLight,
  100: neutral.ink,
  400: neutral.accent,
  500: neutral.faint,
  700: neutral.lineStrong,
  800: '#262626',
} as const;

export const tokens = { neutral, grey } as const;

export type Tokens = typeof tokens;
export type NeutralToken = keyof typeof neutral;
export type GreyStep = keyof typeof grey;
export type Color = string;

const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * All tokens as CSS custom properties, e.g. `--color-neutral-line-strong` or `--color-grey-800`.
 * ThemeRegistry sets them on :root.
 */
export function colorCssVariables(): Record<`--color-${string}`, string> {
  const out: Record<`--color-${string}`, string> = {};
  const walk = (prefix: `--color-${string}`, node: object) => {
    for (const [key, value] of Object.entries(node)) {
      const name = `${prefix}-${kebab(key)}` as const;
      if (typeof value === 'string') out[name] = value;
      else walk(name, value as object);
    }
  };
  for (const [group, node] of Object.entries(tokens)) walk(`--color-${group}`, node);
  return out;
}

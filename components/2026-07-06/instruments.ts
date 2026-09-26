/** Score-style abbreviations and instrument families for the 13 sections. */

export type Family = 'strings' | 'woodwinds' | 'brass' | 'percussion';

type InstrumentMeta = {
  /** Score abbreviation shown on the diagram. */
  abbr: string;
  family: Family;
};

export const INSTRUMENTS: Record<string, InstrumentMeta> = {
  vn1: { abbr: 'Vn.1', family: 'strings' },
  vn2: { abbr: 'Vn.2', family: 'strings' },
  va: { abbr: 'Va.', family: 'strings' },
  vc: { abbr: 'Vc.', family: 'strings' },
  cb: { abbr: 'Cb.', family: 'strings' },
  fl: { abbr: 'Fl.', family: 'woodwinds' },
  ob: { abbr: 'Ob.', family: 'woodwinds' },
  cl: { abbr: 'Cl.', family: 'woodwinds' },
  fg: { abbr: 'Fg.', family: 'woodwinds' },
  hn: { abbr: 'Hn.', family: 'brass' },
  tpt: { abbr: 'Tpt.', family: 'brass' },
  tbn: { abbr: 'Tbn.', family: 'brass' },
  timp: { abbr: 'Timp.', family: 'percussion' },
};

/** Colourblind-safe (Okabe–Ito) hues, one per family. Legible on light and dark. */
export const FAMILY_COLOR: Record<Family, string> = {
  strings: '#0072B2',
  woodwinds: '#009E73',
  brass: '#E69F00',
  percussion: '#CC79A7',
};

export const FAMILY_LABEL: Record<Family, string> = {
  strings: '弦',
  woodwinds: '木管',
  brass: '金管',
  percussion: '打',
};

export function instrumentMeta(code: string): InstrumentMeta {
  return INSTRUMENTS[code] ?? { abbr: code, family: 'percussion' };
}

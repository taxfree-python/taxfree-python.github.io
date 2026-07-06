/** Polar position of one section, as stored in the optimizer output. */
export type SectionPosition = {
  /** Azimuth in degrees. 0 = front; positive = listener's left. */
  az: number;
  /** Distance from the listener, in metres. */
  r: number;
};

/** instrument code -> polar position */
export type Positions = Record<string, SectionPosition>;

export type StageMode = 'stage' | 'surround';

export type Layout = {
  id: string;
  label: string;
  mode: StageMode;
  /** Filename under /public/audio/orchestra/ */
  audio: string;
  description: string;
  positions: Positions;
};

export type EvolutionFrame = {
  /** 1-based improvement index */
  i: number;
  /** trial number at which this incumbent was found */
  n: number;
  /** [transparency (↑), balance dev dB (↓), 1 − IACC (↑)] */
  values: number[];
  positions?: Positions;
  pos?: Positions;
};

import raw from '@/content/data/2026-09-19/data.json';

export type JevConfidence = {
  correct: number;
  wrong: number;
};

export type JevBenchmark = {
  id: string;
  label: string;
  short: string;
  n: number;
  correct: number;
  accuracy: number;
  costUsd: number;
  chance: number;
  meanPromptTokens: number;
  /** Mean reported confidence, split by outcome. `null` where the model reports none. */
  confidence: JevConfidence | null;
  /** Ten bins over [0, 1] of the top-1 option probability. */
  topProbability: { correct: number[]; wrong: number[] };
};

export type JevSubtask = {
  id: string;
  n: number;
  correct: number;
  accuracy: number;
  chance: number;
};

export type JevClintox = {
  n: number;
  toxic: number;
  nonToxic: number;
  aucRoc: number;
  sensitivity: number;
  specificity: number;
  balancedAccuracy: number;
  /** Ten bins over [0, 1] of P(toxic). */
  pToxic: { toxic: number[]; nonToxic: number[] };
};

export type JevBenchData = {
  measuredAt: string;
  model: string;
  benchmarks: JevBenchmark[];
  seqqaSubtasks: JevSubtask[];
  clintox: JevClintox;
  totals: { questions: number; costUsd: number; meanPromptTokens: number };
};

/** Block names the article may embed as `{{< block name="…" >}}`. */
export const jevBlockNames = ['accuracy', 'probability', 'seqqa', 'clintox'] as const;

export type JevBlockName = (typeof jevBlockNames)[number];

export function isJevBlockName(name: string): name is JevBlockName {
  return (jevBlockNames as readonly string[]).includes(name);
}

export const jevBench = raw as JevBenchData;

/** Copy sorted by accuracy, best first — the JSON order is not load-bearing. */
export function byAccuracyDesc<T extends { accuracy: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => b.accuracy - a.accuracy);
}

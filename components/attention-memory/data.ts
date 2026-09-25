import tripletData from '@/content/data/attention-memory-triplets.json';
import type { FactTriplet } from './FactTriplets';

export const triplets = tripletData.triplets as FactTriplet[];

/** Every block content/posts/2026-09-14.md embeds, in reading order. */
export const blockNames = [
  'memory',
  'online-learning',
  'decay-functions',
  'triplets',
  'independent-questions',
  'triplet-loss',
  'write-intervention',
  'triplet-effect',
] as const;

export type BlockName = typeof blockNames[number];

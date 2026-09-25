import tripletData from '@/content/data/attention-memory-triplets.json';
import followupData from '@/content/data/attention-memory-followup.json';
import type { FactTriplet } from './FactTriplets';
import type { FollowupTriplet, LocalLossRow } from './Followup';

export const triplets = tripletData.triplets as FactTriplet[];

/** Built by scripts/attention-memory/build_followup_data.py; do not edit by hand. */
export const followup = followupData as unknown as { layers: number[]; localLoss: LocalLossRow[]; triplets: FollowupTriplet[] };

/** Every block content/posts/2026-09-14.md embeds, in reading order. */
export const blockNames = [
  'memory',
  'online-learning',
  'decay-functions',
  'triplets',
  'independent-questions',
  'local-loss',
  'passage-removal',
  'write-intervention',
  'write-layers',
] as const;

export type BlockName = typeof blockNames[number];

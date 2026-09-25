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
  'triplet-loss',
  'write-intervention',
  'triplet-effect',
] as const;

/**
 * Registered but not yet embedded: figures for the follow-up experiments. Move each name into
 * `blockNames` (at its place in reading order) once the markdown uses it.
 */
export const pendingBlockNames = ['local-loss', 'passage-removal', 'write-layers'] as const;

export type BlockName = typeof blockNames[number] | typeof pendingBlockNames[number];

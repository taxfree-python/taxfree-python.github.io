import tripletData from '@/content/data/attention-memory-triplets.json';
import cardData from '@/content/data/attention-memory-card.json';
import followupData from '@/content/data/attention-memory-followup.json';
import final31Data from '@/content/data/attention-memory-followup-final31.json';
import patchingData from '@/content/data/attention-memory-patching.json';
import type { FactTriplet, FactTripletCard } from './FactTriplets';
import type { FollowupTriplet, LocalLossRow } from './Followup';
import type { PatchingData } from './Patching';

/** The 10 hand-picked triplets used by FactTripletFigure's loss/effect plots (unused by
 * any block currently wired into content/posts/2026-09-14.md; kept for that figure's type). */
export const triplets = tripletData.triplets as FactTriplet[];

/** Built by scripts/attention-memory/build_card_data.py from the frozen v6 counterfactual
 * set; do not edit by hand. Backs the `triplets` block's FactTripletExamples card. */
export const cardTriplets = cardData.triplets as FactTripletCard[];

type WithSingleLayer = FollowupTriplet & { singleLayerA: NonNullable<FollowupTriplet['singleLayerA']> };

/** Built by scripts/attention-memory/build_followup_data.py (the earlier 10 triplets); do not edit
 * by hand. Backs `local-loss` and `write-layers`, which need the single-layer run. */
export const followup = followupData as unknown as { layers: number[]; localLoss: LocalLossRow[]; triplets: WithSingleLayer[] };

/**
 * Built by scripts/attention-memory/build_followup_data_final31.py from the frozen 31-triplet set;
 * do not edit by hand. Backs `passage-removal`. `layers`, `localLoss` and the triplets'
 * singleLayer* fields are null: that run was not done for this set.
 */
export const followup31 = final31Data as unknown as {
  singleLayerRun: boolean;
  layers: number[] | null;
  localLoss: LocalLossRow[] | null;
  triplets: FollowupTriplet[];
};

/** Built by scripts/attention-memory/build_patching_data.py; do not edit by hand. */
export const patching = patchingData as unknown as PatchingData;

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
  'patching-paths',
  'patching-layers',
] as const;

/** Registered but not embedded: the single-layer β=0 figure, superseded by per-layer path patching. */
export const unusedBlockNames = ['write-layers'] as const;

export type BlockName = typeof blockNames[number] | typeof unusedBlockNames[number];

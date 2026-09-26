import cardData from '@/content/data/attention-memory-card.json';
import final31Data from '@/content/data/attention-memory-followup-final31.json';
import patchingData from '@/content/data/attention-memory-patching.json';
import type { FactTripletCard } from './FactTriplets';
import type { FollowupTriplet, LocalLossRow } from './Followup';
import type { PatchingData } from './Patching';

/** Built by scripts/attention-memory/build_card_data.py from the frozen v6 counterfactual
 * set; do not edit by hand. Backs the `triplets` block's FactTripletExamples card. */
export const cardTriplets = cardData.triplets as FactTripletCard[];

/**
 * Built by scripts/attention-memory/build_followup_data_final31.py from the frozen 31-triplet set;
 * do not edit by hand. Backs `local-loss` and `passage-removal`. `layers` and `localLoss` come
 * from the single-layer run (`singleLayerRun`); they are null if the data was built without it.
 */
export const followup31 = final31Data as unknown as {
  singleLayerRun: boolean;
  layers: number[] | null;
  localLoss: LocalLossRow[] | null;
  triplets: FollowupTriplet[];
};

/** Built by scripts/attention-memory/build_patching_data.py; do not edit by hand. */
export const patching = patchingData as unknown as PatchingData;

/** Every block content/posts/2026-09-26.md embeds, in reading order. */
export const blockNames = [
  'memory',
  'online-learning',
  'decay-functions',
  'triplets',
  'independent-questions',
  'local-loss',
  'passage-removal',
  'write-intervention',
  'patching-schematic',
  'patching-paths',
  'patching-layers',
] as const;

export type BlockName = typeof blockNames[number];

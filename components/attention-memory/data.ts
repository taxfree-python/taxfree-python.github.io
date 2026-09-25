import tripletData from '@/content/data/attention-memory-triplets.json';
import cardData from '@/content/data/attention-memory-card.json';
import followupData from '@/content/data/attention-memory-followup.json';
import type { FactTriplet, FactTripletCard } from './FactTriplets';
import type { FollowupTriplet, LocalLossRow } from './Followup';

/** The 10 hand-picked triplets used by FactTripletFigure's loss/effect plots (unused by
 * any block currently wired into content/posts/2026-09-14.md; kept for that figure's type). */
export const triplets = tripletData.triplets as FactTriplet[];

/** Built by scripts/attention-memory/build_card_data.py from the frozen v6 counterfactual
 * set; do not edit by hand. Backs the `triplets` block's FactTripletExamples card. */
export const cardTriplets = cardData.triplets as FactTripletCard[];

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

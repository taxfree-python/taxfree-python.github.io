import { FactTripletExamples } from './FactTriplets';
import { DecayFunctionsFigure } from './DecayPlot';
import { IndependentQuestionsFigure, MemoryFigure, OnlineLearningFigure, WriteInterventionFigure } from './Diagrams';
import { LocalLossFigure, PassageRemovalFigure } from './Followup';
import { WriteLayersFigure } from './WriteLayers';
import { followup, triplets, type BlockName } from './data';
import type { ArticleBlocks } from '@/lib/article-blocks';

/** Blocks for content/posts/2026-09-14.md. */
export const blocks: Record<BlockName, ArticleBlocks[string]> = {
  memory: MemoryFigure,
  'online-learning': OnlineLearningFigure,
  'decay-functions': DecayFunctionsFigure,
  triplets: () => <FactTripletExamples triplets={triplets} />,
  'independent-questions': IndependentQuestionsFigure,
  'write-intervention': WriteInterventionFigure,
  'local-loss': () => <LocalLossFigure rows={followup.localLoss} />,
  'passage-removal': () => <PassageRemovalFigure triplets={followup.triplets} />,
  'write-layers': () => <WriteLayersFigure triplets={followup.triplets} />,
} satisfies ArticleBlocks;

import { FactTripletExamples } from './FactTriplets';
import { DecayFunctionsFigure } from './DecayPlot';
import { IndependentQuestionsFigure, MemoryFigure, OnlineLearningFigure, WriteInterventionFigure } from './Diagrams';
import { LocalLossFigure, PassageRemovalFigure } from './Followup';
import { WriteLayersFigure } from './WriteLayers';
import { PatchingPathsFigure } from './Patching';
import { cardTriplets, followup31, patching, type BlockName } from './data';
import type { ArticleBlocks } from '@/lib/article-blocks';

/** Blocks for content/posts/2026-09-14.md. */
export const blocks: Record<BlockName, ArticleBlocks[string]> = {
  memory: MemoryFigure,
  'online-learning': OnlineLearningFigure,
  'decay-functions': DecayFunctionsFigure,
  triplets: () => <FactTripletExamples triplets={cardTriplets} />,
  'independent-questions': IndependentQuestionsFigure,
  'write-intervention': WriteInterventionFigure,
  'local-loss': () => <LocalLossFigure rows={followup31.localLoss} />,
  'passage-removal': () => <PassageRemovalFigure triplets={followup31.triplets} />,
  'write-layers': () => <WriteLayersFigure triplets={followup31.triplets} />,
  'patching-paths': () => <PatchingPathsFigure data={patching} />,
} satisfies ArticleBlocks;

import { FactTripletExamples } from './FactTriplets';
import { DecayFunctionsFigure } from './DecayPlot';
import { IndependentQuestionsFigure, MemoryFigure, OnlineLearningFigure, PatchingSchematicFigure, WriteInterventionFigure } from './Diagrams';
import { LocalLossFigure, PassageRemovalFigure } from './Followup';
import { PatchingLayersFigure, PatchingPathsFigure } from './Patching';
import { cardTriplets, followup31, patching, type BlockName } from './data';
import type { ArticleBlocks } from '@/lib/article-blocks';

/** Blocks for content/posts/2026-09-26.md. */
export const blocks: Record<BlockName, ArticleBlocks[string]> = {
  memory: MemoryFigure,
  'online-learning': OnlineLearningFigure,
  'decay-functions': DecayFunctionsFigure,
  triplets: () => <FactTripletExamples triplets={cardTriplets} />,
  'independent-questions': IndependentQuestionsFigure,
  'write-intervention': WriteInterventionFigure,
  // The final 31 triplets (followup31 / final31 set).
  'local-loss': () => <LocalLossFigure rows={followup31.localLoss} />,
  'passage-removal': () => <PassageRemovalFigure triplets={followup31.triplets} />,
  'patching-schematic': PatchingSchematicFigure,
  'patching-paths': () => <PatchingPathsFigure data={patching} />,
  'patching-layers': () => <PatchingLayersFigure data={patching} />,
} satisfies ArticleBlocks;

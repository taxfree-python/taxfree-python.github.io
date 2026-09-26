import { FactTripletExamples } from './FactTriplets';
import { DecayFunctionsFigure } from './DecayPlot';
import { IndependentQuestionsFigure, MemoryFigure, OnlineLearningFigure, PatchingSchematicFigure, WriteInterventionFigure } from './Diagrams';
import { LocalLossFigure, PassageRemovalFigure } from './Followup';
import { WriteLayersFigure } from './WriteLayers';
import { PatchingLayersFigure, PatchingPathsFigure } from './Patching';
import { cardTriplets, followup, followup31, patching, type BlockName } from './data';
import type { ArticleBlocks } from '@/lib/article-blocks';

/** Blocks for content/posts/2026-09-14.md. */
export const blocks: Record<BlockName, ArticleBlocks[string]> = {
  memory: MemoryFigure,
  'online-learning': OnlineLearningFigure,
  'decay-functions': DecayFunctionsFigure,
  triplets: () => <FactTripletExamples triplets={cardTriplets} />,
  'independent-questions': IndependentQuestionsFigure,
  'write-intervention': WriteInterventionFigure,
  // The earlier 10 triplets: the final 31 have no single-layer run.
  'local-loss': () => <LocalLossFigure rows={followup31.localLoss ?? []} />,
  'passage-removal': () => <PassageRemovalFigure triplets={followup31.triplets} />,
  // Kept on the earlier 10 triplets until the article replaces it with patching-layers.
  'write-layers': () => <WriteLayersFigure triplets={followup.triplets} />,
  'patching-schematic': PatchingSchematicFigure,
  'patching-paths': () => <PatchingPathsFigure data={patching} />,
  'patching-layers': () => <PatchingLayersFigure data={patching} />,
} satisfies ArticleBlocks;

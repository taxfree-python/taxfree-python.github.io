import { FactTripletExamples, FactTripletFigure } from './FactTriplets';
import { DecayFunctionsFigure } from './DecayPlot';
import { IndependentQuestionsFigure, MemoryFigure, OnlineLearningFigure, WriteInterventionFigure } from './Diagrams';
import { triplets, type BlockName } from './data';
import type { ArticleBlocks } from '@/lib/article-blocks';

/** Blocks for content/posts/2026-09-14.md. */
export const blocks: Record<BlockName, ArticleBlocks[string]> = {
  memory: MemoryFigure,
  'online-learning': OnlineLearningFigure,
  'decay-functions': DecayFunctionsFigure,
  triplets: () => <FactTripletExamples triplets={triplets} />,
  'independent-questions': IndependentQuestionsFigure,
  'triplet-loss': () => <FactTripletFigure triplets={triplets} kind="loss" />,
  'write-intervention': WriteInterventionFigure,
  'triplet-effect': () => <FactTripletFigure triplets={triplets} kind="effect" />,
} satisfies ArticleBlocks;

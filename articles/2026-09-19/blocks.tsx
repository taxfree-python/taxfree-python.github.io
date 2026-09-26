import { AccuracyFigure } from './AccuracyFigure';
import type { JevBlockName } from './data';
import type { ArticleBlocks } from '@/lib/article-blocks';

/** Blocks for content/posts/2026-09-19.md. */
export const blocks: Record<JevBlockName, () => ReturnType<typeof AccuracyFigure>> = {
  accuracy: AccuracyFigure,
} satisfies ArticleBlocks;

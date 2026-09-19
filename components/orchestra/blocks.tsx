import OrchestraWidget from './OrchestraWidget';
import type { ArticleBlocks } from '@/lib/article-blocks';

/** Blocks for content/posts/2026-07-06-orchestra-layout-optimization.md. */
export const blocks: ArticleBlocks = {
  LayoutViewer: () => <OrchestraWidget name="LayoutViewer" />,
  EvolutionReplay: () => <OrchestraWidget name="EvolutionReplay" />,
  ABPlayer: () => <OrchestraWidget name="ABPlayer" />,
};

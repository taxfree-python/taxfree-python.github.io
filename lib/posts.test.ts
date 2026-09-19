import { describe, expect, it } from 'vitest';
import { getPost } from './posts';
import { createArticleBlockRegex } from './article-blocks';

describe('getPost', () => {
  it('renders the orchestra article through the generic block slot', async () => {
    const post = await getPost('2026-07-06-orchestra-layout-optimization');
    expect(post.contentHtml.match(/<div data-block="[^"]+"><\/div>/g)).toHaveLength(3);
    for (const name of ['LayoutViewer', 'EvolutionReplay', 'ABPlayer']) {
      expect(post.contentHtml).toContain(`<div data-block="${name}"></div>`);
    }
    expect(post.contentHtml).not.toContain('data-orchestra-widget');
    expect(post.contentHtml).not.toContain('{{');
    const used = [...post.contentHtml.matchAll(createArticleBlockRegex())].map((match) => match[1]!);
    expect(used.sort()).toEqual(['ABPlayer', 'EvolutionReplay', 'LayoutViewer']);
  });
});

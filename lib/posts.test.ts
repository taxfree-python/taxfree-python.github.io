import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPost, getPosts, getPostSlugs } from './posts';
import { createArticleBlockRegex } from './article-blocks';

afterEach(() => vi.unstubAllEnvs());

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

  it('routes drafts only in development and never lists them', () => {
    const draftSlug = '2023-08-29';

    vi.stubEnv('NODE_ENV', 'development');
    const devSlugs = getPostSlugs().map((post) => post.slug);
    const devListed = getPosts().map((post) => post.slug);

    vi.stubEnv('NODE_ENV', 'production');
    const prodSlugs = getPostSlugs().map((post) => post.slug);
    const prodListed = getPosts().map((post) => post.slug);

    expect(devSlugs).toContain(draftSlug);
    expect(prodSlugs).not.toContain(draftSlug);
    // Whatever is a draft today, the rule is the same: extra routes locally, never a listing.
    const drafts = devSlugs.filter((slug) => !prodSlugs.includes(slug));
    expect(drafts.length).toBeGreaterThan(0);
    for (const slug of drafts) {
      expect(devListed).not.toContain(slug);
      expect(prodListed).not.toContain(slug);
    }
    expect(devListed).toEqual(prodListed);
  });
});

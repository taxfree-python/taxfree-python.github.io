import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPost, getPosts, getPostSlugs } from './posts';

afterEach(() => vi.unstubAllEnvs());

describe('getPost', () => {
  it('wraps tables for scrolling and keeps their column alignment', async () => {
    const post = await getPost('2026-09-19');
    expect(post.contentHtml).toContain('<div class="article-table"><table>');
    // The GPQA-Diamond/MMLU-Pro table right-aligns its numeric columns with `---:`.
    expect(post.contentHtml).toContain('<th align="right">GPQA-Diamond</th>');
    expect(post.contentHtml).toContain('<td align="right">96.1</td>');
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

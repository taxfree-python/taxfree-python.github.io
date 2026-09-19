import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPost, getPosts, getPostSlugs } from './posts';
import { jevBlockNames } from '@/components/jev-bench/data';
import { createArticleBlockRegex } from './article-blocks';

afterEach(() => vi.unstubAllEnvs());
const slug = '2026-09-19';

describe('jev bench article integration', () => {
  it('renders only blocks the article registers, with escaped currency', async () => {
    const post = await getPost(slug);
    expect(post.draft).toBe(true);
    const used = [...post.contentHtml.matchAll(createArticleBlockRegex())].map((match) => match[1]!);
    expect(used).toEqual(['accuracy']);
    for (const name of used) expect(jevBlockNames as readonly string[]).toContain(name);
    expect(post.contentHtml).not.toContain('<img ');
    expect(post.contentHtml).toContain('$1.52 でした');
    expect(post.contentHtml.match(/class="katex"/g)).toHaveLength(3);
    expect(post.contentHtml.match(/<div class="article-table"><table>/g)).toHaveLength(2);
    const ids = [...post.contentHtml.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps the draft out of production routes and listings', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(getPostSlugs().some((post) => post.slug === slug)).toBe(false);
    expect(getPosts().some((post) => post.slug === slug)).toBe(false);
  });

  it('allows the draft URL in development, without putting it in the list', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(getPostSlugs().some((post) => post.slug === slug)).toBe(true);
    expect(getPosts().some((post) => post.slug === slug)).toBe(false);
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPost, getPosts, getPostSlugs } from './posts';
import { createArticleBlockRegex } from './article-blocks';
import { blockNames, followup, pendingBlockNames } from '@/components/attention-memory/data';
import followupJson from '@/content/data/attention-memory-followup.json';

afterEach(() => vi.unstubAllEnvs());
const slug = '2026-09-14';

describe('attention memory article integration', () => {
  it('embeds every figure as a registered block, in order', async () => {
    const post = await getPost(slug);
    const used = [...post.contentHtml.matchAll(createArticleBlockRegex())].map((match) => match[1]!);
    expect(used).toEqual([...blockNames]);
    expect(post.contentHtml).not.toContain('<picture');
    expect(post.contentHtml).not.toContain('<img ');
    expect(post.contentHtml).not.toContain('data-qa-');
    expect(post.contentHtml).not.toContain('{{');
  });

  it('numbers figure captions consecutively and centers every caption', async () => {
    const post = await getPost(slug);
    const figures = [...post.contentHtml.matchAll(/<p class="article-caption">図 (\d+)\./g)].map((match) => Number(match[1]));
    expect(figures).toEqual([1, 2, 3, 4, 5, 6, 7]);
    const tables = [...post.contentHtml.matchAll(/<p class="article-caption">表 (\d+)\./g)].map((match) => Number(match[1]));
    expect(tables).toEqual([1, 2, 3, 4]);
    expect(post.contentHtml).toContain('図 7 の 3 本の線');
  });

  it('renders KaTeX without errors', async () => {
    const post = await getPost(slug);
    expect(post.contentHtml).toContain('class="katex"');
    expect(post.contentHtml).not.toContain('katex-error');
    // \sqrt draws its radical as an inline SVG, which must survive sanitising.
    expect(post.contentHtml).toMatch(/<span class="hide-tail"[^>]*><svg [^>]*viewBox="[^"]+"[^>]*><path d="/);
  });

  it('builds a TOC whose links all resolve to heading anchors', async () => {
    const post = await getPost(slug);
    const ids = [...post.contentHtml.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
    const toc = post.contentHtml.match(/<nav class="article-toc"[\s\S]*?<\/nav>/)?.[0];
    expect(toc).toBeDefined();
    expect(toc).toContain('Olmo Hybrid を使った観察</a><ul>');
    expect(post.contentHtml).toContain('<h3 id="section-書き込みと正答列の尤度">書き込みと正答列の尤度</h3>');
    const links = [...toc!.matchAll(/href="#([^"]+)"/g)].map((match) => decodeURIComponent(match[1]!));
    expect(links.length).toBeGreaterThan(10);
    for (const link of links) expect(ids).toContain(link);
  });

  it('keeps the draft out of production routes and listings', async () => {
    expect((await getPost(slug)).draft).toBe(true);
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

describe('attention memory follow-up data', () => {
  it('keeps pending blocks out of the embedded list until the markdown uses them', () => {
    expect(pendingBlockNames.filter((name) => (blockNames as readonly string[]).includes(name))).toEqual([]);
  });

  it('has every value the follow-up figures and the all-layer table read', () => {
    expect(followupJson.sources.map((source) => source.sha256)).toSatisfy((hashes: string[]) => hashes.every((h) => /^[0-9a-f]{64}$/.test(h)));
    expect(followup.layers).toHaveLength(24);
    expect(followup.localLoss.map((row) => row.layer)).toEqual(followup.layers);
    expect(followup.triplets).toHaveLength(10);
    for (const triplet of followup.triplets) {
      expect(triplet.singleLayerA.map((row) => row.layer)).toEqual(followup.layers);
      for (const variant of ['A', 'control', 'passage'] as const) {
        const { delta, D } = triplet.allLayer[variant];
        expect(D).toBeCloseTo(delta.other_fact - (delta.same_fact_a + delta.same_fact_b) / 2, 9);
      }
    }
    expect(followup.triplets.filter((triplet) => triplet.allLayer.control.fixed).map((triplet) => triplet.id)).toEqual(['highest-court']);
  });
});

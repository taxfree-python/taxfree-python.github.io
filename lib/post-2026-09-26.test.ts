import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPost, getPosts, getPostSlugs } from './posts';
import { createArticleBlockRegex } from './article-blocks';
import { blockNames, followup31, patching } from '@/components/2026-09-26/data';
import followup31Json from '@/content/data/2026-09-26/followup-final31.json';
import patchingJson from '@/content/data/2026-09-26/patching.json';

afterEach(() => vi.unstubAllEnvs());
const slug = '2026-09-26';

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
    expect(figures).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const tables = [...post.contentHtml.matchAll(/<p class="article-caption">表 (\d+)\./g)].map((match) => Number(match[1]));
    expect(tables).toEqual([1, 2, 3, 4, 5, 6, 7]);
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
    expect(post.contentHtml).toContain('<h3 id="section-答えの情報はどの経路で運ばれるか">答えの情報はどの経路で運ばれるか</h3>');
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
  it('has every value the local-loss and passage-removal figures read', () => {
    expect(followup31Json.sources.every((source) => /^[0-9a-f]{64}$/.test(source.sha256))).toBe(true);
    expect(followup31.singleLayerRun).toBe(true);
    expect(followup31.layers).toHaveLength(24);
    expect(followup31.localLoss!.map((row) => row.layer)).toEqual(followup31.layers);
    expect(followup31.triplets).toHaveLength(31);
    for (const triplet of followup31.triplets) {
      for (const variant of ['A', 'control', 'passage'] as const) {
        const { delta, D } = triplet.allLayer[variant];
        expect(D).toBeCloseTo(delta.other_fact - (delta.same_fact_a + delta.same_fact_b) / 2, 9);
      }
    }
  });
});

describe('attention memory path-patching data', () => {
  it('has recovery for the 62 Q1/Q2 questions and overall medians that match them', () => {
    expect(patchingJson.sources.every((source) => /^[0-9a-f]{64}$/.test(source.sha256))).toBe(true);
    expect(patching.questions).toHaveLength(62);
    const median = (values: number[]) => {
      const sorted = [...values].sort((a, b) => a - b);
      return (sorted[30]! + sorted[31]!) / 2;
    };
    for (const direction of ['denoise', 'noise'] as const) {
      for (const kind of ['gdn', 'attn'] as const) {
        expect(patching.overall[direction][kind].overQuestions.median).toBeCloseTo(median(patching.questions.map((q) => q.recovery[direction][kind])), 12);
      }
      for (const q of patching.questions) expect(q.recovery[direction].both).toBeCloseTo(1, 9);
    }
  });
});

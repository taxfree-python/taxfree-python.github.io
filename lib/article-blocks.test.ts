import { describe, expect, it } from 'vitest';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { createArticleBlockRegex, remarkArticleBlocks } from './article-blocks';

async function render(markdown: string): Promise<string> {
  const file = await remark()
    .use(remarkArticleBlocks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return file.toString();
}

describe('remarkArticleBlocks', () => {
  it('turns a lone shortcode paragraph into the placeholder div', async () => {
    const html = await render('前段\n\n{{< block name="LayoutViewer" >}}\n\n後段\n');
    expect(html).toContain('<div data-block="LayoutViewer"></div>');
    expect(html).not.toContain('{{');
  });

  it('accepts flexible inner whitespace', async () => {
    const tight = await render('{{<block name="a-b_1">}}\n');
    const loose = await render('{{<   block   name="a-b_1"   >}}\n');
    expect(tight).toContain('<div data-block="a-b_1"></div>');
    expect(loose).toContain('<div data-block="a-b_1"></div>');
  });

  it('ignores a shortcode that is not a top-level paragraph', async () => {
    const html = await render('- {{< block name="LayoutViewer" >}}\n');
    expect(html).not.toContain('data-block');
    expect(html).toContain('{{');
  });

  it('still matches when the placeholder carries extra attributes', () => {
    const html = '<div class="x" data-block="ABPlayer" id="y"></div>';
    expect([...html.matchAll(createArticleBlockRegex())].map((match) => match[1])).toEqual(['ABPlayer']);
  });

  it('leaves an invalid name alone', async () => {
    const html = await render('{{< block name="bad name" >}}\n');
    expect(html).not.toContain('data-block');
  });

  it('leaves a shortcode surrounded by prose alone', async () => {
    const html = await render('前 {{< block name="Widget" >}} 後\n');
    expect(html).not.toContain('data-block');
  });

  it('replaces every shortcode in the document', async () => {
    const html = await render('{{< block name="One" >}}\n\ntext\n\n{{< block name="Two" >}}\n');
    expect(html.match(/data-block="/g)).toHaveLength(2);
  });
});

describe('createArticleBlockRegex', () => {
  it('returns a fresh regex so repeated sweeps see the same matches', () => {
    const html = '<div data-block="One"></div><p>x</p><div data-block="Two"></div>';
    const count = (regex: RegExp): number => {
      let total = 0;
      while (regex.exec(html) !== null) total += 1;
      return total;
    };
    expect(count(createArticleBlockRegex())).toBe(2);
    expect(count(createArticleBlockRegex())).toBe(2);
  });

  it('captures the block name and rejects other divs', () => {
    const regex = createArticleBlockRegex();
    expect(regex.exec('<div data-block="Layout_1-a"></div>')?.[1]).toBe('Layout_1-a');
    expect(createArticleBlockRegex().test('<div data-block="bad name"></div>')).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypeCaptions } from './rehype-captions';

async function render(markdown: string): Promise<string> {
  const file = await remark().use(remarkRehype).use(rehypeCaptions).use(rehypeStringify).process(markdown);
  return file.toString();
}

describe('rehypeCaptions', () => {
  it('marks paragraphs that open with a figure or table number', async () => {
    const html = await render("図 1. 共通の token 列。\n\n表 2. 条件 ([config](https://example.com))。\n\n図3. 詰めた表記。\n\n図 2′. 別案。");
    expect(html.match(/<p class="article-caption">/g)).toHaveLength(4);
  });

  it('leaves prose that merely mentions a figure alone', async () => {
    const html = await render('図 5 の 3 本の線は各質問の値です。\n\n本文中の 図 1. は対象外。\n\n**図 1.** 強調から始まる段落。');
    expect(html).not.toContain('article-caption');
  });
});

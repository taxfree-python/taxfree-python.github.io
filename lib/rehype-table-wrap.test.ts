import { describe, expect, it } from 'vitest';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypeTableWrap } from './rehype-table-wrap';

async function render(markdown: string): Promise<string> {
  const file = await remark().use(remarkGfm).use(remarkRehype).use(rehypeTableWrap).use(rehypeStringify).process(markdown);
  return file.toString();
}

describe('rehypeTableWrap', () => {
  it('wraps every table once and leaves other elements alone', async () => {
    const html = await render('| a | b |\n|---|---|\n| 1 | 2 |\n\ntext\n\n| c |\n|---|\n| 3 |\n');
    expect(html.match(/<div class="article-table"><table>/g)).toHaveLength(2);
    expect(html.match(/<\/table><\/div>/g)).toHaveLength(2);
    expect(html).toContain('<p>text</p>');
    expect(html).not.toContain('<div class="article-table"><div');
  });
});

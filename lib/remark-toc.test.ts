import { describe, expect, it } from 'vitest';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkToc } from './remark-toc';

async function render(markdown: string) {
  return String(await remark().use(remarkToc)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true }).process(markdown));
}

describe('article TOC', () => {
  it('links Japanese headings and disambiguates repeated headings, including inline text', async () => {
    const html = await render('{{< toc >}}\n\n## Olmo Hybridを使った観察\n\n## A **B**\n\n### Details\n\n#### Measurement\n\n### Discussion\n\n## A B');
    expect(html).toContain('id="section-olmo-hybridを使った観察"');
    expect(html).toContain(`href="#${encodeURIComponent('section-olmo-hybridを使った観察')}"`);
    expect(html).toContain('id="section-a-b"');
    expect(html).toContain('href="#section-a-b-2"');
    expect(html).toContain('id="section-a-b-2"');
    expect(html).toContain('<a href="#section-a-b">A B</a><ul><li><a href="#section-details">Details</a><ul><li><a href="#section-measurement">Measurement</a></li></ul></li><li><a href="#section-discussion">Discussion</a></li></ul></li><li><a href="#section-a-b-2">A B</a>');
  });
  it('preserves posts that do not opt into a TOC', async () => {
    expect(await render('## Heading')).toBe('<h2>Heading</h2>');
  });
});

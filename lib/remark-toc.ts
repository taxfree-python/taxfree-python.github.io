import { visit } from 'unist-util-visit';
import type { Heading, Html, Root } from 'mdast';

function textContent(node: Heading['children'][number]): string {
  if ('value' in node) return node.value;
  if ('children' in node) return node.children.map(textContent).join('');
  return '';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

type TocEntry = { id: string; title: string; depth: number; children: TocEntry[] };

function renderEntries(entries: TocEntry[], tag: 'ol' | 'ul' = 'ol'): string {
  const items = entries.map(({ id, title, children }) => {
    const nested = children.length ? renderEntries(children, 'ul') : '';
    return `<li><a href="#${encodeURIComponent(id)}">${escapeHtml(title)}</a>${nested}</li>`;
  }).join('');
  return `<${tag}>${items}</${tag}>`;
}

/** Opt-in TOC: derive links and unique anchors from the same heading nodes. */
export function remarkToc(): (tree: Root) => void {
  return (tree) => {
    const marker = tree.children.findIndex((node) => node.type === 'paragraph' && node.children.length === 1 && node.children[0]?.type === 'text' && node.children[0].value === '{{< toc >}}');
    if (marker < 0) return;
    const entries: TocEntry[] = [];
    const parents: TocEntry[] = [];
    const used = new Set<string>();
    visit(tree, 'heading', (node: Heading) => {
      const title = node.children.map(textContent).join('');
      const base = `section-${title.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'heading'}`;
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
      if (node.depth < 2) return;
      const entry: TocEntry = { id, title, depth: node.depth, children: [] };
      while (parents.length && parents[parents.length - 1]!.depth >= node.depth) parents.pop();
      const parent = parents[parents.length - 1];
      (parent ? parent.children : entries).push(entry);
      parents.push(entry);
    });
    const nav: Html = { type: 'html', value: `<nav class="article-toc" aria-label="目次"><p>目次</p>${renderEntries(entries)}</nav>` };
    tree.children[marker] = nav;
  };
}

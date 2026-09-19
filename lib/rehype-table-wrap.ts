import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

/** Wrap each table so a wide table scrolls inside the article instead of widening the page. */
export function rehypeTableWrap(): (tree: Root) => void {
  return (tree) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) return undefined;
      const wrapper: Element = { type: 'element', tagName: 'div', properties: { className: ['article-table'] }, children: [node] };
      parent.children[index] = wrapper;
      return index + 1;
    });
  };
}

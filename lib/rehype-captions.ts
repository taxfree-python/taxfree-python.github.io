import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

/** A caption is a paragraph that opens with `図 N.` (after a figure) or `表 N.` (before a table). */
const CAPTION_PATTERN = /^(図|表) ?\d+[′']?\./;

/** Mark caption paragraphs so the article styles can center them. */
export function rehypeCaptions(): (tree: Root) => void {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'p') return;
      const first = node.children[0];
      if (first?.type !== 'text' || !CAPTION_PATTERN.test(first.value)) return;
      node.properties = { ...node.properties, className: ['article-caption'] };
    });
  };
}

import { visit } from 'unist-util-visit';
import type { Html, Paragraph, Root } from 'mdast';
import type { ReactElement } from 'react';

/**
 * The interactive islands one article contributes, keyed by the name used in
 * its `{{< block name="..." >}}` shortcodes. Each article exports one of these
 * from its own `blocks` module; `app/blog/[slug]/page.tsx` loads `articles/<slug>/blocks` by slug.
 */
export type ArticleBlocks = Record<string, () => ReactElement>;

const BLOCK_NAME_PATTERN = '[A-Za-z0-9_-]+';

/** Placeholder written by the remark plugin and read back by ArticleContent. */
export const ARTICLE_BLOCK_PATTERN = `<div[^>]*\\bdata-block="(${BLOCK_NAME_PATTERN})"[^>]*>\\s*</div>`;

/** A global regex carries `lastIndex`, so every scan gets its own. */
export function createArticleBlockRegex(): RegExp {
  return new RegExp(ARTICLE_BLOCK_PATTERN, 'g');
}

const SHORTCODE_PATTERN = new RegExp(
  `^\\{\\{<\\s*block\\s+name="(${BLOCK_NAME_PATTERN})"\\s*>\\}\\}$`,
);

/**
 * Remark plugin: a paragraph that is nothing but `{{< block name="someId" >}}`
 * becomes the placeholder `<div data-block="someId"></div>`. Any other
 * paragraph, including one that merely contains the shortcode, is left alone.
 */
export function remarkArticleBlocks(): (tree: Root) => void {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      // Only top level: a placeholder nested in a list or quote would split the
      // surrounding HTML into unbalanced chunks when ArticleContent slices it.
      if (!parent || parent.type !== 'root' || index === undefined) return;

      // The parser may split the shortcode across text/html children.
      const combinedText = node.children
        .map((child) =>
          (child.type === 'text' || child.type === 'html') && 'value' in child ? child.value : '',
        )
        .join('')
        .trim();

      const match = combinedText.match(SHORTCODE_PATTERN);
      const name = match?.[1];
      if (name === undefined) return;

      const htmlNode: Html = { type: 'html', value: `<div data-block="${name}"></div>` };
      parent.children[index] = htmlNode;
    });
  };
}

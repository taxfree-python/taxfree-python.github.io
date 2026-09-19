import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { createArticleBlockRegex } from '@/lib/article-blocks';
import type { ArticleBlocks } from '@/lib/article-blocks';

type Props = {
  html: string;
  blocks: ArticleBlocks;
};

/**
 * Renders post HTML while swapping each `<div data-block="name">` placeholder
 * for the article's registered block. An unregistered name renders nothing.
 * HTML between placeholders is set verbatim (already sanitised in lib/posts.ts).
 */
export default function ArticleContent({ html, blocks }: Props) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  const placeholder = createArticleBlockRegex();

  while ((match = placeholder.exec(html)) !== null) {
    const chunk = html.slice(lastIndex, match.index);
    if (chunk) {
      nodes.push(<div key={key++} dangerouslySetInnerHTML={{ __html: chunk }} />);
    }
    const name = match[1];
    const block = name === undefined ? undefined : blocks[name];
    if (block) {
      nodes.push(<Fragment key={key++}>{block()}</Fragment>);
    } else {
      // Otherwise a typo in the shortcode silently drops the island.
      console.warn(`Article block "${name}" has no entry in the article's blocks module.`);
    }
    lastIndex = match.index + match[0].length;
  }
  const tail = html.slice(lastIndex);
  if (tail) {
    nodes.push(<div key={key++} dangerouslySetInnerHTML={{ __html: tail }} />);
  }

  return <Fragment>{nodes}</Fragment>;
}

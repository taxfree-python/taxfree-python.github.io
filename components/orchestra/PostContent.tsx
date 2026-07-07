import { Fragment, type ReactNode } from 'react';
import OrchestraWidget from './OrchestraWidget';
import { createOrchestraPlaceholderRegex, isOrchestraWidgetName } from '@/lib/orchestra-widgets';

type Props = {
  html: string;
};

/**
 * Renders post HTML while swapping `<div data-orchestra-widget="Name">` markers
 * for the corresponding interactive React island. HTML between markers is set
 * verbatim (already sanitised in lib/posts.ts).
 */
export default function PostContent({ html }: Props) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  const placeholder = createOrchestraPlaceholderRegex();

  while ((match = placeholder.exec(html)) !== null) {
    const chunk = html.slice(lastIndex, match.index);
    if (chunk) {
      nodes.push(<div key={key++} dangerouslySetInnerHTML={{ __html: chunk }} />);
    }
    const name = match[1];
    if (name !== undefined && isOrchestraWidgetName(name)) {
      nodes.push(<OrchestraWidget key={key++} name={name} />);
    }
    lastIndex = match.index + match[0].length;
  }
  const tail = html.slice(lastIndex);
  if (tail) {
    nodes.push(<div key={key++} dangerouslySetInnerHTML={{ __html: tail }} />);
  }

  return <Fragment>{nodes}</Fragment>;
}

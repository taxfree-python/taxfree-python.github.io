'use client';

import { Fragment, type ComponentType, type ReactNode } from 'react';
import LayoutViewer from './LayoutViewer';
import EvolutionReplay from './EvolutionReplay';
import ABPlayer from './ABPlayer';

const REGISTRY: Record<string, ComponentType> = {
  LayoutViewer,
  EvolutionReplay,
  ABPlayer,
};

// Matches the placeholder emitted by lib/remark-orchestra.ts (after sanitisation).
const PLACEHOLDER = /<div[^>]*data-orchestra-widget="([^"]+)"[^>]*><\/div>/g;

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

  PLACEHOLDER.lastIndex = 0;
  while ((match = PLACEHOLDER.exec(html)) !== null) {
    const chunk = html.slice(lastIndex, match.index);
    if (chunk) {
      nodes.push(<div key={key++} dangerouslySetInnerHTML={{ __html: chunk }} />);
    }
    const Widget = REGISTRY[match[1]!];
    if (Widget) {
      nodes.push(<Widget key={key++} />);
    }
    lastIndex = match.index + match[0].length;
  }
  const tail = html.slice(lastIndex);
  if (tail) {
    nodes.push(<div key={key++} dangerouslySetInnerHTML={{ __html: tail }} />);
  }

  return <Fragment>{nodes}</Fragment>;
}

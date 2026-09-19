import type { ReactElement } from 'react';
import { AccuracyFigure } from './AccuracyFigure';
import { ClintoxFigure } from './ClintoxFigure';
import { ProbabilityFigure } from './ProbabilityFigure';
import { SeqqaFigure } from './SeqqaFigure';
import { isJevFigureId, type JevFigureId } from './data';

/** Every id in `jevFigureIds` needs a component here; the article embeds a subset. */
const figures: Record<JevFigureId, () => ReactElement> = {
  accuracy: AccuracyFigure,
  probability: ProbabilityFigure,
  seqqa: SeqqaFigure,
  clintox: ClintoxFigure,
};

const splitPattern = /(<div data-jev-figure="[^"]*"><\/div>)/g;
const placeholderPattern = /^<div data-jev-figure="([^"]*)"><\/div>$/;

type PostContentProps = {
  html: string;
};

/**
 * Renders post HTML while swapping `<div data-jev-figure="…">` markers for the
 * matching figure. HTML between markers is already sanitised in lib/posts.ts.
 */
export default function PostContent({ html }: PostContentProps) {
  const chunks = html.split(splitPattern);
  return <>{chunks.map((chunk, index) => {
    const id = chunk.match(placeholderPattern)?.[1];
    if (id !== undefined) {
      if (!isJevFigureId(id)) return null;
      const FigureComponent = figures[id];
      return <FigureComponent key={index} />;
    }
    return <div key={index} dangerouslySetInnerHTML={{ __html: chunk }} />;
  })}</>;
}

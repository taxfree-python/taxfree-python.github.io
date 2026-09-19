import type { ReactNode } from 'react';

type FigureProps = {
  id: string;
  desktop: ReactNode;
  mobile: ReactNode;
};

/**
 * Shared figure contract: both renderings ship, CSS in app/blog/[slug]/page.tsx
 * picks one by viewport width.
 */
export function Figure({ id, desktop, mobile }: FigureProps) {
  return (
    <div className="article-figure" data-block={id}>
      <div className="article-figure-desktop">{desktop}</div>
      <div className="article-figure-mobile">{mobile}</div>
    </div>
  );
}

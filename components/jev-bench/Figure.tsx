import type { ReactNode } from 'react';

type FigureProps = {
  id: string;
  desktop: ReactNode;
  mobile: ReactNode;
};

/** Wrapper shared by every article figure: one SVG per breakpoint, swapped by CSS. */
export function Figure({ id, desktop, mobile }: FigureProps) {
  return (
    <div className="article-figure" data-jev-figure={id}>
      <div className="article-figure-desktop">{desktop}</div>
      <div className="article-figure-mobile">{mobile}</div>
    </div>
  );
}

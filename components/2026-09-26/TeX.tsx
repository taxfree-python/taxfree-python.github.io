import katex from 'katex';

/** Inline math set by KaTeX, so labels match the math in the prose. */
export function Tex({ tex }: { tex: string }) {
  return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(tex, { throwOnError: true }) }} />;
}

/** Figure math is set a step larger than figure text; KaTeX's own 1.21em alone read too small. */
const mathScale = 1.2;
const boxWidth = 160;
const boxHeight = 28;

/**
 * KaTeX inside an SVG, anchored like an SVG text element with dominantBaseline="central".
 * `after` is plain text set in the page font right after the math (e.g. "𝒜 removed").
 */
export function SvgTex({ x, y, tex, anchor = 'start', color, scale = 1, after }: {
  x: number; y: number; tex: string; anchor?: 'start' | 'middle' | 'end'; color: string; scale?: number; after?: string | undefined;
}) {
  const left = anchor === 'start' ? x : anchor === 'middle' ? x - boxWidth / 2 : x - boxWidth;
  const justify = anchor === 'start' ? 'flex-start' : anchor === 'middle' ? 'center' : 'flex-end';
  return (
    <foreignObject x={left} y={y - boxHeight / 2} width={boxWidth} height={boxHeight} overflow="visible">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: justify, height: '100%', color, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: `${scale * mathScale}em` }}><Tex tex={tex} /></span>
        {after && <span style={{ whiteSpace: 'pre' }}>{after}</span>}
      </div>
    </foreignObject>
  );
}

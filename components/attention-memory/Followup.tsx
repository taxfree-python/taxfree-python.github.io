import { Figure } from '@/components/article/Figure';
import { palette, roles, type Role } from './palette';
import { drawOrder, QuestionLegend, QuestionMark, signed, svgStyle } from './marks';
import { SvgTex } from './TeX';

type ByRole = Record<Role, number>;
export type FollowupTriplet = {
  id: string;
  targetWriteText: string;
  questions: { id: string; role: Role }[];
  singleLayerA: { layer: number; delta: ByRole }[];
  singleLayerSumA: { delta: ByRole; D: number };
  allLayer: Record<'A' | 'control' | 'passage', { delta: ByRole; D: number }> & { control: { fixed: boolean } };
};
export type LocalLossRow = { layer: number; before: number; prefix: number; passage: number; A: number };

const layerTicks = [0, 5, 10, 15, 20, 25, 30];

/**
 * Reference states, from the least removed (A) to all of it (S = 0). Lightness follows that
 * order; there is no accent because no single line is the one to look at.
 */
const lossSeries: { key: keyof Omit<LocalLossRow, 'layer'>; tex: string; after?: string; text?: string; color: string }[] = [
  { key: 'A', tex: '\\mathcal{A}', after: ' removed', color: palette.ink },
  { key: 'passage', tex: '', text: 'passage removed', color: '#b4b7af' },
  { key: 'prefix', tex: '', text: 'prefix removed', color: '#8a8e86' },
  { key: 'before', tex: 'S=0', color: '#6a6e67' },
];

/** Spread labels vertically so none sit closer than `gap`, keeping them near their line ends. */
function spread(targets: number[], gap: number): number[] {
  const order = targets.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < order.length; k++) order[k]!.y = Math.max(order[k]!.y, order[k - 1]!.y + gap);
  const out: number[] = [];
  for (const { y, i } of order) out[i] = y;
  return out;
}

function LocalLossPlot({ rows, mobile }: { rows: LocalLossRow[]; mobile: boolean }) {
  const width = mobile ? 340 : 800, height = mobile ? 250 : 290;
  const box = { left: mobile ? 34 : 50, right: width - (mobile ? 100 : 140), top: 14, bottom: height - (mobile ? 42 : 46) };
  const x = (layer: number) => box.left + layer / 30 * (box.right - box.left);
  const yMax = 1.05;
  const y = (value: number) => box.bottom - value / yMax * (box.bottom - box.top);
  const last = rows[rows.length - 1]!;
  const labelY = spread(lossSeries.map(s => y(last[s.key])), mobile ? 14 : 16);
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" style={svgStyle(mobile)}
    aria-label="GDN の各層で、質問 token の局所回帰損失を 4 通りの参照 state の損失と比べた比の中央値。区間 A の書き込みを除いた state との比はほぼ 1、passage の書き込みを除くと約 0.9、prefix 全体では更に下がり、S=0 との比が最も小さい。">
    {[0, 0.25, 0.5, 0.75].map(tick => <g key={tick}>
      <line x1={box.left} x2={box.right} y1={y(tick)} y2={y(tick)} stroke="#30342f" strokeWidth={0.8} />
      <text x={box.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="central" fill={palette.muted}>{tick === 0 ? '0' : tick.toFixed(2)}</text>
    </g>)}
    {/* Ratio 1: the question tokens are fit no better than by the reference state. */}
    <line x1={box.left} x2={box.right} y1={y(1)} y2={y(1)} stroke={palette.muted} strokeWidth={0.8} />
    <text x={box.left - 8} y={y(1)} textAnchor="end" dominantBaseline="central" fill={palette.muted}>1</text>
    {[...lossSeries].reverse().map(series => <g key={series.key}>
      <polyline fill="none" stroke={series.color} strokeWidth={1.6} strokeLinejoin="round"
        points={rows.map(row => `${x(row.layer).toFixed(2)},${y(row[series.key]).toFixed(2)}`).join(' ')} />
      {rows.map(row => <circle key={row.layer} cx={x(row.layer)} cy={y(row[series.key])} r={mobile ? 1.6 : 2} fill={series.color} />)}
    </g>)}
    {lossSeries.map((series, i) => series.text
      ? <text key={series.key} x={box.right + 10} y={labelY[i]} dominantBaseline="central" fill={series.color}>{series.text}</text>
      : <SvgTex key={series.key} x={box.right + 10} y={labelY[i]!} tex={series.tex} after={series.after} color={series.color} />)}
    {layerTicks.map(tick => <text key={tick} x={x(tick)} y={box.bottom + 18} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>{tick}</text>)}
    <text x={(box.left + box.right) / 2} y={height - 10} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>Layer index</text>
  </svg>;
}

export function LocalLossFigure({ rows }: { rows: LocalLossRow[] }) {
  return <Figure id="local-loss" desktop={<LocalLossPlot rows={rows} mobile={false} />} mobile={<LocalLossPlot rows={rows} mobile />} />;
}

/** Horizontal dot plot: one row per triplet, the three questions on a shared Δlog p axis. */
function PassageRemovalPlot({ triplets, mobile }: { triplets: FollowupTriplet[]; mobile: boolean }) {
  const rowHeight = mobile ? 22 : 24;
  const top = mobile ? 52 : 40;
  const width = mobile ? 340 : 800;
  const box = { left: mobile ? 134 : 180, right: width - (mobile ? 12 : 24), top, bottom: top + triplets.length * rowHeight };
  const height = box.bottom + (mobile ? 44 : 48);
  const values = triplets.flatMap(t => roles.map(role => t.allLayer.passage.delta[role]));
  const step = 10;
  const lo = Math.min(...values) * 1.04;
  const x = (value: number) => box.right - value / lo * (box.right - box.left);
  const ticks = Array.from({ length: Math.floor(-lo / step) + 1 }, (_, i) => -i * step);
  const rowY = (i: number) => box.top + (i + 0.5) * rowHeight;
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" style={svgStyle(mobile)}
    aria-label="全 24 層の GDN で passage 全体の書き込みを止めたときの、10 triplet × 3 問の正答列の Δlog p。どの質問でも尤度が大きく下がる。">
    <QuestionLegend x={mobile ? 8 : box.left} y={mobile ? 12 : 14} mobile={mobile} />
    {ticks.map(tick => <g key={tick}>
      <line x1={x(tick)} x2={x(tick)} y1={box.top} y2={box.bottom} stroke={tick === 0 ? palette.muted : '#30342f'} strokeWidth={0.8} />
      <text x={x(tick)} y={box.bottom + 16} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>{signed(tick)}</text>
    </g>)}
    {triplets.map((t, i) => <g key={t.id}>
      <text x={box.left - 12} y={rowY(i)} textAnchor="end" dominantBaseline="central" fill={palette.muted}>{t.id}</text>
      {drawOrder.map(role => <QuestionMark key={role} role={role} cx={x(t.allLayer.passage.delta[role])} cy={rowY(i)} r={mobile ? 3 : 3.4} />)}
    </g>)}
    <SvgTex x={(box.left + box.right) / 2} y={height - 10} anchor="middle" tex="\Delta\log p" color={palette.muted} />
  </svg>;
}

export function PassageRemovalFigure({ triplets }: { triplets: FollowupTriplet[] }) {
  return <Figure id="passage-removal" desktop={<PassageRemovalPlot triplets={triplets} mobile={false} />}
    mobile={<PassageRemovalPlot triplets={triplets} mobile />} />;
}

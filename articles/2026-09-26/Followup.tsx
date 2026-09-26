import { Figure } from '@/components/article/Figure';
import { palette, questionLabels, roleColors, roles, type Role } from './palette';
import { QuestionMark, signed, svgStyle, swarm } from './marks';
import { SvgTex } from './TeX';

type ByRole = Record<Role, number>;
/** One triplet of the follow-up data. */
export type FollowupTriplet = {
  id: string;
  title?: string;
  targetWriteText: string;
  questions: { id: string; role: Role }[];
  allLayer: Record<'A' | 'control' | 'passage', { delta: ByRole; D: number }> & { control: { fixed: boolean } };
};
export type LocalLossRow = { layer: number; before: number; prefix: number; passage: number; A: number };

const layerTicks = [0, 5, 10, 15, 20, 25, 30];

/**
 * Reference states, from the least removed (A) to all of it (S = 0). The order runs from blue to
 * orange so that neighbouring lines differ in hue or lightness, never in grey level alone.
 */
const lossSeries: { key: keyof Omit<LocalLossRow, 'layer'>; tex: string; after?: string; text?: string; color: string }[] = [
  { key: 'A', tex: '\\mathcal{A}', after: ' removed', color: '#5f8fa6' },
  { key: 'passage', tex: '', text: 'passage removed', color: '#9cc3d0' },
  { key: 'prefix', tex: '', text: 'prefix removed', color: '#e0b48a' },
  { key: 'before', tex: 'S=0', color: palette.substitute },
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

/** Needs the single-layer run; renders nothing until that data exists. */
export function LocalLossFigure({ rows }: { rows: LocalLossRow[] | null }) {
  if (!rows) return null;
  return <Figure id="local-loss" desktop={<LocalLossPlot rows={rows} mobile={false} />} mobile={<LocalLossPlot rows={rows} mobile />} />;
}

const median = (values: number[]) => {
  const v = [...values].sort((a, b) => a - b);
  const m = v.length >> 1;
  return v.length % 2 ? v[m]! : (v[m - 1]! + v[m]!) / 2;
};

/** One row per question (Q1, Q2, Q3), every triplet a point on a shared Δlog p axis, median marked. */
function PassageRemovalPlot({ triplets, mobile }: { triplets: FollowupTriplet[]; mobile: boolean }) {
  const width = mobile ? 340 : 800;
  const r = mobile ? 2.6 : 3;
  const box = { left: mobile ? 104 : 150, right: width - (mobile ? 14 : 24) };
  const values = triplets.flatMap(t => roles.map(role => t.allLayer.passage.delta[role]));
  const step = 10;
  const lo = Math.min(...values) * 1.04;
  const x = (value: number) => box.right - value / lo * (box.right - box.left);
  const ticks = Array.from({ length: Math.floor(-lo / step) + 1 }, (_, i) => -i * step);
  const labelSpace = mobile ? 16 : 18;
  let cursor = mobile ? 8 : 10;
  const rows = roles.map(role => {
    const vs = triplets.map(t => t.allLayer.passage.delta[role]);
    const offsets = swarm(vs.map(x), r);
    const up = Math.max(...offsets.map(o => -o)) + r, down = Math.max(...offsets) + r;
    const y = cursor + labelSpace + up;
    cursor = y + down + 6;
    return { role, vs, offsets, y, up, down, med: median(vs) };
  });
  const top = rows[0]!.y - rows[0]!.up, bottom = cursor;
  const height = bottom + (mobile ? 44 : 48);
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" style={svgStyle(mobile)}
    aria-label={`全 24 層の GDN で passage 全体の書き込みを止めたときの、${triplets.length} 組の各質問の正答列の Δlog p。中央値は Q1 ${signed(rows[0]!.med, 2)}、Q2 ${signed(rows[1]!.med, 2)}、Q3 ${signed(rows[2]!.med, 2)} nats。どの質問でも尤度が下がる。`}>
    {ticks.map(tick => <g key={tick}>
      <line x1={x(tick)} x2={x(tick)} y1={top} y2={bottom} stroke={tick === 0 ? palette.muted : '#30342f'} strokeWidth={0.8} />
      <text x={x(tick)} y={bottom + 16} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>{signed(tick)}</text>
    </g>)}
    {rows.map(({ role, vs, offsets, y, up, down, med }) => <g key={role}>
      <text x={box.left - (mobile ? 10 : 14)} y={y} textAnchor="end" dominantBaseline="central" fill={roleColors[role]}>{questionLabels[role]}</text>
      {vs.map((v, i) => <QuestionMark key={triplets[i]!.id} role={role} cx={x(v)} cy={y + offsets[i]!} r={r} />)}
      <line x1={x(med)} x2={x(med)} y1={y - up} y2={y + down} stroke={palette.ink} strokeWidth={1.6} />
      <text x={x(med)} y={y - up - labelSpace / 2 - 1} textAnchor="middle" dominantBaseline="central" fill={palette.ink}>{signed(med, 2)}</text>
    </g>)}
    <SvgTex x={(box.left + box.right) / 2} y={height - 10} anchor="middle" tex="\Delta\log p" color={palette.muted} />
  </svg>;
}

export function PassageRemovalFigure({ triplets }: { triplets: FollowupTriplet[] }) {
  return <Figure id="passage-removal" desktop={<PassageRemovalPlot triplets={triplets} mobile={false} />}
    mobile={<PassageRemovalPlot triplets={triplets} mobile />} />;
}

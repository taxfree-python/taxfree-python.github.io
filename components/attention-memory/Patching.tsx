import { Figure } from '@/components/article/Figure';
import { palette, questionLabels, roleColors } from './palette';
import { QuestionMark, svgStyle, swarm } from './marks';

type Direction = 'denoise' | 'noise';
type Kind = 'gdn' | 'gdn_state_only' | 'attn' | 'both';
type Summary = { median: number; p10: number; p90: number; n: number };
export type PatchingQuestion = {
  id: string;
  triplet: string;
  role: 'same_fact_a' | 'same_fact_b';
  recovery: Record<Direction, Record<Kind, number>>;
};
export type PatchingLayerSummary = { layer: number } & Summary;
export type PatchingData = {
  gdnLayers: number[];
  attnLayers: number[];
  overall: Record<Direction, Record<Kind, { overQuestions: Summary }>>;
  questions: PatchingQuestion[];
  singleLayer: null | {
    layers: Record<'gdn' | 'attn', number[]>;
    byLayer: Record<Direction, Record<'gdn' | 'attn', PatchingLayerSummary[]>>;
  };
};

/** The two paths from the passage to the question, in the order the rows are drawn. */
const paths = [
  { kind: 'gdn', label: 'GDN state' },
  { kind: 'attn', label: 'softmax K/V' },
] as const;
const directions: Direction[] = ['denoise', 'noise'];
const pairRoles = ['same_fact_a', 'same_fact_b'] as const;

/** Legend: Q1 dot, Q2 ring, median tick. */
function PairLegend({ x, y, mobile }: { x: number; y: number; mobile: boolean }) {
  const charWidth = mobile ? 6 : 7;
  let cursor = x;
  const items = pairRoles.map(role => {
    const left = cursor;
    cursor += questionLabels[role].length * charWidth + 38;
    return <g key={role}>
      <QuestionMark role={role} cx={left + 6} cy={y} />
      <text x={left + 20} y={y} dominantBaseline="central" fill={roleColors[role]}>{questionLabels[role]}</text>
    </g>;
  });
  return <g aria-hidden="true">
    {items}
    <line x1={cursor + 6} x2={cursor + 6} y1={y - 7} y2={y + 7} stroke={palette.ink} strokeWidth={1.6} />
    <text x={cursor + 16} y={y} dominantBaseline="central" fill={palette.ink}>median</text>
  </g>;
}

function PatchingPathsPlot({ data, mobile }: { data: PatchingData; mobile: boolean }) {
  const width = mobile ? 340 : 800;
  const r = mobile ? 2.2 : 2.6;
  const groupGap = mobile ? 10 : 14;
  const labelSpace = mobile ? 16 : 18;
  const top = mobile ? 30 : 34;
  const strip = { left: mobile ? 64 : 170, right: mobile ? 330 : 520 };
  const domain: [number, number] = [-0.1, 1.1];
  const x = (v: number) => strip.left + (v - domain[0]) / (domain[1] - domain[0]) * (strip.right - strip.left);
  const qs = data.questions;
  // Lay the rows out from their swarms: each row is as tall as its swarm plus a line for the median value.
  let cursor = top;
  const rows = paths.flatMap((path, g) => directions.map((direction, d) => {
    const values = qs.map(q => q.recovery[direction][path.kind]);
    const offsets = swarm(values.map(x), r);
    const up = Math.max(...offsets.map(o => -o)) + r, down = Math.max(...offsets) + r;
    if (g > 0 && d === 0) cursor += groupGap;
    if (mobile && d === 0) cursor += 18;
    const y = cursor + labelSpace + up;
    cursor = y + down + 4;
    return { path, direction, first: d === 0, y, up, down, values, offsets };
  }));
  const stripTop = rows[0]!.y - rows[0]!.up;
  const stripBottom = cursor;

  // Scatter: denoising recovery of the two paths per question, square so x + y = 1 runs at 45°.
  const side = mobile ? 190 : 206;
  const sq = mobile
    ? { left: 70, top: stripBottom + 100 }
    : { left: width - side - 24, top: top + 44 };
  const sx = (v: number) => sq.left + (v + 0.1) / 0.7 * side;
  const sy = (v: number) => sq.top + (1.1 - v) / 0.7 * side;
  const height = mobile ? sq.top + side + 44 : Math.max(stripBottom + 46, sq.top + side + 44);

  return <svg viewBox={`0 0 ${width} ${height}`} role="img" style={svgStyle(mobile)}
    aria-label={`31 組 62 問の Q1・Q2 で、passage から質問への経路を 1 つだけ入れ替えたときの recovery。GDN の state (conv を含む) の中央値は denoise ${data.overall.denoise.gdn.overQuestions.median.toFixed(2)}、noise ${data.overall.noise.gdn.overQuestions.median.toFixed(2)}、softmax attention の K/V は denoise ${data.overall.denoise.attn.overQuestions.median.toFixed(2)}、noise ${data.overall.noise.attn.overQuestions.median.toFixed(2)}。右は質問ごとの denoise の 2 経路の組で、ほぼ和が 1 の線上に並ぶ。`}>
    <PairLegend x={mobile ? 8 : strip.left} y={mobile ? 12 : 14} mobile={mobile} />

    {/* Hairlines at no recovery (0) and full recovery (1). */}
    {[0, 1].map(v => <line key={v} x1={x(v)} x2={x(v)} y1={stripTop} y2={stripBottom} stroke={palette.muted} strokeWidth={0.8} />)}
    {[0, 0.5, 1].map(v => <text key={v} x={x(v)} y={stripBottom + 16} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>{v === 0.5 ? '0.5' : v}</text>)}
    <text x={(strip.left + strip.right) / 2} y={stripBottom + 36} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>Recovery</text>

    {rows.map(({ path, direction, first, y, up, down, values, offsets }, i) => {
      const median = data.overall[direction][path.kind].overQuestions.median;
      const groupMid = first ? (y + rows[i + 1]!.y) / 2 : 0;
      return <g key={`${path.kind}-${direction}`}>
        {first && (mobile
          ? <text x={4} y={y - up - labelSpace - 10} dominantBaseline="central" fill={palette.ink}>{path.label}</text>
          : <text x={8} y={groupMid} dominantBaseline="central" fill={palette.ink}>{path.label}</text>)}
        <text x={strip.left - (mobile ? 10 : 14)} y={y} textAnchor="end" dominantBaseline="central" fill={palette.muted}>{direction}</text>
        {qs.map((q, k) => <QuestionMark key={q.id} role={q.role} cx={x(values[k]!)} cy={y + offsets[k]!} r={r} />)}
        <line x1={x(median)} x2={x(median)} y1={y - up} y2={y + down} stroke={palette.ink} strokeWidth={1.6} />
        <text x={x(median)} y={y - up - labelSpace / 2 - 1} textAnchor="middle" dominantBaseline="central" fill={palette.ink}>{median.toFixed(2)}</text>
      </g>;
    })}

    <g>
      <text x={sq.left - 30} y={sq.top - 34} dominantBaseline="central" fill={palette.ink}>denoise, per question</text>
      <text x={sq.left - 30} y={sq.top - 14} dominantBaseline="central" fill={palette.muted}>softmax K/V</text>
      <rect x={sq.left} y={sq.top} width={side} height={side} fill="none" stroke={palette.rule} strokeWidth={0.8} />
      <line x1={sx(0)} x2={sx(0)} y1={sq.top} y2={sq.top + side} stroke={palette.muted} strokeWidth={0.8} />
      <line x1={sq.left} x2={sq.left + side} y1={sy(1)} y2={sy(1)} stroke={palette.muted} strokeWidth={0.8} />
      {/* The two paths add up exactly when there is no interaction between them. */}
      <line x1={sx(-0.1)} y1={sy(1.1)} x2={sx(0.6)} y2={sy(0.4)} stroke={palette.muted} strokeWidth={0.8} />
      <text x={sx(0.5) + 4} y={sy(0.5) - 4} textAnchor="middle" fill={palette.muted}
        transform={`rotate(45 ${sx(0.5) + 4} ${sy(0.5) - 4})`}>sum = 1</text>
      {[...qs].sort((a, b) => (a.role === b.role ? 0 : a.role === 'same_fact_a' ? -1 : 1)).map(q =>
        <QuestionMark key={q.id} role={q.role} cx={sx(q.recovery.denoise.gdn)} cy={sy(q.recovery.denoise.attn)} r={r} />)}
      {[0, 0.25, 0.5].map(v => <text key={v} x={sx(v)} y={sq.top + side + 14} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>{v}</text>)}
      {[0.5, 0.75, 1].map(v => <text key={v} x={sq.left - 6} y={sy(v)} textAnchor="end" dominantBaseline="central" fill={palette.muted}>{v}</text>)}
      <text x={sq.left + side / 2} y={sq.top + side + 32} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>GDN state</text>
    </g>
  </svg>;
}

export function PatchingPathsFigure({ data }: { data: PatchingData }) {
  return <Figure id="patching-paths" desktop={<PatchingPathsPlot data={data} mobile={false} />} mobile={<PatchingPathsPlot data={data} mobile />} />;
}

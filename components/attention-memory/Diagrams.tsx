import type { CSSProperties } from 'react';
import { Figure } from '@/components/article/Figure';
import { palette, roleColors, roles, type Role } from './palette';
import { SvgTex } from './TeX';

const questionLabels: Record<Role, string> = {
  same_fact_a: 'Q1 · same fact',
  same_fact_b: 'Q2 · paraphrase',
  other_fact: 'Q3 · other fact',
};

function svgStyle(mobile: boolean): CSSProperties {
  return { width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit', fontSize: mobile ? 11 : 13 };
}

/** Thin line with an open head at (x2, y2), in the style of the matplotlib schematics. */
function Arrow({ x1, y1, x2, y2, color = palette.muted, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 5;
  const wing = (sign: number) =>
    `${x2 - head * Math.cos(angle + sign * 0.5)},${y2 - head * Math.sin(angle + sign * 0.5)}`;
  return (
    <g stroke={color} strokeWidth={0.9} fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dashed ? '3 3' : undefined} />
      <polyline points={`${wing(-1)} ${x2},${y2} ${wing(1)}`} />
    </g>
  );
}

type Span = [number, number];

/** Passage box with span A highlighted; identical wherever it appears. */
function Passage({ x, y, h, a }: { x: Span; y: number; h: number; a: Span }) {
  return (
    <g>
      <rect x={x[0]} y={y} width={x[1] - x[0]} height={h} fill="none" stroke={palette.rule} strokeWidth={0.9} />
      <text x={x[0] + 8} y={y + h / 2} dominantBaseline="central" fill={palette.muted}>passage</text>
      <rect x={a[0]} y={y + 3} width={a[1] - a[0]} height={h - 6} fill={palette.state} opacity={0.5} />
      <SvgTex x={(a[0] + a[1]) / 2} y={y + h / 2} anchor="middle" tex="\mathcal{A}" color={palette.ink} />
    </g>
  );
}

const independentLayout = {
  desktop: { width: 800, offset: 110, rowGap: 44, boxH: 28, s0: [0, 44] as Span, passage: [64, 300] as Span, a: [178, 222] as Span, question: [360, 530] as Span, answer: 556 },
  mobile: { width: 340, offset: 0, rowGap: 36, boxH: 24, s0: [0, 28] as Span, passage: [40, 150] as Span, a: [88, 110] as Span, question: [184, 282] as Span, answer: 294 },
};

function IndependentQuestions({ mobile }: { mobile: boolean }) {
  const l = mobile ? independentLayout.mobile : independentLayout.desktop;
  const top = 4;
  const height = top * 2 + l.rowGap * 2 + l.boxH;
  const sharedY = top + l.rowGap;
  const sharedMid = sharedY + l.boxH / 2;
  return (
    <svg viewBox={`0 0 ${l.width} ${height}`} role="img" style={svgStyle(mobile)}
      aria-label="同じ初期 state から共通の passage を読み、そこから 3 つの質問に分かれて回答する。">
      <g transform={`translate(${l.offset} 0)`}>
      <rect x={l.s0[0] + 0.5} y={sharedY} width={l.s0[1] - l.s0[0] - 1} height={l.boxH} fill="none" stroke={palette.state} strokeWidth={0.9} />
      <SvgTex x={(l.s0[0] + l.s0[1]) / 2} y={sharedMid} anchor="middle" tex="S_0" color={palette.ink} />
      <Arrow x1={l.s0[1]} y1={sharedMid} x2={l.passage[0]} y2={sharedMid} />
      <Passage x={l.passage} y={sharedY} h={l.boxH} a={l.a} />
      {roles.map((role, index) => {
        const y = top + index * l.rowGap;
        const mid = y + l.boxH / 2;
        return (
          <g key={role}>
            <Arrow x1={l.passage[1]} y1={sharedMid} x2={l.question[0]} y2={mid} />
            <rect x={l.question[0]} y={y} width={l.question[1] - l.question[0]} height={l.boxH} fill="none"
              stroke={roleColors[role]} strokeWidth={0.9} />
            <text x={l.question[0] + 8} y={mid} dominantBaseline="central" fill={palette.ink}>{questionLabels[role]}</text>
            <Arrow x1={l.question[1]} y1={mid} x2={l.answer - 6} y2={mid} />
            <text x={l.answer} y={mid} dominantBaseline="central" fill={palette.muted}>answer</text>
          </g>
        );
      })}
      </g>
    </svg>
  );
}

const interventionLayout = {
  desktop: { width: 800, cell: 26, gap: 4, passageCells: 12, aCells: [6, 7], questionX: 440, questionCells: 5, rowY: 22, stateX: 346, stateY: 100, stateSize: 84 },
  mobile: { width: 340, cell: 16, gap: 3, passageCells: 8, aCells: [4, 5], questionX: 196, questionCells: 4, rowY: 18, stateX: 146, stateY: 74, stateSize: 56 },
};

function WriteIntervention({ mobile }: { mobile: boolean }) {
  const l = mobile ? interventionLayout.mobile : interventionLayout.desktop;
  const step = l.cell + l.gap;
  const cellX = (x0: number, i: number) => x0 + i * step;
  const questionEnd = cellX(l.questionX, l.questionCells) - l.gap;
  const answerX = questionEnd + 26;
  const rowBottom = l.rowY + l.cell;
  const rowMid = l.rowY + l.cell / 2;
  const stateTop = l.stateY;
  const stateMid = l.stateY + l.stateSize / 2;
  const stateRight = l.stateX + l.stateSize;
  const isA = (i: number) => l.aCells.includes(i);
  const aMidX = (cellX(0, l.aCells[0]!) + cellX(0, l.aCells[l.aCells.length - 1]!) + l.cell) / 2;
  const target = (i: number) => l.stateX + ((i + 0.5) / l.passageCells) * l.stateSize * 0.6;
  const source = (i: number) => l.stateX + l.stateSize * (0.7 + (0.25 * (i + 0.5)) / l.questionCells);
  const cross = { x: (aMidX + target(l.aCells[0]!)) / 2 + 4, y: (rowBottom + stateTop) / 2 };
  const height = l.stateY + l.stateSize + 28;
  const grid = [1, 2, 3].map(i => (l.stateSize * i) / 4);
  return (
    <svg viewBox={`0 0 ${l.width} ${height}`} role="img" style={svgStyle(mobile)}
      aria-label="passage のすべての token が固定サイズの state S に書き込み、質問の token が S を読み出して回答する。区間 𝒜 の token だけ β = 0 として書き込みを止める。">
      <text x={0} y={l.rowY - 8} fill={palette.muted}>passage</text>
      <text x={l.questionX} y={l.rowY - 8} fill={palette.muted}>question</text>
      {Array.from({ length: l.passageCells }, (_, i) => (
        <g key={`p${i}`}>
          <rect x={cellX(0, i)} y={l.rowY} width={l.cell} height={l.cell} fill={isA(i) ? palette.state : 'none'} opacity={isA(i) ? 0.5 : 1}
            stroke={palette.rule} strokeWidth={0.9} />
          <Arrow x1={cellX(0, i) + l.cell / 2} y1={rowBottom} x2={target(i)} y2={stateTop}
            color={isA(i) ? palette.rule : palette.muted} dashed={isA(i)} />
        </g>
      ))}
      <SvgTex x={aMidX} y={rowMid} anchor="middle" tex="\mathcal{A}" color={palette.ink} />
      {Array.from({ length: l.questionCells }, (_, i) => (
        <g key={`q${i}`}>
          <rect x={cellX(l.questionX, i)} y={l.rowY} width={l.cell} height={l.cell} fill="none" stroke={palette.rule} strokeWidth={0.9} />
          <Arrow x1={source(i)} y1={stateTop} x2={cellX(l.questionX, i) + l.cell / 2} y2={rowBottom} color={palette.muted} />
        </g>
      ))}
      <Arrow x1={questionEnd + 4} y1={rowMid} x2={answerX - 6} y2={rowMid} />
      <text x={answerX} y={rowMid} dominantBaseline="central" fill={palette.muted}>answer</text>

      {/* One fixed-size matrix, not a lane along the sequence */}
      <g stroke={palette.rule} strokeWidth={0.6}>
        {grid.map(g => <line key={`v${g}`} x1={l.stateX + g} y1={l.stateY} x2={l.stateX + g} y2={l.stateY + l.stateSize} />)}
        {grid.map(g => <line key={`h${g}`} x1={l.stateX} y1={l.stateY + g} x2={stateRight} y2={l.stateY + g} />)}
      </g>
      <rect x={l.stateX} y={l.stateY} width={l.stateSize} height={l.stateSize} fill="#0d0d0d" fillOpacity={0.6} stroke={palette.state} strokeWidth={0.9} />
      <SvgTex x={l.stateX + l.stateSize / 2} y={stateMid} anchor="middle" tex="S" color={palette.ink} scale={1.8} />
      <SvgTex x={l.stateX + l.stateSize / 2} y={l.stateY + l.stateSize + 14} anchor="middle" tex="d_k \times d_v" color={palette.muted} />

      <g stroke={palette.ink} strokeWidth={1.4}>
        <line x1={cross.x - 5} y1={cross.y - 5} x2={cross.x + 5} y2={cross.y + 5} />
        <line x1={cross.x - 5} y1={cross.y + 5} x2={cross.x + 5} y2={cross.y - 5} />
      </g>
      <SvgTex x={cross.x + 10} y={cross.y} tex="\beta = 0" color={palette.ink} />
      <text x={0} y={(rowBottom + stateTop) / 2 + 14} fill={palette.muted}>write</text>
      <text x={questionEnd - 20} y={(rowBottom + stateTop) / 2 + 14} fill={palette.muted}>read</text>

    </svg>
  );
}

export function IndependentQuestionsFigure() {
  return <Figure id="independent-questions" desktop={<IndependentQuestions mobile={false} />} mobile={<IndependentQuestions mobile />} />;
}

export function WriteInterventionFigure() {
  return <Figure id="write-intervention" desktop={<WriteIntervention mobile={false} />} mobile={<WriteIntervention mobile />} />;
}

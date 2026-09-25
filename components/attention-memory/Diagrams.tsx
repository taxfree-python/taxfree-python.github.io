import type { CSSProperties } from 'react';
import { Figure } from '@/components/article/Figure';
import { palette, roleColors, roles, type Role } from './palette';

const questionLabels: Record<Role, string> = {
  same_fact_a: 'Q1 · same fact',
  same_fact_b: 'Q2 · paraphrase',
  other_fact: 'Q3 · other fact',
};

function svgStyle(mobile: boolean): CSSProperties {
  return { width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit', fontSize: mobile ? 11 : 13 };
}

/** Thin line with an open head at (x2, y2), in the style of the matplotlib schematics. */
function Arrow({ x1, y1, x2, y2, color = palette.muted }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 5;
  const wing = (sign: number) =>
    `${x2 - head * Math.cos(angle + sign * 0.5)},${y2 - head * Math.sin(angle + sign * 0.5)}`;
  return (
    <g stroke={color} strokeWidth={0.9} fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
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
      <text x={(a[0] + a[1]) / 2} y={y + h / 2} dominantBaseline="central" textAnchor="middle" fill={palette.ink} fontStyle="italic">A</text>
    </g>
  );
}

const independentLayout = {
  desktop: { width: 800, rowGap: 48, boxH: 28, s0: [0, 44] as Span, passage: [84, 500] as Span, a: [262, 306] as Span, question: [520, 690] as Span, answer: 716 },
  mobile: { width: 340, rowGap: 40, boxH: 24, s0: [0, 28] as Span, passage: [52, 168] as Span, a: [110, 132] as Span, question: [180, 284] as Span, answer: 298 },
};

function IndependentQuestions({ mobile }: { mobile: boolean }) {
  const l = mobile ? independentLayout.mobile : independentLayout.desktop;
  const top = 4;
  const height = top * 2 + l.rowGap * 2 + l.boxH;
  const s0Mid = top + l.rowGap + l.boxH / 2;
  return (
    <svg viewBox={`0 0 ${l.width} ${height}`} role="img" style={svgStyle(mobile)}
      aria-label="同じ初期 state から 3 問に分かれ、それぞれ共通の passage、異なる質問、回答の順に処理される。">
      <rect x={l.s0[0] + 0.5} y={s0Mid - l.boxH / 2} width={l.s0[1] - l.s0[0] - 1} height={l.boxH} fill="none" stroke={palette.state} strokeWidth={0.9} />
      <text x={(l.s0[0] + l.s0[1]) / 2} y={s0Mid} dominantBaseline="central" textAnchor="middle" fill={palette.ink}>
        <tspan fontStyle="italic">S</tspan>₀
      </text>
      {roles.map((role, index) => {
        const y = top + index * l.rowGap;
        const mid = y + l.boxH / 2;
        return (
          <g key={role}>
            <Arrow x1={l.s0[1]} y1={s0Mid} x2={l.passage[0]} y2={mid} />
            <Passage x={l.passage} y={y} h={l.boxH} a={l.a} />
            <Arrow x1={l.passage[1]} y1={mid} x2={l.question[0]} y2={mid} />
            <rect x={l.question[0]} y={y} width={l.question[1] - l.question[0]} height={l.boxH} fill="none"
              stroke={roleColors[role]} strokeWidth={0.9} strokeDasharray={role === 'same_fact_b' ? '4 3' : undefined} />
            <text x={l.question[0] + 8} y={mid} dominantBaseline="central" fill={palette.ink}>{questionLabels[role]}</text>
            <Arrow x1={l.question[1]} y1={mid} x2={l.answer - 6} y2={mid} />
            <text x={l.answer} y={mid} dominantBaseline="central" fill={palette.muted}>answer</text>
          </g>
        );
      })}
    </svg>
  );
}

const interventionLayout = {
  desktop: { width: 800, boxH: 28, passage: [0, 460] as Span, a: [202, 248] as Span, question: [480, 640] as Span, answer: 666, stateX: 350, stateY: 72, stateSize: 40, predictY: 166, predictX: [0, 110, 330, 550], predictRows: false },
  mobile: { width: 340, boxH: 24, passage: [0, 200] as Span, a: [110, 134] as Span, question: [212, 286] as Span, answer: 300, stateX: 158, stateY: 62, stateSize: 32, predictY: 140, predictX: [0, 0, 0, 0], predictRows: true },
};

/** Down arrow for a drop in likelihood, a flat dash for little change. */
function Change({ x, y, drop }: { x: number; y: number; drop: boolean }) {
  return drop
    ? <Arrow x1={x + 5} y1={y - 7} x2={x + 5} y2={y + 6} color={palette.ink} />
    : <line x1={x} y1={y} x2={x + 10} y2={y} stroke={palette.ink} strokeWidth={0.9} />;
}

function WriteIntervention({ mobile }: { mobile: boolean }) {
  const l = mobile ? interventionLayout.mobile : interventionLayout.desktop;
  const mid = l.boxH / 2 + 1;
  const writeX = (l.a[0] + l.a[1]) / 2;
  const tokenBottom = 1 + l.boxH;
  const stateMid = l.stateY + l.stateSize / 2;
  const stateRight = l.stateX + l.stateSize;
  const readX = (l.question[0] + l.question[1]) / 2;
  const cross = { x: (writeX + l.stateX) / 2, y: (tokenBottom + stateMid) / 2 };
  const rowStep = 20;
  const height = l.predictRows ? l.predictY + rowStep * 3 + 4 : l.predictY + 10;
  const cells = [1, 2, 3].map(i => l.stateX + (l.stateSize * i) / 4);
  return (
    <svg viewBox={`0 0 ${l.width} ${height}`} role="img" style={svgStyle(mobile)}
      aria-label="区間 A の delta update が固定サイズの state S に書き込み、質問が S を読み出して回答する。区間 A で β = 0 とすると、同じ事実の 2 問では正答の尤度が下がり、別の事実の 1 問ではほとんど変わらない。">
      <Passage x={l.passage} y={1} h={l.boxH} a={l.a} />
      <rect x={l.question[0]} y={1} width={l.question[1] - l.question[0]} height={l.boxH} fill="none" stroke={palette.rule} strokeWidth={0.9} />
      <text x={readX} y={mid} dominantBaseline="central" textAnchor="middle" fill={palette.ink}>question</text>
      <Arrow x1={l.question[1]} y1={mid} x2={l.answer - 6} y2={mid} />
      <text x={l.answer} y={mid} dominantBaseline="central" fill={palette.muted}>answer</text>

      {/* One fixed-size matrix, not a lane along the sequence */}
      <g stroke={palette.rule} strokeWidth={0.6}>
        {cells.map(c => <line key={`v${c}`} x1={c} y1={l.stateY} x2={c} y2={l.stateY + l.stateSize} />)}
        {cells.map(c => <line key={`h${c}`} x1={l.stateX} y1={c - l.stateX + l.stateY} x2={stateRight} y2={c - l.stateX + l.stateY} />)}
      </g>
      <rect x={l.stateX} y={l.stateY} width={l.stateSize} height={l.stateSize} fill="none" stroke={palette.state} strokeWidth={0.9} />
      <text x={l.stateX + l.stateSize / 2} y={stateMid} dominantBaseline="central" textAnchor="middle" fill={palette.ink} fontStyle="italic">S</text>
      <text x={l.stateX + l.stateSize / 2} y={l.stateY + l.stateSize + 12} dominantBaseline="central" textAnchor="middle" fill={palette.muted}>
        <tspan fontStyle="italic">d</tspan><tspan fontSize="0.75em" dy="0.3em">k</tspan><tspan dy="-0.3em"> × </tspan><tspan fontStyle="italic">d</tspan><tspan fontSize="0.75em" dy="0.3em">v</tspan>
      </text>

      <Arrow x1={writeX} y1={tokenBottom} x2={l.stateX} y2={stateMid} color={palette.state} />
      <g stroke={palette.ink} strokeWidth={1.4}>
        <line x1={cross.x - 5} y1={cross.y - 5} x2={cross.x + 5} y2={cross.y + 5} />
        <line x1={cross.x - 5} y1={cross.y + 5} x2={cross.x + 5} y2={cross.y - 5} />
      </g>
      <text x={cross.x - 12} y={cross.y + 4} dominantBaseline="central" textAnchor="end" fill={palette.ink}>
        <tspan fontStyle="italic">β</tspan> = 0
      </text>
      <text x={cross.x + 10} y={cross.y - 8} dominantBaseline="central" fill={palette.muted}>write</text>

      <Arrow x1={stateRight} y1={stateMid} x2={readX} y2={tokenBottom} />
      <text x={(stateRight + readX) / 2 + 10} y={cross.y + 4} dominantBaseline="central" fill={palette.muted}>read</text>

      <text x={l.predictX[0]} y={l.predictY} dominantBaseline="central" fill={palette.muted}>
        Δ log <tspan fontStyle="italic">p</tspan>
      </text>
      {roles.map((role, index) => {
        const x = l.predictRows ? 0 : l.predictX[index + 1]!;
        const y = l.predictRows ? l.predictY + rowStep * (index + 1) : l.predictY;
        return (
          <g key={role}>
            <Change x={x} y={y} drop={role !== 'other_fact'} />
            <text x={x + 18} y={y} dominantBaseline="central" fill={roleColors[role]}>{questionLabels[role]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function IndependentQuestionsFigure() {
  return <Figure id="independent-questions" desktop={<IndependentQuestions mobile={false} />} mobile={<IndependentQuestions mobile />} />;
}

export function WriteInterventionFigure() {
  return <Figure id="write-intervention" desktop={<WriteIntervention mobile={false} />} mobile={<WriteIntervention mobile />} />;
}

import type { CSSProperties } from 'react';
import { Figure } from '@/components/article/Figure';
import { palette, questionLabels, roleColors, roles } from './palette';
import { SvgTex } from './TeX';

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


/** Positions 1–6, an ellipsis, then t, so the last box does not read as t = 8. */
const tokenLabels = ['1', '2', '3', '4', '5', '6', '\\cdots', 't'];
const isEllipsis = (p: string) => p === '\\cdots';

/**
 * Figure 1, laid out as the matplotlib schematic it replaces: coordinates are that figure's
 * axes fractions (axes at [.055, .06, .89, .81] of a 9.6 × 4.8 in or 4.5 × 6.1 in canvas).
 */
const memoryFrames = {
  desktop: { width: 800, canvasH: 400, height: 336 },
  mobile: { width: 340, canvasH: 461, height: 344 },
};

function MemoryMap({ mobile }: { mobile: boolean }) {
  const f = mobile ? memoryFrames.mobile : memoryFrames.desktop;
  // The dropped "SCHEMATIC" label left an empty band on top; shift everything up by it.
  const top = mobile ? 0.085 : 0.128;
  const X = (x: number) => f.width * (0.055 + 0.89 * x);
  const Y = (y: number) => f.canvasH * (1 - (0.06 + 0.81 * y)) - f.canvasH * top;
  const W = (w: number) => f.width * 0.89 * w;
  const H = (h: number) => f.canvasH * 0.81 * h;
  const [start, end] = mobile ? [0.14, 0.96] : [0.24, 0.76];
  const center = (start + end) / 2;
  const step = (end - start) / 8;
  const line = (points: [number, number][]) => (
    <polyline points={points.map(([x, y]) => `${X(x)},${Y(y)}`).join(' ')} fill="none" stroke={palette.muted} strokeWidth={0.9} />
  );
  const arrow = (x1: number, y1: number, x2: number, y2: number) => <Arrow x1={X(x1)} y1={Y(y1)} x2={X(x2)} y2={Y(y2)} />;
  const small = mobile ? '0.8em' : '0.85em';
  const title = mobile ? '1.1em' : '1.15em';

  const cache = (x: number, y: number, width: number, height: number) => {
    const dx = width / 8;
    return (
      <g>
        {tokenLabels.map((p, i) => {
          const px = x - width / 2 + (i + 0.5) * dx;
          return (
            <g key={p}>
              {isEllipsis(p)
                ? [-1, 1].map(sign => <SvgTex key={sign} x={X(px)} y={Y(y + sign * 0.65 * height)} anchor="middle" tex="\cdots" color={palette.muted} />)
                : [-1, 1].map(sign => (
                  <rect key={sign} x={X(px - 0.4 * dx)} y={Y(y + sign * 0.65 * height + height / 2)} width={W(0.8 * dx)} height={H(height)}
                    fill={palette.state} opacity={0.7} />
                ))}
              {!isEllipsis(p) && <SvgTex x={X(px)} y={Y(y - 1.85 * height) + 6} anchor="middle" tex={p} color={palette.muted} scale={0.75} />}
            </g>
          );
        })}
        {([['K', 1], ['V', -1]] as const).map(([label, sign]) => (
          <text key={label} x={X(x - width / 2 - 0.017)} y={Y(y + sign * 0.65 * height)} textAnchor="end" dominantBaseline="central"
            fill={palette.muted} fontSize={small}>{label}</text>
        ))}
      </g>
    );
  };
  const fixedSize = (x: number, y: number) => (
    <g>
      <SvgTex x={X(x) - 4} y={y} anchor="end" tex="d_k\times d_v" color={palette.muted} scale={0.9} />
      <text x={X(x)} y={y} dominantBaseline="central" fill={palette.muted}>· fixed size</text>
    </g>
  );

  const tokens = tokenLabels.map((p, i) => {
    const x = start + (i + 0.5) * step;
    return (
      <g key={p}>
        {!isEllipsis(p) && <rect x={X(x - step * 0.42)} y={Y(0.99)} width={W(step * 0.84)} height={H(0.08)} fill="none" stroke={palette.muted} strokeWidth={0.9} />}
        <SvgTex x={X(x)} y={Y(0.95)} anchor="middle" tex={isEllipsis(p) ? '\\cdots' : `x_{${p}}`} color={palette.ink} scale={1.05} />
      </g>
    );
  });

  const body = mobile ? (
    <g>
      <text x={X(0.06)} y={Y(1.035)} dominantBaseline="central" fill={palette.muted}>Input tokens</text>
      {tokens}
      {line([[center, 0.91], [center, 0.86], [0.015, 0.86], [0.015, 0.265]])}
      {[0.65, 0.265].map((y, i) => (
        <g key={y}>
          {arrow(0.015, y, 0.09, y)}
          <text x={X(0.1)} y={Y(y + 0.12)} fill={palette.ink} fontSize={title}>{i === 0 ? 'Softmax attention' : 'GDN / KDA'}</text>
          {i === 0 ? (
            <g>
              {cache(0.37, y, 0.48, 0.035)}
              <text x={X(0.37)} y={Y(y - 0.11) + 5} textAnchor="middle" fill={palette.muted}>KV cache</text>
            </g>
          ) : (
            <g>
              <rect x={X(0.23)} y={Y(y + 0.055)} width={W(0.28)} height={H(0.11)} fill="none" stroke={palette.state} strokeWidth={0.9} />
              <SvgTex x={X(0.37)} y={Y(y)} anchor="middle" tex="S_t" color={palette.ink} scale={1.6} />
              {fixedSize(0.37 - 0.05, Y(y - 0.1) - 4)}
            </g>
          )}
          {arrow(0.66, y, 0.9, y)}
          <SvgTex x={X(0.78)} y={Y(y + 0.105) - 5} anchor="middle" tex="q_t" color={palette.muted} scale={1.1} />
          {arrow(0.78, y + 0.082, 0.78, y + 0.007)}
          {i === 0
            ? <text x={X(0.78)} y={Y(y - 0.045)} textAnchor="middle" fill={palette.muted}>softmax</text>
            : <SvgTex x={X(0.78)} y={Y(y - 0.045) - 4} anchor="middle" tex="S_t^\top q_t" color={palette.muted} />}
          <SvgTex x={X(0.955)} y={Y(y)} anchor="middle" tex="o_t" color={palette.ink} scale={1.2} />
        </g>
      ))}
    </g>
  ) : (
    <g>
      <text x={X(0.04)} y={Y(0.95)} dominantBaseline="central" fill={palette.muted}>Input tokens</text>
      {tokens}
      {line([[center, 0.91], [center, 0.82]])}
      {line([[0.25, 0.82], [0.75, 0.82]])}
      {[0.25, 0.75].map((x, i) => (
        <g key={x}>
          {arrow(x, 0.82, x, 0.73)}
          <text x={X(x)} y={Y(0.665)} textAnchor="middle" dominantBaseline="central" fill={palette.ink} fontSize={title}>
            {i === 0 ? 'Softmax attention' : 'GDN / KDA'}
          </text>
          {i === 0 ? (
            <g>
              {cache(x, 0.48, 0.36, 0.042)}
              <text x={X(x)} y={Y(0.325)} textAnchor="middle" fill={palette.muted}>KV cache</text>
            </g>
          ) : (
            <g>
              <rect x={X(x - 0.095)} y={Y(0.555)} width={W(0.19)} height={H(0.15)} fill="none" stroke={palette.state} strokeWidth={0.9} />
              <SvgTex x={X(x)} y={Y(0.48)} anchor="middle" tex="S_t" color={palette.ink} scale={1.7} />
              {fixedSize(x - 0.03, Y(0.325) - 4)}
            </g>
          )}
          {arrow(x, 0.27, x, 0.07)}
          <SvgTex x={X(x - 0.16)} y={Y(0.17)} anchor="middle" tex="q_t" color={palette.muted} scale={1.1} />
          {arrow(x - 0.13, 0.17, x - 0.01, 0.17)}
          {i === 0
            ? <text x={X(x + 0.035)} y={Y(0.17)} dominantBaseline="central" fill={palette.muted}>softmax</text>
            : <SvgTex x={X(x + 0.035)} y={Y(0.17)} tex="S_t^\top q_t" color={palette.muted} />}
          <SvgTex x={X(x)} y={Y(0.01)} anchor="middle" tex="o_t" color={palette.ink} scale={1.2} />
        </g>
      ))}
    </g>
  );
  return (
    <svg viewBox={`0 0 ${f.width} ${f.height}`} role="img" style={svgStyle(mobile)}
      aria-label="同じ 8 token の入力から softmax attention と GDN / KDA に分岐する。Softmax attention は token ごとの KV cache、GDN / KDA は固定サイズの状態 S を保持し、query に対する出力を計算する。">
      {body}
    </svg>
  );
}

const onlineLayout = {
  desktop: { width: 800, offset: 70, xs: [22, 200, 378, 580, 650], halfW: [22, 10, 8, 8, 10], y: 76 },
  mobile: { width: 340, offset: 0, x: 130, ys: [16, 90, 164, 238, 280], halfH: 12 },
};

const onlineSteps = [
  { name: 'decay', input: '\\alpha_t', out: '\\alpha_t S_{t-1}' },
  { name: 'residual', input: 'k_t,\\ v_t', out: 'v_t-\\widetilde S_t^\\top k_t' },
  { name: 'delta update', input: '\\beta_t,\\ k_t', out: '\\beta_t k_t e_t^\\top' },
];
const onlineNodes = ['S_{t-1}', '\\widetilde S_t', 'e_t', null, 'S_t'];

/** Circled plus for the final sum. */
function Sum({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={palette.muted} strokeWidth={0.9} fill="none">
      <circle cx={x} cy={y} r={8} />
      <line x1={x - 4.5} y1={y} x2={x + 4.5} y2={y} />
      <line x1={x} y1={y - 4.5} x2={x} y2={y + 4.5} />
    </g>
  );
}

/** Figure 2: one GDN head, one token. Each arrow is labelled below with the quantity it produces. */
function OnlineLearning({ mobile }: { mobile: boolean }) {
  const label = 'GDN の状態更新。前の状態から decay、residual、delta update を順につなぎ、decay 後の状態を別経路で最後の加算に渡す。';
  if (mobile) {
    const { x, ys, halfH, width } = onlineLayout.mobile;
    const bypass = width - 50;
    const height = ys[4]! + 16;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} role="img" style={svgStyle(true)} aria-label={label}>
        {onlineNodes.map((tex, i) => tex
          ? <SvgTex key={i} x={x} y={ys[i]!} anchor="middle" tex={tex} color={palette.ink} scale={1.3} />
          : <Sum key={i} x={x} y={ys[i]!} />)}
        {ys.slice(0, -1).map((y, i) => (
          <Arrow key={i} x1={x} y1={y + (i === 3 ? 8 : halfH)} x2={x} y2={ys[i + 1]! - (i === 2 ? 10 : halfH)} />
        ))}
        {onlineSteps.map((s, i) => {
          const mid = (ys[i]! + ys[i + 1]!) / 2;
          return (
            <g key={s.name}>
              <SvgTex x={x - 44} y={mid} anchor="end" tex={s.input} color={palette.muted} />
              <Arrow x1={x - 40} y1={mid} x2={x - 3} y2={mid} />
              <text x={x + 18} y={mid - 10} dominantBaseline="central" fill={palette.muted}>{s.name}</text>
              <SvgTex x={x + 18} y={mid + 9} tex={s.out} color={palette.ink} />
            </g>
          );
        })}
        {/* The decayed state also goes straight to the final sum. */}
        <g stroke={palette.muted} strokeWidth={0.9} fill="none">
          <polyline points={`${x + 14},${ys[1]} ${bypass},${ys[1]} ${bypass},${ys[3]}`} />
        </g>
        <Arrow x1={bypass} y1={ys[3]!} x2={x + 9} y2={ys[3]!} />
      </svg>
    );
  }
  const { xs, halfW, y, width, offset } = onlineLayout.desktop;
  const bypassY = y + 58;
  const height = bypassY + 8;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" style={svgStyle(false)} aria-label={label}>
      <g transform={`translate(${offset} 0)`}>
      {onlineNodes.map((tex, i) => tex
        ? <SvgTex key={i} x={xs[i]!} y={y} anchor="middle" tex={tex} color={palette.ink} scale={1.3} />
        : <Sum key={i} x={xs[i]!} y={y} />)}
      {xs.slice(0, -1).map((x, i) => (
        <Arrow key={i} x1={x + halfW[i]! + 8} y1={y} x2={xs[i + 1]! - halfW[i + 1]! - (i === 2 ? 2 : 8)} y2={y} />
      ))}
      {onlineSteps.map((s, i) => {
        const mid = (xs[i]! + xs[i + 1]!) / 2;
        return (
          <g key={s.name}>
            <text x={mid} y={y - 62} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>{s.name}</text>
            <SvgTex x={mid} y={y - 40} anchor="middle" tex={s.input} color={palette.muted} />
            <Arrow x1={mid} y1={y - 30} x2={mid} y2={y - 3} />
            <SvgTex x={mid} y={y + 22} anchor="middle" tex={s.out} color={palette.ink} />
          </g>
        );
      })}
      {/* The decayed state also goes straight to the final sum. */}
      <g stroke={palette.muted} strokeWidth={0.9} fill="none">
        <polyline points={`${xs[1]},${y + 16} ${xs[1]},${bypassY} ${xs[3]},${bypassY}`} />
      </g>
      <Arrow x1={xs[3]!} y1={bypassY} x2={xs[3]!} y2={y + 9} />
      </g>
    </svg>
  );
}

/**
 * Figure 4: boxes are states only; an edge is "read these tokens and update the state".
 * The passage edge carries a strip of token cells with span A shaded, as in figure 6.
 */
const independentLayout = {
  desktop: { width: 800, rowGap: 46, state: 40, s0X: 70, spX: 400, cell: 12, gap: 3, cells: 12, aCells: [6, 7], fanX: 520, qEnd: 690 },
  mobile: { width: 340, rowGap: 40, state: 30, s0X: 4, spX: 164, cell: 8, gap: 2, cells: 10, aCells: [5, 6], fanX: 232, qEnd: 292 },
};

/** A small fixed-size state: the same grid-in-a-square used for S in figure 6. */
function StateBox({ x, y, size, tex, scale = 1, color = palette.state }: { x: number; y: number; size: number; tex: string; scale?: number; color?: string }) {
  const grid = [1, 2, 3].map(i => (size * i) / 4);
  return (
    <g>
      <g stroke={palette.rule} strokeWidth={0.6}>
        {grid.map(g => <line key={`v${g}`} x1={x + g} y1={y} x2={x + g} y2={y + size} />)}
        {grid.map(g => <line key={`h${g}`} x1={x} y1={y + g} x2={x + size} y2={y + g} />)}
      </g>
      <rect x={x} y={y} width={size} height={size} fill="#0d0d0d" fillOpacity={0.6} stroke={color} strokeWidth={0.9} />
      <SvgTex x={x + size / 2} y={y + size / 2} anchor="middle" tex={tex} color={palette.ink} scale={scale} />
    </g>
  );
}

function IndependentQuestions({ mobile }: { mobile: boolean }) {
  const l = mobile ? independentLayout.mobile : independentLayout.desktop;
  const top = 16;
  const rowMid = (index: number) => top + l.state / 2 + index * l.rowGap;
  const mid = rowMid(1);
  const height = rowMid(2) + l.state / 2 + 6;
  const step = l.cell + l.gap;
  const stripWidth = l.cells * step - l.gap;
  const edgeStart = l.s0X + l.state;
  const stripX = (edgeStart + l.spX) / 2 - stripWidth / 2;
  const stripY = mid - l.cell - 6;
  const aStart = stripX + l.aCells[0]! * step;
  const aEnd = stripX + (l.aCells[l.aCells.length - 1]! + 1) * step - l.gap;
  const spRight = l.spX + l.state;
  return (
    <svg viewBox={`0 0 ${l.width} ${height}`} role="img" style={svgStyle(mobile)}
      aria-label="初期 state から passage を読んで state を更新し、その state から 3 つの質問に分かれて回答する。">
      <StateBox x={l.s0X} y={mid - l.state / 2} size={l.state} tex="S_0" />
      <Arrow x1={edgeStart + 4} y1={mid} x2={l.spX - 4} y2={mid} />
      {Array.from({ length: l.cells }, (_, i) => {
        const inA = l.aCells.includes(i);
        return <rect key={i} x={stripX + i * step} y={stripY} width={l.cell} height={l.cell}
          fill={inA ? palette.state : 'none'} opacity={inA ? 0.6 : 1} stroke={palette.muted} strokeWidth={0.7} />;
      })}
      {/* The edge reads the whole passage; A is only marked inside it */}
      <SvgTex x={(aStart + aEnd) / 2} y={stripY - 10} anchor="middle" tex="\mathcal{A}" color={palette.ink} scale={0.85} />
      <text x={(edgeStart + l.spX) / 2} y={mid + 16} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>passage</text>
      <StateBox x={l.spX} y={mid - l.state / 2} size={l.state} tex="S_P" />
      {roles.map((role, index) => {
        const y = rowMid(index);
        return (
          <g key={role}>
            <line x1={spRight + 4} y1={mid} x2={l.fanX} y2={y} stroke={palette.muted} strokeWidth={0.9} />
            <Arrow x1={l.fanX} y1={y} x2={l.qEnd} y2={y} />
            <text x={(l.fanX + l.qEnd) / 2} y={y - 7} textAnchor="middle" fill={roleColors[role]}>{questionLabels[role]}</text>
            <text x={l.qEnd + 8} y={y} dominantBaseline="central" fill={palette.muted}>answer</text>
          </g>
        );
      })}
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
            stroke={palette.muted} strokeWidth={0.9} />
          <Arrow x1={cellX(0, i) + l.cell / 2} y1={rowBottom} x2={target(i)} y2={stateTop}
            color={isA(i) ? palette.rule : palette.muted} dashed={isA(i)} />
        </g>
      ))}
      <SvgTex x={aMidX} y={rowMid} anchor="middle" tex="\mathcal{A}" color={palette.ink} />
      {Array.from({ length: l.questionCells }, (_, i) => (
        <g key={`q${i}`}>
          <rect x={cellX(l.questionX, i)} y={l.rowY} width={l.cell} height={l.cell} fill="none" stroke={palette.muted} strokeWidth={0.9} />
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

const patchingLayout = {
  desktop: {
    width: 800, offset: 88, labelX: 16, x0: 44, cell: 22, gap: 4, passageCells: 14, span: [3, 4, 5], questionGap: 30, questionCells: 5,
    rowTop: 30, kvH: 8, kvGap: 2, state: 34, conv: 9, convGap: 2, stateX: 300, arrowLen: 48, pairGap: 7, stateScale: 1,
  },
  mobile: {
    width: 340, offset: 0, labelX: 10, x0: 24, cell: 14, gap: 3, passageCells: 10, span: [2, 3, 4], questionGap: 17, questionCells: 3,
    rowTop: 26, kvH: 6, kvGap: 2, state: 26, conv: 6, convGap: 2, stateX: 180, arrowLen: 40, pairGap: 6, stateScale: 0.8,
  },
};

/**
 * Figure 8: the two runs of activation patching. Each run hands its carriers of span A forward: the
 * GDN state (with the conv buffer) at the end of the span, and the softmax K/V at the span positions.
 * Patching copies one carrier between runs; the span's own residual stream has no arrow.
 */
function PatchingSchematic({ mobile }: { mobile: boolean }) {
  const l = mobile ? patchingLayout.mobile : patchingLayout.desktop;
  const step = l.cell + l.gap;
  const cellX = (x0: number, i: number) => x0 + i * step;
  const passageEnd = cellX(l.x0, l.passageCells) - l.gap;
  const questionX = passageEnd + l.questionGap;
  const questionEnd = cellX(questionX, l.questionCells) - l.gap;
  const spanStart = cellX(l.x0, l.span[0]!);
  const spanEnd = cellX(l.x0, l.span[l.span.length - 1]! + 1) - l.gap;
  const spanMid = (spanStart + spanEnd) / 2;
  const boundary = spanEnd + l.gap / 2;
  const kvBlock = 2 * l.kvH + l.kvGap;
  const convWidth = 3 * l.conv + 2 * l.convGap;
  const convX = l.stateX + l.state + 6;
  const stateMid = (l.stateX + convX + convWidth) / 2;

  const topRow = l.rowTop;
  const topCarrier = topRow + l.cell + 6;
  const arrowTop = topCarrier + l.state + 6;
  const bottomCarrier = arrowTop + l.arrowLen + 6;
  const bottomRow = bottomCarrier + l.state + 6;
  const height = bottomRow + l.cell + 6;

  const run = (rowY: number, carrierY: number, below: boolean, i: 0 | 1) => {
    const kvY = below ? carrierY : carrierY + l.state - kvBlock;
    const rowEdge = below ? rowY + l.cell : rowY;
    const sMid = carrierY + l.state / 2;
    // A and its replacement A' carry different content: shade them apart, not only by the prime
    const spanFill = i === 0 ? palette.state : palette.substitute;
    return (
      <g>
        <SvgTex x={l.labelX} y={rowY + l.cell / 2} anchor="middle" tex={i === 0 ? 'P' : "P'"} color={palette.ink} />
        {Array.from({ length: l.passageCells }, (_, c) => {
          const inA = l.span.includes(c);
          return <rect key={c} x={cellX(l.x0, c)} y={rowY} width={l.cell} height={l.cell}
            fill={inA ? spanFill : 'none'} fillOpacity={inA ? 0.5 : 1} stroke={palette.muted} strokeWidth={0.9} />;
        })}
        <SvgTex x={spanMid} y={rowY + l.cell / 2} anchor="middle" tex={i === 0 ? '\\mathcal{A}' : "\\mathcal{A}'"} color={palette.ink} scale={mobile ? 0.85 : 1} />
        {Array.from({ length: l.questionCells }, (_, c) => (
          <rect key={c} x={cellX(questionX, c)} y={rowY} width={l.cell} height={l.cell} fill="none" stroke={palette.muted} strokeWidth={0.9} />
        ))}
        <Arrow x1={questionEnd + 4} y1={rowY + l.cell / 2} x2={questionEnd + 30} y2={rowY + l.cell / 2} />
        <SvgTex x={questionEnd + 36} y={rowY + l.cell / 2} tex={i === 0 ? 'r' : "r'"} color={palette.ink} />

        {/* K/V entries at the span positions */}
        {l.span.map(c => [0, 1].map(k => (
          <rect key={`${c}${k}`} x={cellX(l.x0, c) + 2} y={kvY + k * (l.kvH + l.kvGap)} width={l.cell - 4} height={l.kvH}
            fill={spanFill} fillOpacity={0.35} stroke={spanFill} strokeWidth={0.6} />
        )))}
        {/* GDN state (and conv cache) handed on from the end of the span */}
        <polyline points={`${boundary},${rowEdge} ${boundary},${sMid}`} fill="none" stroke={palette.muted} strokeWidth={0.9} />
        <Arrow x1={boundary} y1={sMid} x2={l.stateX - 3} y2={sMid} />
        <StateBox x={l.stateX} y={carrierY} size={l.state} tex={i === 0 ? 'S' : "S'"} scale={l.stateScale} color={spanFill} />
        {[0, 1, 2].map(k => (
          <rect key={k} x={convX + k * (l.conv + l.convGap)} y={sMid - l.conv / 2} width={l.conv} height={l.conv}
            fill="none" stroke={spanFill} strokeWidth={0.9} />
        ))}
      </g>
    );
  };

  const pair = (x: number, y1: number, y2: number) => (
    <g>
      <Arrow x1={x - l.pairGap} y1={y1} x2={x - l.pairGap} y2={y2} />
      <Arrow x1={x + l.pairGap} y1={y2} x2={x + l.pairGap} y2={y1} />
      <text x={x - l.pairGap - 6} y={(y1 + y2) / 2} textAnchor="end" dominantBaseline="central" fill={palette.muted}>denoise</text>
      <text x={x + l.pairGap + 6} y={(y1 + y2) / 2} dominantBaseline="central" fill={palette.muted}>noise</text>
    </g>
  );

  return (
    <svg viewBox={`0 0 ${l.width} ${height}`} role="img" style={svgStyle(mobile)}
      aria-label="P と P' の 2 つの run。区間の直後の GDN の state と畳み込みのバッファ、区間の位置の K/V のどちらかを、denoising では P から P' へ、noising では P' から P へ差し替える。">
      <g transform={`translate(${l.offset} 0)`}>
        <text x={l.x0} y={topRow - 8} fill={palette.muted}>passage</text>
        <text x={questionX} y={topRow - 8} fill={palette.muted}>question</text>
        {run(topRow, topCarrier, true, 0)}
        {run(bottomRow, bottomCarrier, false, 1)}
        <text x={spanStart - 6} y={topCarrier + kvBlock / 2} textAnchor="end" dominantBaseline="central" fill={palette.muted}>K/V</text>
        <text x={convX + convWidth + 6} y={topCarrier + l.state / 2} dominantBaseline="central" fill={palette.muted}>conv</text>
        {pair(spanMid, topCarrier + kvBlock + 4, bottomCarrier + l.state - kvBlock - 4)}
        {pair(stateMid, arrowTop - 2, bottomCarrier - 4)}
      </g>
    </svg>
  );
}

export function PatchingSchematicFigure() {
  return <Figure id="patching-schematic" desktop={<PatchingSchematic mobile={false} />} mobile={<PatchingSchematic mobile />} />;
}

export function IndependentQuestionsFigure() {
  return <Figure id="independent-questions" desktop={<IndependentQuestions mobile={false} />} mobile={<IndependentQuestions mobile />} />;
}

export function WriteInterventionFigure() {
  return <Figure id="write-intervention" desktop={<WriteIntervention mobile={false} />} mobile={<WriteIntervention mobile />} />;
}

export function MemoryFigure() {
  return <Figure id="memory" desktop={<MemoryMap mobile={false} />} mobile={<MemoryMap mobile />} />;
}

export function OnlineLearningFigure() {
  return <Figure id="online-learning" desktop={<OnlineLearning mobile={false} />} mobile={<OnlineLearning mobile />} />;
}

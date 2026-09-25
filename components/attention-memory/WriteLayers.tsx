'use client';

import { useState } from 'react';
import CaseNavigation from './CaseNavigation';
import { Tex, SvgTex } from './TeX';
import styles from './MemoryCard.module.css';
import { palette, questionLabels, roleColors, roles, type Role } from './palette';
import { drawOrder, QuestionLegend, QuestionMark, signed, svgStyle } from './marks';
import type { FollowupTriplet } from './Followup';

const defaultLayer = 26;
const niceSteps = [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];

/**
 * Layer axis for the single-layer run plus two all-layer columns (A, control). Without
 * single-layer data (`selected` null) only the two columns are drawn.
 */
function WriteLayersPlot({ triplet, selected, mobile }: { triplet: FollowupTriplet; selected: number | null; mobile: boolean }) {
  const single = triplet.singleLayerA;
  const width = mobile ? 340 : 800, height = mobile ? 280 : 320;
  const top = mobile ? 74 : 62;
  const box = single
    ? { left: mobile ? 40 : 56, right: width - (mobile ? 104 : 150), top, bottom: height - (mobile ? 42 : 46) }
    : { left: width / 2 - (mobile ? 90 : 110), right: width / 2 - (mobile ? 90 : 110), top, bottom: height - (mobile ? 42 : 46) };
  // Two columns to the right of the layer axis: all 24 layers at once, for A and for the control span.
  const columns = single
    ? { A: box.right + (mobile ? 36 : 56), control: box.right + (mobile ? 80 : 118) }
    : { A: box.left + (mobile ? 50 : 70), control: box.left + (mobile ? 120 : 160) };
  const x = (layer: number) => box.left + layer / 30 * (box.right - box.left);
  const { A, control } = triplet.allLayer;
  const values = [0, ...(single ?? []).flatMap(l => roles.map(r => l.delta[r])), ...roles.flatMap(r => [A.delta[r], control.delta[r]])];
  const lo = Math.min(...values), hi = Math.max(...values);
  const step = niceSteps.find(s => (hi - lo) / s <= 5) ?? 20;
  const pad = (hi - lo) * 0.06;
  const [y0, y1] = [lo - pad, hi + pad];
  const y = (value: number) => box.bottom - (value - y0) / (y1 - y0) * (box.bottom - box.top);
  const ticks: number[] = [];
  for (let t = Math.ceil(y0 / step) * step; t <= y1 + 1e-9; t += step) ticks.push(Math.round(t / step) * step);
  const digits = step < 0.1 ? 2 : step < 1 ? 1 : 0;
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" style={svgStyle(mobile)}
    aria-label={single
      ? `${triplet.id}: 区間 A の書き込みを 1 層ずつ止めたときと、全 24 層で同時に止めたときの、3 問の正答列の Δlog p`
      : `${triplet.id}: 全 24 層で区間 A と対照区間の書き込みを止めたときの、3 問の正答列の Δlog p`}>
    <QuestionLegend x={mobile ? 8 : box.left} y={mobile ? 12 : 14} mobile={mobile} line={!!single} />
    {ticks.map(tick => <g key={tick}>
      <line x1={box.left} x2={columns.control + 16} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? palette.muted : '#30342f'} strokeWidth={0.8} />
      <text x={box.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="central" fill={palette.muted}>{signed(tick, digits)}</text>
    </g>)}
    {single && selected !== null && <g>
      {/* Separates the per-layer axis from the all-layer columns. */}
      <line x1={(box.right + columns.A) / 2} x2={(box.right + columns.A) / 2} y1={box.top} y2={box.bottom} stroke={palette.rule} strokeWidth={0.8} />
      <line x1={x(selected)} x2={x(selected)} y1={box.top} y2={box.bottom} stroke={palette.muted} strokeWidth={0.8} opacity={0.4} />
      {drawOrder.map(role => <polyline key={role} fill="none" stroke={roleColors[role]} strokeWidth={1.6} strokeLinejoin="round"
        points={single.map(l => `${x(l.layer).toFixed(2)},${y(l.delta[role]).toFixed(2)}`).join(' ')} />)}
      {drawOrder.map(role => {
        const layer = single.find(l => l.layer === selected)!;
        return <QuestionMark key={role} role={role} cx={x(selected)} cy={y(layer.delta[role])} r={3.6} />;
      })}
      {[0, 5, 10, 15, 20, 25, 30].map(tick => <text key={tick} x={x(tick)} y={box.bottom + 18} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>{tick}</text>)}
      <text x={(box.left + box.right) / 2} y={height - 10} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>Layer index</text>
    </g>}
    {drawOrder.map(role => <QuestionMark key={role} role={role} cx={columns.A} cy={y(A.delta[role])} r={3.6} />)}
    {drawOrder.map(role => <QuestionMark key={role} role={role} cx={columns.control} cy={y(control.delta[role])} r={3.2} opacity={0.45} />)}
    <SvgTex x={columns.A} y={box.bottom + 18} anchor="middle" tex="\mathcal{A}" color={palette.muted} />
    <text x={columns.control} y={box.bottom + 18} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>control</text>
    <text x={(columns.A + columns.control) / 2} y={height - 10} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>All layers</text>
    <SvgTex x={single ? (mobile ? 4 : 8) : box.left - (mobile ? 36 : 48)} y={box.top - 18} tex="\Delta\log p" color={palette.muted} />
  </svg>;
}

export function WriteLayersFigure({ triplets }: { triplets: FollowupTriplet[] }) {
  const [index, setIndex] = useState(0);
  const triplet = triplets[index]!;
  const layers = triplet.singleLayerA;
  const [layerIndex, setLayerIndex] = useState(() => Math.max(0, (layers ?? []).findIndex(l => l.layer === defaultLayer)));
  const layer = layers?.[layerIndex] ?? null;
  const allLayers = (role: Role) => signed(triplet.allLayer.A.delta[role], 3);
  return <section className={`${styles.card} ${styles.figureCard}`} aria-label="書き込み停止の層ごとの効果と全層の効果" data-block="write-layers" data-triplet={triplet.id}>
    <CaseNavigation title={triplet.id} index={index} count={triplets.length} onChange={setIndex} unit="triplet" />
    <div className={styles.sample}>
      <div className={styles.label}>Interval <Tex tex="\mathcal{A}" /></div>
      <div><code>{triplet.targetWriteText}</code></div>
    </div>
    {layers && layer && <div className={styles.layerNavigation}>
      <CaseNavigation title={`Layer ${layer.layer}`} index={layerIndex} count={layers.length} onChange={setLayerIndex} unit="layer" />
    </div>}
    <div className="article-figure">
      <div className="article-figure-desktop"><WriteLayersPlot triplet={triplet} selected={layer?.layer ?? null} mobile={false} /></div>
      <div className="article-figure-mobile"><WriteLayersPlot triplet={triplet} selected={layer?.layer ?? null} mobile /></div>
    </div>
    <div className={`${styles.effectValues} ${styles.effectValues3}`}>
      {roles.map(role => <div key={role}>
        <span>{questionLabels[role]}</span>
        {layer
          ? <><strong>{signed(layer.delta[role], 3)}</strong><small>all layers {allLayers(role)}</small></>
          : <><strong>{allLayers(role)}</strong><small>all layers</small></>}
      </div>)}
    </div>
  </section>;
}

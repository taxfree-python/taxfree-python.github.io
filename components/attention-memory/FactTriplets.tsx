'use client';

import { useMemo, useRef, useState } from 'react';
import CaseNavigation from './CaseNavigation';
import PassageText from './PassageText';
import { Tex } from './TeX';
import styles from './MemoryCard.module.css';
import { roleColors as colors, roles, type Role } from './palette';

type Question = { id: string; role: Role; question: string; answer: string };
type Layer = {
  index: number;
  lossBefore: Record<Role, number>;
  deltaLogp: Record<Role, number>;
  sameFactMean: number;
  specificity: number;
};
export type FactTriplet = {
  id: string; title: string; category: string; targetWriteText: string;
  passage: string; source: string; questions: Question[]; layers: Layer[];
};

const roleLabels: Record<Role, string> = {
  same_fact_a: 'Same fact · 1',
  same_fact_b: 'Same fact · 2',
  other_fact: 'Other fact',
};

export function FactTripletExamples({ triplets }: { triplets: FactTriplet[] }) {
  const [index, setIndex] = useState(0);
  const passage = useRef<HTMLDivElement>(null);
  const triplet = triplets[index]!;
  return <section className={styles.card} aria-label="Fact triplets" data-triplet={triplet.id}>
    <CaseNavigation title={`${triplet.title} · ${triplet.category}`} index={index} count={triplets.length}
      onChange={next => { setIndex(next); if (passage.current) passage.current.scrollTop = 0; }} unit="triplet" />
    <div className={styles.resultBody}>
      <div className={styles.label}>Passage · interval <Tex tex="\mathcal{A}" /></div>
      <div className={styles.passage} ref={passage} tabIndex={0} aria-label="入力文書">
        <PassageText text={triplet.passage} answer={triplet.targetWriteText} />
      </div>
      <div className={styles.tripletQuestions}>
        {triplet.questions.map(question => <div className={styles.tripletQuestion} key={question.id}>
          <div className={styles.tripletRole}>{roleLabels[question.role]}</div>
          <div>{question.question}</div>
          <div className={styles.tripletAnswer}>{question.answer}</div>
        </div>)}
      </div>
    </div>
    <div className={styles.footer}>
      <span>β = 0: <code>{triplet.targetWriteText}</code></span>
      <a href={triplet.source}>SQuAD ↗</a>
    </div>
  </section>;
}

function axes(width: number, height: number) {
  return { left: 58, right: width - 18, top: 52, bottom: height - 46 };
}

function PlotLegend({ showAll = false, mobile }: { showAll?: boolean; mobile: boolean }) {
  const entries: { label: string; color: string; dashed?: boolean; pointOnly?: boolean }[] = [
    ...(showAll ? [{ label: 'All 30 questions', color: '#6f736d', pointOnly: true }] : []),
    ...roles.map(role => ({
      label: roleLabels[role],
      color: colors[role],
      dashed: role === 'same_fact_b',
    })),
  ];
  let cursor = 62;
  return <g aria-label="Legend">
    {entries.map((entry, index) => {
      const x = mobile ? 58 + (index % 2) * 142 : cursor;
      const legendY = mobile ? 16 + Math.floor(index / 2) * 20 : 18;
      cursor += entry.label.length * 6.8 + 38;
      return <g key={entry.label}>
        {entry.pointOnly
          ? <circle cx={x + 7} cy={legendY} r={2.2} fill={entry.color} opacity=".7" />
          : <line x1={x} x2={x + 15} y1={legendY} y2={legendY} stroke={entry.color} strokeWidth="1.8" strokeDasharray={entry.dashed ? '4 3' : undefined} />}
        <text x={x + 21} y={legendY + 4} fill={entry.color}>{entry.label}</text>
      </g>;
    })}
  </g>;
}

function LossPlot({ triplet, all, mobile }: { triplet: FactTriplet; all: FactTriplet[]; mobile: boolean }) {
  const width = mobile ? 340 : 800, height = mobile ? 270 : 310;
  const box = axes(width, height);
  const x = (layer: number) => box.left + layer / 30 * (box.right - box.left);
  const yMax = 1.1;
  const y = (value: number) => box.bottom - value / yMax * (box.bottom - box.top);
  const ticks = [0, .25, .5, .75, 1];
  const layerValues = useMemo(() => {
    const values = new Map<number, number[]>();
    for (const candidate of all) for (const layer of candidate.layers) {
      const bucket = values.get(layer.index) ?? [];
      for (const role of roles) bucket.push(layer.lossBefore[role]);
      values.set(layer.index, bucket);
    }
    return values;
  }, [all]);
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${triplet.title} の更新前局所回帰損失`}
    style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit', fontSize: mobile ? 11 : 13 }}>
    <PlotLegend showAll mobile={mobile} />
    {ticks.map(tick => <g key={tick}>
      <line x1={box.left} x2={box.right} y1={y(tick)} y2={y(tick)} stroke="#30342f" strokeWidth="0.8" />
      <text x={box.left - 10} y={y(tick) + 4} textAnchor="end" fill="#969991">{tick.toFixed(tick % 1 ? 2 : 0)}</text>
    </g>)}
    <line x1={box.left} x2={box.right} y1={y(1)} y2={y(1)} stroke="#969991" strokeDasharray="4 4" />
    <text x={box.right - 4} y={y(1) - 7} textAnchor="end" fill="#969991">S = 0</text>
    {[...layerValues].map(([layer, values]) => values.map((value, i) =>
      <circle key={`${layer}-${i}`} cx={x(layer)} cy={y(value)} r={mobile ? 1.1 : 1.35} fill="#6f736d" opacity="0.22" />))}
    {roles.map(role => <g key={role}>
      <polyline fill="none" stroke={colors[role]} strokeWidth={role === 'other_fact' ? 1.6 : 1.8}
        strokeDasharray={role === 'same_fact_b' ? '4 3' : undefined}
        points={triplet.layers.map(layer => `${x(layer.index)},${y(layer.lossBefore[role])}`).join(' ')} />
      {triplet.layers.map(layer => <circle key={layer.index} cx={x(layer.index)} cy={y(layer.lossBefore[role])} r={2.2} fill="#0d0d0d" stroke={colors[role]} strokeWidth="1.3" />)}
    </g>)}
    {[0, 5, 10, 15, 20, 25, 30].map(tick => <text key={tick} x={x(tick)} y={box.bottom + 22} textAnchor="middle" fill="#969991">{tick}</text>)}
    <text x={(box.left + box.right) / 2} y={height - 8} textAnchor="middle" fill="#969991">Layer index</text>
    <text transform={`translate(${mobile ? 13 : 17} ${(box.top + box.bottom) / 2}) rotate(-90)`} textAnchor="middle" fill="#969991">R before</text>
  </svg>;
}

function EffectPlot({ triplet, selected, mobile }: { triplet: FactTriplet; selected: number; mobile: boolean }) {
  const width = mobile ? 340 : 800, height = mobile ? 270 : 310;
  const box = axes(width, height);
  const x = (layer: number) => box.left + layer / 30 * (box.right - box.left);
  const maximum = Math.max(.1, ...triplet.layers.flatMap(layer => roles.map(role => Math.abs(layer.deltaLogp[role]))));
  const limit = Math.ceil(maximum * 10) / 10;
  const y = (value: number) => (box.top + box.bottom) / 2 - value / limit * (box.bottom - box.top) / 2;
  const selectedLayer = triplet.layers[selected]!;
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${triplet.title} の書き込み停止による回答尤度の変化`}
    style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit', fontSize: mobile ? 11 : 13 }}>
    <PlotLegend mobile={mobile} />
    {[-limit, -limit / 2, 0, limit / 2, limit].map(tick => <g key={tick}>
      <line x1={box.left} x2={box.right} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? '#737770' : '#30342f'} strokeWidth={tick === 0 ? 1 : .8} />
      <text x={box.left - 10} y={y(tick) + 4} textAnchor="end" fill="#969991">{tick.toFixed(limit < .5 ? 2 : 1)}</text>
    </g>)}
    <text x={box.right - 4} y={y(0) - 7} textAnchor="end" fill="#969991">No change</text>
    {roles.map(role => <g key={role}>
      <polyline fill="none" stroke={colors[role]} strokeWidth={role === 'other_fact' ? 1.6 : 1.8}
        strokeDasharray={role === 'same_fact_b' ? '4 3' : undefined}
        points={triplet.layers.map(layer => `${x(layer.index)},${y(layer.deltaLogp[role])}`).join(' ')} />
      <circle cx={x(selectedLayer.index)} cy={y(selectedLayer.deltaLogp[role])} r={3.4} fill="#0d0d0d" stroke={colors[role]} strokeWidth="1.6" />
    </g>)}
    <line x1={x(selectedLayer.index)} x2={x(selectedLayer.index)} y1={box.top} y2={box.bottom} stroke="#969991" opacity=".5" strokeDasharray="2 4" />
    {[0, 5, 10, 15, 20, 25, 30].map(tick => <text key={tick} x={x(tick)} y={box.bottom + 22} textAnchor="middle" fill="#969991">{tick}</text>)}
    <text x={(box.left + box.right) / 2} y={height - 8} textAnchor="middle" fill="#969991">Layer index</text>
    <text transform={`translate(${mobile ? 13 : 17} ${(box.top + box.bottom) / 2}) rotate(-90)`} textAnchor="middle" fill="#969991">Δ log p</text>
  </svg>;
}

export function FactTripletFigure({ triplets, kind }: { triplets: FactTriplet[]; kind: 'loss' | 'effect' }) {
  const [index, setIndex] = useState(0);
  const [layerIndex, setLayerIndex] = useState(() => Math.max(0, triplets[0]!.layers.findIndex(layer => layer.index === 26)));
  const triplet = triplets[index]!;
  const layer = triplet.layers[layerIndex]!;
  function selectTriplet(next: number) {
    setIndex(next);
    setLayerIndex(Math.max(0, triplets[next]!.layers.findIndex(item => item.index === 26)));
  }
  return <section className={`${styles.card} ${styles.figureCard}`} aria-label={kind === 'loss' ? '更新前局所回帰損失' : '書き込み停止の効果'} data-triplet={triplet.id}>
    <CaseNavigation title={`${triplet.title} · ${triplet.category}`} index={index} count={triplets.length} onChange={selectTriplet} unit="triplet" />
    <div className={styles.sample}>
      <div className={styles.label}>Interval <Tex tex="\mathcal{A}" /> · answer annotation</div>
      <div><code>{triplet.targetWriteText}</code></div>
    </div>
    {kind === 'effect' && <div className={styles.layerNavigation}>
      <CaseNavigation title={`Layer ${layer.index}`} index={layerIndex} count={triplet.layers.length} onChange={setLayerIndex} unit="layer" />
    </div>}
    <div className="article-figure" data-inline-figure={`olmo/triplet-${kind}`}>
      <div className="article-figure-desktop">{kind === 'loss' ? <LossPlot triplet={triplet} all={triplets} mobile={false} /> : <EffectPlot triplet={triplet} selected={layerIndex} mobile={false} />}</div>
      <div className="article-figure-mobile">{kind === 'loss' ? <LossPlot triplet={triplet} all={triplets} mobile /> : <EffectPlot triplet={triplet} selected={layerIndex} mobile />}</div>
    </div>
    {kind === 'effect' && <div className={styles.effectValues}>
      {roles.map(role => <div key={role}><span>{roleLabels[role]}</span><strong>{layer.deltaLogp[role].toFixed(4)}</strong><small>× {Math.exp(layer.deltaLogp[role]).toFixed(3)}</small></div>)}
      <div><span>Specificity D</span><strong>{layer.specificity.toFixed(4)}</strong><small>nats</small></div>
    </div>}
  </section>;
}

import { Figure } from '@/components/article/Figure';
import { SwatchLegend } from './Legend';
import { chartColors, formatCount, formatPercent, niceMax, svgStyle, ticksTo, type Box } from './chart';
import { jevBench } from './data';

const panelOrder = ['medqa', 'jmle', 'mmlupro', 'gpqa', 'chembench', 'seqqa'];
const binCount = 10;
const ariaLabel = '6 ベンチマークにおける top-1 選択肢確率の分布。各ビンは正答を明色、誤答を暗色で積み上げており、確率が高いビンほど誤答の割合が小さい。';

type Panel = {
  id: string;
  short: string;
  accuracy: number;
  correct: number[];
  wrong: number[];
};

function panels(): Panel[] {
  return panelOrder.flatMap((id) => {
    const benchmark = jevBench.benchmarks.find((item) => item.id === id);
    if (!benchmark) return [];
    return [{
      id,
      short: benchmark.short,
      accuracy: benchmark.accuracy,
      correct: benchmark.topProbability.correct,
      wrong: benchmark.topProbability.wrong,
    }];
  });
}

type Layout = {
  width: number;
  height: number;
  columns: number;
  panelWidth: number;
  panelHeight: number;
  gapX: number;
  gapY: number;
  originX: number;
  originY: number;
  insetLeft: number;
  insetRight: number;
  insetTop: number;
  insetBottom: number;
  titleBaseline: number;
};

const desktopLayout: Layout = {
  width: 800, height: 452, columns: 3,
  panelWidth: 245, panelHeight: 170, gapX: 25, gapY: 44,
  originX: 10, originY: 40,
  insetLeft: 40, insetRight: 4, insetTop: 26, insetBottom: 20,
  titleBaseline: 12,
};

const mobileLayout: Layout = {
  width: 340, height: 544, columns: 2,
  panelWidth: 154, panelHeight: 140, gapX: 16, gapY: 26,
  originX: 8, originY: 44,
  insetLeft: 32, insetRight: 3, insetTop: 22, insetBottom: 18,
  titleBaseline: 10,
};

type PanelPlotProps = {
  panel: Panel;
  box: Box;
  titleX: number;
  titleY: number;
  mobile: boolean;
};

function PanelPlot({ panel, box, titleX, titleY, mobile }: PanelPlotProps) {
  const totals = panel.correct.map((value, index) => value + (panel.wrong[index] ?? 0));
  const max = niceMax(Math.max(...totals));
  const y = (value: number) => box.bottom - (value / max) * (box.bottom - box.top);
  const binWidth = (box.right - box.left) / binCount;
  return (
    <g>
      <text x={titleX} y={titleY} fill={chartColors.ink}>
        {panel.short}
        <tspan dx="9" fill={chartColors.muted}>{formatPercent(panel.accuracy)}%</tspan>
      </text>
      {ticksTo(max, 2).map((tick) => (
        <g key={tick}>
          <line x1={box.left} x2={box.right} y1={y(tick)} y2={y(tick)} stroke={chartColors.grid} strokeWidth="1" />
          <text x={box.left - 6} y={y(tick) + 4} textAnchor="end" fill={chartColors.muted}>{formatCount(Math.round(tick))}</text>
        </g>
      ))}
      {panel.correct.map((correct, index) => {
        const wrong = panel.wrong[index] ?? 0;
        if (correct + wrong === 0) return null;
        const x = box.left + index * binWidth + 1;
        const width = binWidth - 2;
        const correctTop = y(correct);
        const stackTop = y(correct + wrong);
        return (
          <g key={index}>
            {correct > 0 ? <rect x={x} y={correctTop} width={width} height={box.bottom - correctTop} fill={chartColors.fill} /> : null}
            {wrong > 0 ? <rect x={x} y={stackTop} width={width} height={correctTop - stackTop} fill={chartColors.fillDim} /> : null}
          </g>
        );
      })}
      <line x1={box.left} x2={box.right} y1={box.bottom} y2={box.bottom} stroke={chartColors.axis} strokeWidth="1" />
      {[0, 0.5, 1].map((tick) => (
        <text key={tick} x={box.left + tick * (box.right - box.left)} y={box.bottom + (mobile ? 12 : 14)} textAnchor="middle" fill={chartColors.muted}>{tick}</text>
      ))}
    </g>
  );
}

type ProbabilityPlotProps = {
  mobile: boolean;
};

function ProbabilityPlot({ mobile }: ProbabilityPlotProps) {
  const layout = mobile ? mobileLayout : desktopLayout;
  return (
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={ariaLabel} style={svgStyle(mobile)}>
      <SwatchLegend
        entries={[{ label: 'correct', fill: chartColors.fill }, { label: 'wrong', fill: chartColors.fillDim }]}
        width={layout.width}
        mobile={mobile}
      />
      {panels().map((panel, index) => {
        const originX = layout.originX + (index % layout.columns) * (layout.panelWidth + layout.gapX);
        const originY = layout.originY + Math.floor(index / layout.columns) * (layout.panelHeight + layout.gapY);
        const box: Box = {
          left: originX + layout.insetLeft,
          right: originX + layout.panelWidth - layout.insetRight,
          top: originY + layout.insetTop,
          bottom: originY + layout.panelHeight - layout.insetBottom,
        };
        return (
          <PanelPlot
            key={panel.id}
            panel={panel}
            box={box}
            titleX={originX}
            titleY={originY + layout.titleBaseline}
            mobile={mobile}
          />
        );
      })}
      <text x={layout.width / 2} y={layout.height - 10} textAnchor="middle" fill={chartColors.muted}>top-1 option probability</text>
    </svg>
  );
}

export function ProbabilityFigure() {
  return <Figure id="probability" desktop={<ProbabilityPlot mobile={false} />} mobile={<ProbabilityPlot mobile />} />;
}

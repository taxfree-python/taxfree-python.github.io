import { Figure } from '@/components/article/Figure';
import { SwatchLegend } from './Legend';
import { axes, chartColors, formatCount, niceMax, svgStyle, ticksTo } from './chart';
import { jevBench } from './data';

const binCount = 10;
const ariaLabel = 'ClinTox の P(toxic) 分布。非毒性群と毒性群を群内比率で並べており、どちらも閾値 0.5 付近に集中している。';

type ClintoxPlotProps = {
  mobile: boolean;
};

function ClintoxPlot({ mobile }: ClintoxPlotProps) {
  const { clintox } = jevBench;
  const width = mobile ? 340 : 800;
  const height = mobile ? 240 : 300;
  const box = mobile
    ? axes(width, height, { left: 40, right: 10, top: 40, bottom: 48 })
    : axes(width, height, { left: 52, right: 14, top: 44, bottom: 54 });
  const groups = [
    { key: 'nonToxic', label: `non-toxic (n = ${formatCount(clintox.nonToxic)})`, fill: chartColors.barLight, bins: clintox.pToxic.nonToxic, total: clintox.nonToxic },
    { key: 'toxic', label: `toxic (n = ${formatCount(clintox.toxic)})`, fill: chartColors.barDark, bins: clintox.pToxic.toxic, total: clintox.toxic },
  ];
  const share = (count: number, total: number) => (total > 0 ? (count / total) * 100 : 0);
  const max = niceMax(Math.max(...groups.flatMap((group) => group.bins.map((count) => share(count, group.total)))));
  const y = (value: number) => box.bottom - (value / max) * (box.bottom - box.top);
  const binWidth = (box.right - box.left) / binCount;
  const padding = mobile ? 3 : 8;
  const innerGap = mobile ? 1 : 3;
  const barWidth = (binWidth - 2 * padding - innerGap) / 2;
  const threshold = box.left + 0.5 * (box.right - box.left);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} style={svgStyle(mobile)}>
      <SwatchLegend entries={groups.map((group) => ({ label: group.label, fill: group.fill }))} width={width} mobile={mobile} />
      {ticksTo(max, 5).map((tick) => (
        <g key={tick}>
          <line x1={box.left} x2={box.right} y1={y(tick)} y2={y(tick)} stroke={chartColors.grid} strokeWidth="1" />
          <text x={box.left - 6} y={y(tick) + 4} textAnchor="end" fill={chartColors.muted}>{formatCount(Math.round(tick))}</text>
        </g>
      ))}
      {groups.map((group, groupIndex) => (
        <g key={group.key}>
          {group.bins.map((count, index) => {
            if (count === 0) return null;
            const top = y(share(count, group.total));
            const x = box.left + index * binWidth + padding + groupIndex * (barWidth + innerGap);
            return <rect key={index} x={x} y={top} width={barWidth} height={box.bottom - top} fill={group.fill} />;
          })}
        </g>
      ))}
      <line x1={threshold} x2={threshold} y1={box.top} y2={box.bottom} stroke={chartColors.marker} strokeWidth="1" strokeDasharray="2 3" opacity="0.75" />
      <text x={threshold + 5} y={box.top + (mobile ? 10 : 12)} fill={chartColors.muted}>threshold</text>
      <line x1={box.left} x2={box.right} y1={box.bottom} y2={box.bottom} stroke={chartColors.axis} strokeWidth="1" />
      {[0, 0.5, 1].map((tick) => (
        <text key={tick} x={box.left + tick * (box.right - box.left)} y={box.bottom + (mobile ? 14 : 16)} textAnchor="middle" fill={chartColors.muted}>{tick}</text>
      ))}
      <text x={(box.left + box.right) / 2} y={box.bottom + (mobile ? 30 : 38)} textAnchor="middle" fill={chartColors.muted}>P(toxic)</text>
      <text transform={`translate(${mobile ? 12 : 16} ${(box.top + box.bottom) / 2}) rotate(-90)`} textAnchor="middle" fill={chartColors.muted}>share within group (%)</text>
    </svg>
  );
}

export function ClintoxFigure() {
  return <Figure id="clintox" desktop={<ClintoxPlot mobile={false} />} mobile={<ClintoxPlot mobile />} />;
}

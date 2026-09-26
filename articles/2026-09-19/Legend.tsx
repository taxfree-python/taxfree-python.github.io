import { approxTextWidth, chartColors } from './chart';

type ChanceLegendProps = {
  width: number;
  mobile: boolean;
};

/** Single entry explaining the chance-level notch cut into each bar. */
export function ChanceLegend({ width, mobile }: ChanceLegendProps) {
  const fontSize = mobile ? 11 : 13;
  const label = 'chance level';
  const textX = width - 8;
  const swatchWidth = mobile ? 16 : 20;
  const swatchHeight = mobile ? 12 : 14;
  const notchWidth = mobile ? 2 : 2.5;
  const swatchX = textX - approxTextWidth(label, fontSize) - 8 - swatchWidth;
  const y = mobile ? 16 : 18;
  return (
    <g aria-label="Legend">
      <rect x={swatchX} y={y - swatchHeight / 2} width={swatchWidth} height={swatchHeight} fill={chartColors.fill} />
      <rect x={swatchX + swatchWidth / 2 - notchWidth / 2} y={y - swatchHeight / 2} width={notchWidth} height={swatchHeight} fill={chartColors.notch} />
      <text x={textX} y={y + 4} textAnchor="end" fill={chartColors.muted}>{label}</text>
    </g>
  );
}

type SwatchLegendProps = {
  entries: { label: string; fill: string }[];
  width: number;
  mobile: boolean;
};

/** Filled squares plus labels, right-aligned at the top of a figure. */
export function SwatchLegend({ entries, width, mobile }: SwatchLegendProps) {
  const fontSize = mobile ? 11 : 13;
  const size = mobile ? 8 : 9;
  const gap = mobile ? 14 : 18;
  const y = mobile ? 16 : 18;
  const widths = entries.map((entry) => size + 5 + approxTextWidth(entry.label, fontSize));
  const total = widths.reduce((sum, value) => sum + value, 0) + gap * Math.max(0, entries.length - 1);
  let cursor = width - 8 - total;
  return (
    <g aria-label="Legend">
      {entries.map((entry, index) => {
        const x = cursor;
        cursor += (widths[index] ?? 0) + gap;
        return (
          <g key={entry.label}>
            <rect x={x} y={y - size + 1} width={size} height={size} fill={entry.fill} />
            <text x={x + size + 5} y={y + 3} fill={chartColors.muted}>{entry.label}</text>
          </g>
        );
      })}
    </g>
  );
}

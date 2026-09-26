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

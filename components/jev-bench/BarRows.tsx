import { ChanceLegend } from './Legend';
import { approxTextWidth, axes, chartColors, formatPercent, svgStyle } from './chart';

export type BarRow = {
  key: string;
  label: string;
  accuracy: number;
  chance: number;
  /** Optional right-aligned annotation column, e.g. `n = 1,273`. */
  note?: string;
};

type BarRowsProps = {
  rows: BarRow[];
  mobile: boolean;
  ariaLabel: string;
  /** Width reserved for the row labels, i.e. the left edge of the 0-100 scale. */
  labelInset: number;
  /** Width reserved right of the scale for value labels and the note column. */
  rightInset: number;
  labelFont: string;
};

const scaleTicks = [0, 25, 50, 75, 100];

/** Horizontal accuracy bars with a chance-level tick drawn on top of each bar. */
export function BarRows({ rows, mobile, ariaLabel, labelInset, rightInset, labelFont }: BarRowsProps) {
  const width = mobile ? 340 : 800;
  const pitch = mobile ? 24 : 26;
  const barHeight = mobile ? 12 : 14;
  const top = mobile ? 34 : 40;
  const height = top + rows.length * pitch + 46;
  const box = axes(width, height, { left: labelInset, right: rightInset, top, bottom: 46 });
  const x = (percent: number) => box.left + (percent / 100) * (box.right - box.left);
  const middle = (index: number) => box.top + index * pitch + pitch / 2;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} style={svgStyle(mobile)}>
      <ChanceLegend width={width} mobile={mobile} />
      {scaleTicks.map((tick) => (
        <line key={tick} x1={x(tick)} x2={x(tick)} y1={box.top} y2={box.bottom} stroke={chartColors.grid} strokeWidth="1" />
      ))}
      <line x1={box.left} x2={box.left} y1={box.top} y2={box.bottom} stroke={chartColors.axis} strokeWidth="1" />
      {rows.map((row, index) => {
        const baseline = middle(index) + 4;
        const barTop = middle(index) - barHeight / 2;
        const end = x(row.accuracy * 100);
        const tick = x(row.chance * 100);
        const value = formatPercent(row.accuracy);
        const gap = mobile ? 4 : 6;
        // A bar that stops short of chance level would put its value label across the tick; start the label after it.
        const valueX = tick > end && tick < end + gap + approxTextWidth(value, mobile ? 11 : 13) ? tick + gap : end + gap;
        return (
          <g key={row.key}>
            <text x={box.left - (mobile ? 8 : 12)} y={baseline} textAnchor="end" fill={chartColors.ink} style={{ fontFamily: labelFont }}>{row.label}</text>
            <rect x={box.left} y={barTop} width={Math.max(0, end - box.left)} height={barHeight} fill={chartColors.barLight} />
            <rect x={tick - 0.5} y={barTop - 3} width="1" height={barHeight + 6} fill={chartColors.marker} opacity="0.75" />
            <text x={valueX} y={baseline} fill={chartColors.ink}>{value}</text>
            {row.note ? <text x={width - 8} y={baseline} textAnchor="end" fill={chartColors.muted}>{row.note}</text> : null}
          </g>
        );
      })}
      {scaleTicks.map((tick) => (
        <text key={tick} x={x(tick)} y={box.bottom + (mobile ? 16 : 18)} textAnchor="middle" fill={chartColors.muted}>{tick}</text>
      ))}
      <text x={(box.left + box.right) / 2} y={box.bottom + (mobile ? 34 : 38)} textAnchor="middle" fill={chartColors.muted}>accuracy (%)</text>
    </svg>
  );
}

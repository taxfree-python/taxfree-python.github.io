import { Figure } from '@/components/article/Figure';
import { hues, palette } from './palette';
import { SvgTex } from './TeX';

const curves = [
  { label: 'Kimi Linear', color: hues.gold, g: (z: number) => -(Math.max(z, 0) + Math.log1p(Math.exp(-Math.abs(z)))) },
  { label: 'Kimi K3', color: palette.state, g: (z: number) => -5 / (1 + Math.exp(-z)) },
];
const zTicks = [-8, -4, 0, 4, 8];
const gTicks = [0, -5, -8];
const gRange: [number, number] = [-8.5, 0.4];
const samples = Array.from({ length: 161 }, (_, i) => -8 + i * 0.1);
const minus = (n: number) => (n < 0 ? `−${-n}` : `${n}`);

/** Figure 3: log-decay g as a function of the decay logit z at A_h = 0. */
function DecayPlot({ mobile }: { mobile: boolean }) {
  const width = mobile ? 340 : 800, height = mobile ? 240 : 280;
  const box = { left: mobile ? 44 : 58, right: width - (mobile ? 74 : 104), top: 12, bottom: height - (mobile ? 42 : 46) };
  const x = (z: number) => box.left + ((z + 8) / 16) * (box.right - box.left);
  const y = (g: number) => box.top + ((gRange[1] - g) / (gRange[1] - gRange[0])) * (box.bottom - box.top);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img"
      aria-label="Kimi Linear と Kimi K3 の log-decay。Kimi K3 は −5 に漸近し、Kimi Linear は下限を持たない。"
      style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'inherit', fontSize: mobile ? 11 : 13 }}>
      {gTicks.map(tick => (
        <g key={tick}>
          {/* g = −5 is the bound, drawn dashed as in the caption; the other ticks get a grid hairline. */}
          <line x1={box.left} x2={box.right} y1={y(tick)} y2={y(tick)}
            stroke={tick === -5 ? palette.muted : palette.rule} strokeWidth={tick === -5 ? 0.9 : 0.8}
            strokeDasharray={tick === -5 ? '4 4' : undefined} />
          <text x={box.left - 10} y={y(tick)} textAnchor="end" dominantBaseline="central" fill={palette.muted}>{minus(tick)}</text>
        </g>
      ))}
      {zTicks.map(tick => (
        <text key={tick} x={x(tick)} y={box.bottom + 20} textAnchor="middle" dominantBaseline="central" fill={palette.muted}>{minus(tick)}</text>
      ))}
      <SvgTex x={(box.left + box.right) / 2} y={height - 10} anchor="middle" tex="z" color={palette.muted} scale={1.15} />
      <SvgTex x={mobile ? 8 : 14} y={(box.top + box.bottom) / 2} anchor="middle" tex="g" color={palette.muted} scale={1.15} />
      {curves.map(curve => (
        <g key={curve.label}>
          <polyline fill="none" stroke={curve.color} strokeWidth={1.6} strokeLinejoin="round"
            points={samples.map(z => `${x(z).toFixed(2)},${y(curve.g(z)).toFixed(2)}`).join(' ')} />
          <text x={box.right + 8} y={y(curve.g(8))} dominantBaseline="central" fill={curve.color}>{curve.label}</text>
        </g>
      ))}
    </svg>
  );
}

export function DecayFunctionsFigure() {
  return <Figure id="decay-functions" desktop={<DecayPlot mobile={false} />} mobile={<DecayPlot mobile />} />;
}

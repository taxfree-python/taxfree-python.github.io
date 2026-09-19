import { BarRows, type BarRow } from './BarRows';
import { Figure } from './Figure';
import { formatCount } from './chart';
import { byAccuracyDesc, jevBench } from './data';

const ariaLabel = '12 の科学ベンチマークにおける Jev の正答率。バー上の縦線は偶然正解の水準を示す。';

export function AccuracyFigure() {
  const benchmarks = byAccuracyDesc(jevBench.benchmarks);
  const desktopRows: BarRow[] = benchmarks.map((benchmark) => ({
    key: benchmark.id,
    label: benchmark.label,
    accuracy: benchmark.accuracy,
    chance: benchmark.chance,
    note: `n = ${formatCount(benchmark.n)}`,
  }));
  const mobileRows: BarRow[] = benchmarks.map((benchmark) => ({
    key: benchmark.id,
    label: benchmark.short,
    accuracy: benchmark.accuracy,
    chance: benchmark.chance,
  }));
  return (
    <Figure
      id="accuracy"
      desktop={<BarRows rows={desktopRows} mobile={false} ariaLabel={ariaLabel} labelInset={210} rightInset={110} labelFont="inherit" />}
      mobile={<BarRows rows={mobileRows} mobile ariaLabel={ariaLabel} labelInset={108} rightInset={34} labelFont="inherit" />}
    />
  );
}

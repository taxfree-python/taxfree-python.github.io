import { BarRows, type BarRow } from './BarRows';
import { Figure } from './Figure';
import { byAccuracyDesc, jevBench } from './data';
import { fontFamilyMono } from '@/lib/theme';

const ariaLabel = 'LAB-Bench SeqQA の 15 サブタスク別正答率。上位 4 種は 100%、下位は偶然正解の水準を下回る。';

export function SeqqaFigure() {
  const rows: BarRow[] = byAccuracyDesc(jevBench.seqqaSubtasks).map((subtask) => ({
    key: subtask.id,
    label: subtask.id,
    accuracy: subtask.accuracy,
    chance: subtask.chance,
  }));
  return (
    <Figure
      id="seqqa"
      desktop={<BarRows rows={rows} mobile={false} ariaLabel={ariaLabel} labelInset={212} rightInset={60} labelFont={fontFamilyMono} />}
      mobile={<BarRows rows={rows} mobile ariaLabel={ariaLabel} labelInset={168} rightInset={36} labelFont={fontFamilyMono} />}
    />
  );
}

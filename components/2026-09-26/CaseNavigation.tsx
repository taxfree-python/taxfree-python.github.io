'use client';

import styles from './MemoryCard.module.css';

export default function CaseNavigation({ title, index, count, onChange, busy = false, unit = '設問' }: {
  title: string;
  index: number;
  count: number;
  onChange: (index: number) => void;
  busy?: boolean;
  unit?: string;
}) {
  return <div className={styles.navigation} role="group" aria-label={`${unit}の切り替え`}>
    <button type="button" aria-label={`前の${unit}`} disabled={busy || index === 0}
      onClick={() => onChange(index - 1)}>←</button>
    <div className={styles.current} aria-live="polite" aria-atomic="true">
      <span className={styles.title} title={title}>{title}</span>
      <span className={styles.counter}>{index + 1} / {count}</span>
    </div>
    <button type="button" aria-label={`次の${unit}`} disabled={busy || index === count - 1}
      onClick={() => onChange(index + 1)}>→</button>
  </div>;
}

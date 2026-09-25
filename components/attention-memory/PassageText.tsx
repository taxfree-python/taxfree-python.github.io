import { Fragment } from 'react';
import styles from './MemoryCard.module.css';

type Interval = { start: number; end: number };

/** Highlights span A and, subtly, any other mentions of the same entity that get replaced. */
export default function PassageText({ text, spanA, mentions = [] }: { text: string; spanA: Interval; mentions?: Interval[] }) {
  const marks = [
    { ...spanA, className: styles.answerMark },
    ...mentions.map((mention) => ({ ...mention, className: styles.mentionMark })),
  ].sort((a, b) => a.start - b.start);
  let cursor = 0;
  const parts = marks.flatMap((mark, i) => {
    const before = text.slice(cursor, mark.start);
    const marked = <mark className={mark.className} key={i}>{text.slice(mark.start, mark.end)}</mark>;
    cursor = mark.end;
    return before ? [<Fragment key={`t${i}`}>{before}</Fragment>, marked] : [marked];
  });
  return <>{parts}{text.slice(cursor)}</>;
}

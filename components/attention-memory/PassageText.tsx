import styles from './MemoryCard.module.css';

export default function PassageText({ text, answer }: { text: string; answer: string }) {
  const start = answer ? text.indexOf(answer) : -1;
  if (start < 0) return text;
  return <>{text.slice(0, start)}<mark className={styles.answerMark}>{answer}</mark>{text.slice(start + answer.length)}</>;
}

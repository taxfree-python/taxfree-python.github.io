'use client';

import { useRef, useState } from 'react';
import CaseNavigation from './CaseNavigation';
import PassageText from './PassageText';
import { Tex } from './TeX';
import styles from './MemoryCard.module.css';
import type { Role } from './palette';

/** A triplet as read from content/data/attention-memory-card.json (built by
 * scripts/attention-memory/build_card_data.py from the frozen v6 counterfactual set). */
export type FactTripletCard = {
  id: string; title: string; paragraph: number; sourceUrl: string; passage: string;
  spanA: { text: string; start: number; end: number };
  replacement: { text: string };
  otherMentions: { text: string; start: number; end: number; replacement: string }[];
  type: 'PER' | 'DAT' | 'NUM' | 'ORG';
  questions: { role: Role; question: string; answer: string }[];
};

const roleLabels: Record<Role, string> = {
  same_fact_a: 'Same fact · 1',
  same_fact_b: 'Same fact · 2',
  other_fact: 'Other fact',
};

export function FactTripletExamples({ triplets }: { triplets: FactTripletCard[] }) {
  const [index, setIndex] = useState(0);
  const passage = useRef<HTMLDivElement>(null);
  const triplet = triplets[index]!;
  const mentionSummary = triplet.otherMentions.map(mention => `${mention.text} → ${mention.replacement}`).join(', ');
  return <section className={styles.card} aria-label="Fact triplets" data-block="triplets" data-triplet={triplet.id}>
    <CaseNavigation title={`${triplet.title} · ${triplet.type}`} index={index} count={triplets.length}
      onChange={next => { setIndex(next); if (passage.current) passage.current.scrollTop = 0; }} unit="triplet" />
    <div className={styles.resultBody}>
      <div className={styles.label}>Passage · interval <Tex tex="\mathcal{A}" /></div>
      <div className={styles.passage} ref={passage} tabIndex={0} aria-label="入力文書">
        <PassageText text={triplet.passage} spanA={triplet.spanA} mentions={triplet.otherMentions} />
      </div>
      <div className={styles.tripletQuestions}>
        {triplet.questions.map(question => <div className={styles.tripletQuestion} key={question.role}>
          <div className={styles.tripletRole}>{roleLabels[question.role]}</div>
          <div>{question.question}</div>
          <div className={styles.tripletAnswer}>{question.answer}</div>
        </div>)}
      </div>
    </div>
    <div className={styles.footer}>
      <span className={styles.replacementLine}>
        <Tex tex="\mathcal{A}" />: <code>{triplet.spanA.text}</code> → <code>{triplet.replacement.text}</code>
        {mentionSummary && <span className={styles.otherMentionsNote}> · {triplet.otherMentions.length === 1 ? 'other mention' : `${triplet.otherMentions.length} other mentions`}: {mentionSummary}</span>}
      </span>
      <a href={triplet.sourceUrl}>SQuAD ↗</a>
    </div>
  </section>;
}

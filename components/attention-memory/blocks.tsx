import { Figure } from '@/components/article/Figure';
import { FactTripletExamples, FactTripletFigure } from './FactTriplets';
import { IndependentQuestionsFigure, WriteInterventionFigure } from './Diagrams';
import { triplets, type BlockName } from './data';
import type { ArticleBlocks } from '@/lib/article-blocks';

function Svg({ src, alt }: { src: string; alt: string }) {
  // Static export with unoptimized images: next/image would add nothing for an SVG.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 0 }} />;
}

/** Pre-rendered schematic: `<base>.svg` on desktop, `<base>-mobile.svg` below 600px. */
function ImageFigure({ id, base, alt }: { id: string; base: string; alt: string }) {
  const src = `/images/blog/attention-memory/${base}`;
  return <Figure id={id} desktop={<Svg src={`${src}.svg`} alt={alt} />} mobile={<Svg src={`${src}-mobile.svg`} alt={alt} />} />;
}

/** Blocks for content/posts/2026-09-14.md. */
export const blocks: Record<BlockName, ArticleBlocks[string]> = {
  memory: () => (
    <ImageFigure id="memory" base="draft/01-memory"
      alt="同じ 8 token の入力から softmax attention と GDN / KDA に分岐する。Softmax attention は token ごとの KV cache、GDN / KDA は固定サイズの状態 S を保持し、query に対する出力を計算する。" />
  ),
  'online-learning': () => (
    <ImageFigure id="online-learning" base="draft/02-online-learning"
      alt="GDN の状態更新。前の状態から decay、residual、delta update を順につなぎ、decay 後の状態を別経路で最後の加算に渡す。" />
  ),
  'decay-functions': () => (
    <ImageFigure id="decay-functions" base="olmo/13-decay-functions"
      alt="Kimi Linear と Kimi K3 の log-decay。Kimi K3 は −5 に漸近し、Kimi Linear は下限を持たない。" />
  ),
  triplets: () => <FactTripletExamples triplets={triplets} />,
  'independent-questions': IndependentQuestionsFigure,
  'triplet-loss': () => <FactTripletFigure triplets={triplets} kind="loss" />,
  'write-intervention': WriteInterventionFigure,
  'triplet-effect': () => <FactTripletFigure triplets={triplets} kind="effect" />,
} satisfies ArticleBlocks;

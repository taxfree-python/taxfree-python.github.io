import { ProjectActivity } from '../types/activities';

export const projectsAndActivities: ProjectActivity[] = [
  {
    id: 'pfn-summer-internship',
    title: 'PFN Summer Internship',
    date: '2024年8月 - 9月',
    description: 'Preferred Networks でのサマーインターンシップに参加',
    skills: ['Python', 'PyTorch', 'Docker'],
    kind: 'internship',
    detailedDescription:
      '深層学習フレームワークの最適化に取り組みました。具体的には、PyTorchを用いた大規模モデルの分散学習における通信効率の改善や、推論時のメモリ使用量削減に関する研究を行いました。',
    achievements: [
      '分散学習時の通信オーバーヘッドを30%削減',
      '推論時のメモリ使用量を40%削減する手法を開発',
      'チーム内での技術発表を実施',
    ],
    links: [
      {
        label: 'Preferred Networks 公式サイト',
        url: 'https://www.preferred.jp/',
      },
    ],
  },
  {
    id: 'nec-llm-competition',
    title: 'NEC LLM Competition',
    date: '2024年9月',
    description: 'NEC の LLM コンペで CTO 賞を受賞',
    skills: ['Python', 'PyTorch', 'React'],
    kind: 'competition',
    detailedDescription:
      'NECが主催する大規模言語モデルのコンペティションに参加し、効率的なファインチューニング手法を提案しました。限られた計算リソースで高精度なモデルを構築することが求められる中、独自のプロンプトエンジニアリングとパラメータ効率的な学習手法を組み合わせて実装しました。',
    achievements: [
      'CTO賞を受賞（参加チーム50チーム中）',
      'ベースラインモデルと比較して15%の精度向上を達成',
      'Web UIを実装し、モデルのデモンストレーションを実施',
    ],
    links: [
      {
        label: 'NEC 技術ブログ',
        url: 'https://jpn.nec.com/',
      },
    ],
  },
  {
    id: 'erato-kojima-market-design',
    title: 'ERATO Kojima Market Design Project',
    date: '2024年9月',
    description: 'マーケットデザインプロジェクトに参加',
    skills: ['Python', 'Go'],
    kind: 'research',
    detailedDescription:
      'JST ERATO 小島市場設計プロジェクトにて、オークション理論とアルゴリズムに関する研究に取り組みました。組合せオークションのメカニズムデザインと、効率的な価格計算アルゴリズムの実装を担当しました。',
    achievements: [
      '組合せオークションシミュレーターをPythonで実装',
      '大規模問題に対応した高速化アルゴリズムをGoで開発',
      '研究成果を国内学会で発表',
    ],
    links: [
      {
        label: 'ERATO 小島市場設計プロジェクト',
        url: 'https://www.jst.go.jp/erato/kojima/',
      },
    ],
  },
];

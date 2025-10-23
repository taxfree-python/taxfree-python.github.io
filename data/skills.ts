import { SkillDetail, SkillGroup } from '../types/skills';

export const skillGroups: SkillGroup[] = [
  {
    id: 'technical',
    title: 'Technical Skills',
    description: '日々の開発やリサーチで使っている主要なスキルセット。',
  },
  {
    id: 'language',
    title: 'Languages & Certifications',
    description: '業務で活かしている語学力と関連する資格・認定。',
  },
];

export const skills: SkillDetail[] = [
  {
    name: 'Python',
    icon: '🐍',
    category: 'technical',
    experience: '3+ years',
    description:
      '機械学習、データ分析、バックエンド開発に使用。PyTorchやFastAPIでの開発経験あり。',
    relatedItemIds: ['pfn-summer-internship', 'nec-llm-competition'],
    filterable: true,
  },
  {
    name: 'TypeScript',
    icon: '💙',
    category: 'technical',
    experience: '2+ years',
    description: 'フロントエンド開発に使用。React、Next.jsでの型安全な開発を実践。',
    filterable: true,
  },
  {
    name: 'Go',
    icon: '🔵',
    category: 'technical',
    experience: '1+ year',
    description:
      'バックエンドAPIとマイクロサービスの開発に使用。並行処理とパフォーマンス最適化に注力。',
    relatedItemIds: ['erato-kojima-market-design'],
    filterable: true,
  },
  {
    name: 'React',
    icon: '⚛️',
    category: 'technical',
    experience: '2+ years',
    description: 'モダンなWebアプリケーション開発。フック、状態管理、パフォーマンス最適化に精通。',
    relatedItemIds: ['nec-llm-competition'],
    filterable: true,
  },
  {
    name: 'PyTorch',
    icon: '🔥',
    category: 'technical',
    experience: '2+ years',
    description:
      '深層学習モデルの実装と訓練。LLMのファインチューニングや推論最適化の経験あり。',
    relatedItemIds: ['pfn-summer-internship', 'nec-llm-competition'],
    filterable: true,
  },
  {
    name: 'Docker',
    icon: '🐳',
    category: 'technical',
    experience: '2+ years',
    description: 'コンテナ化とCI/CD環境の構築。開発環境の再現性とデプロイメントの自動化を実現。',
    relatedItemIds: ['pfn-summer-internship'],
    filterable: true,
  },
  {
    name: 'English Communication',
    icon: '🗣️',
    category: 'language',
    level: 'Business',
    description:
      '英語でのドキュメント作成やミーティング、コードレビューに対応。海外メンバーとの協働経験あり。',
    highlights: ['国際チームでのコードレビューや技術議論をリード'],
    achievements: [
      {
        label: 'TOEIC',
        value: '930 (2024)',
        description: 'Listening & Reading',
      },
      {
        label: '英語プレゼン',
        value: 'Tech Talk @ PFN Internship',
        description: 'LLM 推論最適化について発表',
      },
    ],
  },
  {
    name: 'Japanese',
    icon: '🗾',
    category: 'language',
    level: 'Native',
    description: '日本語での技術記事執筆や登壇、社内外コミュニケーションに対応。',
  },
];

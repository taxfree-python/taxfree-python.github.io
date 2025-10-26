import { SkillDetail, SkillGroup } from '../types/skills';

export const skillGroups: SkillGroup[] = [
  {
    id: 'technical',
    title: 'Technical Skills',
    description: '日々の開発やリサーチで使っている主要なスキルセット。',
  },
];

export const skills: SkillDetail[] = [
  {
    name: 'Python',
    icon: '🐍',
    category: 'technical',
    experience: '5+ years',
    description:
      '機械学習、データ分析、バックエンド開発、数理最適化に使用。PyTorch、FastAPI、Scipy、PuLP、OpenCVなど幅広いライブラリの使用経験あり。',
    relatedItemIds: [
      'pfn-summer-internship',
      'nec-llm-competition',
      'autonomous-lab-scheduling',
      'igem-tokyotech-2023',
      'igem-tokyotech-2022',
      'trap-hackathon',
    ],
    filterable: true,
  },
  {
    name: 'LLM',
    icon: '🤖',
    category: 'technical',
    experience: '2+ years',
    description:
      '大規模言語モデルを用いたアプリケーション開発。OpenAI API、プロンプト最適化、教育サービス開発の経験あり。',
    relatedItemIds: [
      'pfn-summer-internship',
      'nec-llm-competition',
      'igem-library',
      'chatgpt-business-contest',
      'trap-hackathon',
    ],
    filterable: true,
  },
  {
    name: 'React',
    icon: '⚛️',
    category: 'technical',
    experience: '2+ years',
    description:
      'フロントエンド開発に使用。Next.js、TypeScriptでの型安全な開発を実践。PFNインターンでの教育サービス開発に活用。',
    relatedItemIds: ['pfn-summer-internship'],
    filterable: true,
  },
  {
    name: '機械学習',
    icon: '🧠',
    category: 'technical',
    experience: '3+ years',
    description:
      'Keras、LSTM、Lassoを用いた時系列データ解析と予測。デング熱流行予測モデルやSRIP産生量予測モデルの構築経験あり。',
    relatedItemIds: ['igem-tokyotech-2023', 'igem-tokyotech-2022'],
    filterable: true,
  },
  {
    name: '数理最適化',
    icon: '📊',
    category: 'technical',
    experience: '2+ years',
    description:
      '組合せ最適化、スケジューリング最適化、ベイズ最適化。自動・自律実験システムのスケジューリング、3D-PCR検体配置最適化などの実装経験あり。',
    relatedItemIds: ['autonomous-lab-scheduling', 'igem-tokyotech-2023'],
    filterable: true,
  },
  {
    name: 'SQL',
    icon: '🗄️',
    category: 'technical',
    experience: '2+ years',
    description:
      'データ分析に使用。BigQuery、Redashを用いたデータ分析、医療データやモビリティデータの分析経験あり。',
    relatedItemIds: ['doctor-car-data-analysis'],
    filterable: true,
  },
  {
    name: 'FastAPI',
    icon: '⚡',
    category: 'technical',
    experience: '1+ year',
    description:
      'バックエンド開発に使用。MariaDBと組み合わせたAPI開発、画像生成サービスのバックエンド実装経験あり。',
    relatedItemIds: ['trap-hackathon'],
    filterable: true,
  },
  {
    name: 'Streamlit',
    icon: '🎨',
    category: 'technical',
    experience: '1+ year',
    description:
      'LLMアプリのUI開発に使用。ユーザーバイアス検出・緩和アプリの実装でCTO賞を獲得。',
    relatedItemIds: ['nec-llm-competition'],
    filterable: true,
  },
  {
    name: 'OpenCV',
    icon: '📷',
    category: 'technical',
    experience: '2+ years',
    description:
      '画像処理に使用。Webカメラからの色定量プログラム、OCR処理の精度向上と並列化による高速化を実装。',
    relatedItemIds: ['igem-tokyotech-2022'],
    filterable: true,
  },
  {
    name: 'Firebase',
    icon: '🔥',
    category: 'technical',
    experience: '1+ year',
    description:
      'Webアプリケーションのホスティングとデプロイ。iGEM libraryをHugo + Firebaseで構築。',
    relatedItemIds: ['igem-library'],
    filterable: true,
  },
];

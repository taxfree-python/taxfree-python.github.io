import { ProjectActivity } from '../types/activities';

export const projectsAndActivities: ProjectActivity[] = [
  {
    id: 'pfn-summer-internship',
    title: 'PFN 2024 夏期国内インターンシップ',
    date: '2024年8月 - 現在',
    description: 'Preferred Networks での LLM を用いた教育サービス開発',
    skills: ['Python', 'React', 'LLM'],
    kind: 'internship',
    category: 'work',
    detailedDescription:
      'LLMを用いた教育サービスの提案と開発を行いました。インターン終了後もパートタイマーとして継続勤務中です。',
    achievements: [
      'LLMを活用した教育サービスの開発',
      'プロンプト最適化による性能向上',
      'チーム開発でのサービス実装',
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
    title: '東工大 x NEC 生成AIアプリコンテスト',
    date: '2024年9月',
    description: 'NECの日本語特化LLMを用いたアプリコンテストでCTO賞を獲得',
    skills: ['Python', 'LLM', 'Streamlit'],
    kind: 'competition',
    category: 'work',
    detailedDescription:
      '日本電気株式会社が開発している日本語特化LLMを用いたアプリコンテストに参加し、CTO賞を獲得しました。ユーザーとの会話を通してユーザーのバイアスを特定し緩和するアプリをstreamlitを用いて実装しました。',
    achievements: [
      'CTO賞を獲得',
      'ユーザーバイアス検出・緩和アプリの開発',
      'Streamlitを用いたインタラクティブなUIの実装',
    ],
    links: [
      {
        label: 'NEC 公式サイト',
        url: 'https://jpn.nec.com/',
      },
    ],
  },
  {
    id: 'autonomous-lab-scheduling',
    title: '自動・自律実験システムのスケジューリング最適化',
    date: '2023年 - 現在',
    description: '東京大学 一杉研究室との共同研究',
    skills: ['Python', '数理最適化', 'ベイズ最適化'],
    kind: 'research',
    category: 'work',
    detailedDescription:
      '東京大学 一杉研究室が開発している自動・自律実験システムのスケジューリングを最適化するアルゴリズムを開発。材料化学に特有の測定の順序制約や装置の排他制約を含めた定式化を実現し、ベイズ最適化を含めた動的なスケジューリングを効率的に行う手法を研究しています。',
    achievements: [
      '材料化学特有の制約を考慮した定式化の実現',
      'makespanだけでない多様な目的関数の最適化',
      'ベイズ最適化を活用した動的スケジューリング手法の開発',
    ],
    links: [
      {
        label: '東京大学 一杉研究室',
        url: 'https://solid-state-chemistry.jp/',
      },
    ],
  },
  {
    id: 'doctor-car-data-analysis',
    title: 'ドクターカー運用データ分析',
    date: '2023年 - 現在',
    description: '東京科学大学 救命救急センターとの共同研究',
    skills: ['Python', 'データ分析', '医療データ'],
    kind: 'research',
    category: 'work',
    detailedDescription:
      '東京科学大学 救命救急センターが運営するドクターカーの運用データを用いて、効果的・効率的な運用を行うための知見を発見。ビジネス化も含めた技術的な提案を行っています。',
    achievements: [
      'ドクターカー運用データの分析',
      '効率的な運用のための知見発見',
      'ビジネス化を含めた技術提案',
    ],
    links: [
      {
        label: '東京科学大学 ドクターカー',
        url: 'https://www.tmd.ac.jp/accm/doctorcar/',
      },
    ],
  },
  {
    id: 'igem-tokyotech-2023',
    title: 'iGEM TokyoTech 2023 Silver メダル',
    date: '2023年',
    description: '合成生物学の国際大会でCo-Leader・Dry team leaderとして参加',
    skills: ['Python', 'Scipy', '数理モデリング', 'アルゴリズム'],
    kind: 'competition',
    category: 'work',
    detailedDescription:
      'iGEM(国際遺伝子工学マシンコンペティション)にてCo-Leader・渉外およびDry team leaderを務めました。200万円程度の寄附を獲得し、実験データを用いた物質産生量予測モデルの構築と3D-PCRの検体配置最適化アルゴリズムを開発。英語で発表と質疑応答を行いました。',
    achievements: [
      'Silver メダル獲得',
      'Co-Leader・Dry team leaderとしてチームマネジメント',
      '200万円程度の寄附獲得',
      'ODEモデルによる物質産生量予測',
      '3D-PCR検体配置最適化アルゴリズムの開発',
      '英語での発表と質疑応答',
    ],
    links: [
      {
        label: 'iGEM TokyoTech 2023',
        url: 'https://2023.igem.wiki/tokyotech',
      },
    ],
  },
  {
    id: 'igem-tokyotech-2022',
    title: 'iGEM TokyoTech 2022 Silver メダル',
    date: '2022年',
    description: 'Dry team leaderとしてデング熱流行予測モデルを構築',
    skills: ['Python', 'Keras', 'LSTM', 'OpenCV', '機械学習'],
    kind: 'competition',
    category: 'work',
    detailedDescription:
      'Dry team leaderとしてプロジェクトの設計・実装を担当。実際の感染データを用いたデング熱の流行予測モデルを構築し、LassoやLSTMを用いた時系列データの解析と予測を実施。Webカメラの画像データから特定の色を定量するプログラムも開発しました。',
    achievements: [
      'Silver メダル獲得',
      'Dry team leaderとしてマネジメント',
      'Lasso・LSTMを用いた時系列データ解析',
      '感染データに基づくデング熱流行予測',
      'OpenCVを用いた画像処理・定量プログラムの開発',
      '英語での8分間のプレゼンテーションと質疑応答',
    ],
    links: [
      {
        label: 'iGEM TokyoTech 2022',
        url: 'https://2022.igem.wiki/tokyotech',
      },
    ],
  },
  {
    id: 'trap-hackathon',
    title: 'traP ハッカソン',
    date: '2023年',
    description: 'チームリーダーとして架空の料理生成サービスを開発',
    skills: ['Python', 'FastAPI', 'MariaDB', 'OpenAI API', 'Dall-e 3'],
    kind: 'project',
    category: 'personal',
    detailedDescription:
      'チームリーダーとしてtraP ハッカソンに参加。OpenAI APIのDall-e 3を用いて架空の料理の画像とレシピを生成するサービスを開発しました。FastAPIとMariaDBを用いてバックエンドを実装しました。',
    achievements: [
      'チームリーダーとしてプロジェクト推進',
      'Dall-e 3による画像生成機能の実装',
      'FastAPI + MariaDBによるバックエンド開発',
      'サービスのデプロイと公開',
    ],
    links: [
      {
        label: '成果物',
        url: 'https://are-you-hungry.trap.show/',
      },
    ],
  },
  {
    id: 'igem-library',
    title: 'iGEM library',
    date: '2023年',
    description: '過去のiGEMプロジェクトを自然言語で検索できるライブラリ',
    skills: ['Python', 'LLM', 'GPT-4', 'Hugo', 'Firebase'],
    kind: 'project',
    category: 'personal',
    detailedDescription:
      '過去のiGEMチームのプロジェクトを自然言語で検索できるiGEM libraryを開発。要約にGPT-4を使用し、GUIはHugoで構築、Firebaseでホスティングしています。',
    achievements: [
      'GPT-4による過去プロジェクトの要約',
      '自然言語検索機能の実装',
      'Hugo + Firebaseによるウェブアプリ開発',
    ],
    links: [
      {
        label: 'iGEM library',
        url: 'https://igem-library.app/',
      },
    ],
  },
  {
    id: 'chatgpt-business-contest',
    title: 'ChatGPT ビジネスコンテスト',
    date: '2023年',
    description: 'Thursday Gathering #279でリーダーとしてピッチ',
    skills: ['Python', 'OpenAI API', 'ChatGPT', 'Gradio'],
    kind: 'competition',
    category: 'work',
    detailedDescription:
      'リーダーとしてThursday Gathering #279にてピッチを実施。ChatGPTとembeddingを用いた求人検索システムを開発し、OpenAI APIとGradioを使用してHugging Face Spaceにデプロイしました。',
    achievements: [
      'リーダーとしてビジネスピッチ',
      'ChatGPT + embeddingによる求人検索システム開発',
      'Gradioを用いたUIの実装とデプロイ',
    ],
  },
];

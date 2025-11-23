# tax_free's Portfolio & Blog

Next.js + React + TypeScriptで実装した個人サイト

## サイト構成

- **ホーム** (`/`) - 自己紹介と最新ブログ記事
- **Blog** (`/blog`) - 技術ブログ
- **CV** (`/cv`) - スキル、職歴、資格
- **Gallery** (`/gallery`) - 作品ギャラリー ⚠️ 準備中のため一時非表示

> **Note:** Gallery機能は実装済みですが、作品準備中のためナビゲーションから一時的に非表示にしています。
> 実装の詳細は後述の「Gallery機能の有効化」セクションを参照してください。

## 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Material-UI (MUI) v7**
- **Markdown** (gray-matter + remark)

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でサイトが表示されます。

## ディレクトリ構成

```
├── app/
│   ├── page.tsx              # ホームページ
│   ├── layout.tsx            # 共通レイアウト（Header含む）
│   ├── blog/
│   │   ├── page.tsx          # ブログ一覧
│   │   └── [slug]/
│   │       └── page.tsx      # ブログ記事詳細
│   ├── cv/
│   │   ├── page.tsx          # CVページ
│   │   └── CVClient.tsx      # CVクライアントコンポーネント
│   ├── gallery/
│   │   └── page.tsx          # ギャラリーページ
│   └── globals.css
├── components/               # UI コンポーネント群
│   ├── Header.tsx            # グローバルナビゲーション
│   ├── GallerySection.tsx    # ギャラリーコンポーネント
│   └── ...
├── content/
│   └── posts/                # Markdown形式のブログ記事
├── data/                     # 外部化されたコンテンツデータ
│   ├── profile.ts            # プロフィール情報
│   ├── skills.yaml           # スキル情報
│   ├── activities.yaml       # 職歴・プロジェクト
│   └── gallery.yaml          # ギャラリー作品データ
├── lib/                      # データ取得関数
│   ├── posts.ts              # ブログ記事処理
│   ├── skills.ts             # スキルデータ処理
│   ├── activities.ts         # 職歴データ処理
│   └── gallery.ts            # ギャラリーデータ処理
├── public/                   # 静的ファイル
│   └── images/
│       └── gallery/          # ギャラリー画像置き場
└── types/                    # TypeScript の型定義
    ├── skills.ts
    ├── activities.ts
    ├── gallery.ts
    └── ...
```

## ブログ記事の追加

`content/posts/` ディレクトリに Markdown ファイルを追加します。

```markdown
---
title: 記事のタイトル
date: 2025-01-01T00:00:00
draft: false
---

記事の本文をここに書きます。
```

## ビルド

```bash
# 本番用ビルド
npm run build

# 静的ファイルは out/ ディレクトリに生成されます
```

## GitHub Pagesへのデプロイ

1. GitHubリポジトリの Settings > Pages で、Source を "GitHub Actions" に設定
2. mainブランチにpushすると自動的にデプロイされます

`.github/workflows/deploy.yml` に設定済みです。

Hugo ベースの旧サイトは `legacy-hugo` ブランチで参照できます。

## コンテンツの編集

### プロフィール情報

`data/profile.ts` で以下を編集：
- ヒーローセクションのタイトル・サブタイトル
- SNSリンク (GitHub, Twitter, LinkedIn)
- 資格情報

### スキル・職歴

YAMLファイルを編集してコンテンツを更新：
- `data/skills.yaml` - スキル情報
- `data/activities.yaml` - 職歴・プロジェクト

## Gallery機能の有効化

作品の準備ができたら、以下の手順でGallery機能を有効化できます。

### 1. 作品データの追加

`data/gallery.yaml` に作品情報を追加：

```yaml
works:
  - id: work-001
    title: 作品タイトル
    date: 2025-01-15
    media: /images/gallery/work-001.jpg
    thumbnail: /images/gallery/work-001-thumb.jpg
    mediaType: image  # image, gif, video のいずれか
    description: 作品の説明
    category: illustration  # カテゴリー（任意）
    tools:
      - Procreate
      - Photoshop
    featured: true  # ホームページに表示する場合
```

### 2. 画像ファイルの配置

`public/images/gallery/` に画像を配置：
- 元画像: `work-001.jpg`
- サムネイル: `work-001-thumb.jpg` (推奨サイズ: 400x300px)

### 3. ナビゲーションリンクの表示

`components/Header.tsx` の7-8行目のコメントを外す：

```typescript
const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/cv', label: 'CV' },
  { href: '/gallery', label: 'Gallery' },  // ← コメントを外す
];
```

## スタイルのカスタマイズ

- `app/globals.css` - グローバルスタイル
- 各コンポーネントファイル - Material-UIのSxProps

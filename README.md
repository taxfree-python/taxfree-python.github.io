# tax_free's Portfolio & Blog

Next.js + React + TypeScriptで実装したポートフォリオ&ブログサイト

## 技術スタック

- **Next.js 15** (App Router)
- **React 18+**
- **TypeScript**
- **Tailwind CSS v4**
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
│   ├── page.tsx              # トップページ（ポートフォリオ）
│   ├── blog/
│   │   ├── page.tsx          # ブログ一覧
│   │   └── [slug]/
│   │       └── page.tsx      # ブログ記事詳細
│   └── globals.css
├── components/               # UI コンポーネント群
├── content/
│   └── posts/                # Markdown形式のブログ記事
├── data/                     # プロフィールやスキルなどの静的データ
├── lib/
│   └── posts.ts              # Markdown読み込み処理
├── public/                   # 静的ファイル
└── types/                    # TypeScript の型定義
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

## カスタマイズ

### プロフィール情報の変更

`app/page.tsx` の以下の部分を編集してください：

- SNSリンク (GitHub, Twitter, LinkedIn)
- About セクション
- Activities & Projects セクション

### スタイルの変更

`app/globals.css` と各コンポーネントのTailwind CSSクラスを編集してください。

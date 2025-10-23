# Components

このディレクトリには再利用可能なReactコンポーネントが含まれています。

## コンポーネント一覧

### `Card.tsx`
基本的なカードコンポーネント。白い背景、影、角丸のスタイルを提供します。

**Props:**
- `children: ReactNode` - カードの中身
- `className?: string` - 追加のCSSクラス（オプション）

**使用例:**
```tsx
<Card className="p-8">
  <h2>タイトル</h2>
  <p>内容</p>
</Card>
```

### `SkillTag.tsx`
スキルを表示するためのタグコンポーネント。

**Props:**
- `label: string` - タグに表示するテキスト
- `variant?: 'blue' | 'green'` - カラーバリエーション（デフォルト: 'blue'）

**使用例:**
```tsx
<SkillTag label="Python" variant="blue" />
<SkillTag label="React" variant="green" />
```

### `BlogPostCard.tsx`
ブログ記事のプレビューカードコンポーネント。

**Props:**
- `slug: string` - 記事のスラッグ（URL用）
- `title: string` - 記事タイトル
- `date: string` - 公開日（フォーマット済み）

**使用例:**
```tsx
<BlogPostCard
  slug="2024-01-01"
  title="記事タイトル"
  date="2024年1月1日"
/>
```

### `ActivityCard.tsx`
活動やプロジェクトを表示するカードコンポーネント。

**Props:**
- `title: string` - 活動のタイトル
- `date: string` - 日付
- `description: string` - 説明文

**使用例:**
```tsx
<ActivityCard
  title="PFN Summer Internship"
  date="2024年8月 - 9月"
  description="Preferred Networks でのサマーインターンシップに参加"
/>
```

### `SkillsSection.tsx`
スキルセクション全体を表示するコンポーネント。

**カスタマイズ:**
`data/skills.ts` でスキルカテゴリや内容を編集し、`highlights` や `achievements` に語学スコア・資格を追記します。型の変更が必要な場合は `types/skills.ts` を更新してください。

**使用例:**
```tsx
<SkillsSection />
```

### `HeroSection.tsx`
トップのヒーローセクション。タイトル・サブタイトル・SNSリンクを表示します。

**カスタマイズ:**
`data/profile.ts` の `heroContent` を更新して文言やリンクを変更します。

**使用例:**
```tsx
<HeroSection content={heroContent} />
```

### `SocialLinks.tsx`
SNS や外部リンクをボタン群で表示するコンポーネント。

**Props:**
- `links: SocialLink[]` - 表示するリンクリスト

**使用例:**
```tsx
<SocialLinks links={heroContent.socialLinks} />
```

### `AboutSection.tsx`
自己紹介セクション。複数段落を柔軟に表示できます。

**カスタマイズ:**
`data/profile.ts` の `aboutContent` でタイトルと本文を管理します。

**使用例:**
```tsx
<AboutSection content={aboutContent} />
```

### `RecentPostsSection.tsx`
最新ブログ投稿を一覧で表示するセクション。

**Props:**
- `posts: PostData[]` - 表示する記事データ

**使用例:**
```tsx
<RecentPostsSection posts={recentPosts} />
```

### `ActivitiesSection.tsx`
活動・プロジェクトセクション全体を表示するコンポーネント。

**カスタマイズ:**
`data/activities.ts` の `projectsAndActivities` を編集して活動を追加・削除します。型定義は `types/activities.ts` を参照してください。

**使用例:**
```tsx
<ActivitiesSection />
```

## コンポーネント設計の原則

1. **単一責任の原則**: 各コンポーネントは1つの明確な役割を持つ
2. **再利用性**: 汎用的な`Card`コンポーネントを基盤として、特定用途のコンポーネントを構築
3. **型安全性**: TypeScriptのインターフェースで全てのpropsを定義
4. **カスタマイズ性**: `className`プロップで追加のスタイリングが可能
5. **保守性**: データとUIを分離し、定数として管理

## ディレクトリ構造

```
components/
├── Card.tsx                  # 基本カード
├── SkillTag.tsx             # スキルタグ
├── BlogPostCard.tsx         # ブログカード
├── ActivityCard.tsx         # アクティビティカード
├── SkillsSection.tsx        # スキルセクション
├── ActivitiesSection.tsx    # アクティビティセクション
├── HeroSection.tsx          # ヒーローセクション
├── SocialLinks.tsx          # SNSリンク群
├── AboutSection.tsx         # 自己紹介セクション
├── RecentPostsSection.tsx   # 最新記事セクション
└── README.md                # このファイル
```

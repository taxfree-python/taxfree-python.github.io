import { getPost, getPostSlugs } from '@/lib/posts';
import Link from 'next/link';
import { Container, Box, Typography, Link as MuiLink } from '@mui/material';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import ArticleContent from '@/components/article/ArticleContent';
import type { ArticleBlocks } from '@/lib/article-blocks';
import { fontFamilyMono } from '@/lib/theme';

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Articles that embed React blocks, mapped to the module exporting them. */
const articleBlocks: Record<string, () => Promise<{ blocks: ArticleBlocks }>> = {
  '2026-07-06': () => import('@/components/2026-07-06/blocks'),
  '2026-09-19': () => import('@/components/2026-09-19/blocks'),
  '2026-09-26': () => import('@/components/2026-09-26/blocks'),
};

const postContentClassName = `prose prose-lg dark:prose-invert max-w-none
  prose-headings:text-gray-900 dark:prose-headings:text-white
  prose-p:text-gray-700 dark:prose-p:text-gray-300
  prose-a:text-blue-600 dark:prose-a:text-blue-400
  prose-code:text-gray-900 dark:prose-code:text-gray-100
  prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900`;

export async function generateStaticParams() {
  return getPostSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = `${post.title} | ${siteConfig.name}`;
  const description = post.description || post.title;
  const url = `${siteConfig.url}/blog/${slug}`;

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      locale: siteConfig.locale,
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage.url,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: post.title,
        },
      ],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.social.twitter,
      creator: siteConfig.social.twitter,
      title,
      description,
      images: [siteConfig.ogImage.url],
    },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  const loadBlocks = articleBlocks[slug];
  const blocks = loadBlocks ? (await loadBlocks()).blocks : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md" component="section" sx={{ pt: 4, pb: 6 }}>
        <MuiLink
          component={Link}
          href="/blog"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 3,
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              color: 'text.primary',
              textDecoration: 'underline',
            },
          }}
        >
          <span>←</span>
          <span>Back to Blog</span>
        </MuiLink>

        <Box
          component="article"
          data-figure-article={blocks ? '' : undefined}
          sx={{
            mt: 2,
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: 'text.primary',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              mb: 1.5,
            },
            '& h1': { fontSize: '2rem' },
            '& h2': { fontSize: '1.6rem' },
            '& h3': { fontSize: '1.3rem' },
            '&[data-figure-article] h4': { fontSize: '1.1rem' },
            '& p': {
              color: 'text.secondary',
              lineHeight: 1.8,
              mb: 2,
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            },
            '& code': {
              fontFamily: fontFamilyMono,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              color: 'text.primary',
            },
            '& pre': {
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 2,
              p: 2,
              overflowX: 'auto',
              fontFamily: fontFamilyMono,
              color: 'text.primary',
            },
            '&[data-figure-article] pre code': {
              backgroundColor: 'transparent',
              p: 0,
            },
            '&[data-figure-article] .katex-display': {
              fontSize: '1.2rem',
              my: 3,
            },
            '&[data-figure-article] .article-figure': {
              my: 3,
            },
            '&[data-figure-article] .article-figure svg': {
              display: 'block',
              width: '100%',
              height: 'auto',
            },
            '&[data-figure-article] .article-figure-mobile': {
              display: 'none',
            },
            '@media (max-width: 600px)': {
              '&[data-figure-article] .article-figure-desktop': { display: 'none' },
              '&[data-figure-article] .article-figure-mobile': { display: 'block' },
            },
            '&[data-figure-article] h2, &[data-figure-article] h3, &[data-figure-article] h4': {
              scrollMarginTop: '96px',
            },
            '&[data-figure-article] p > code, &[data-figure-article] li > code': {
              overflowWrap: 'anywhere',
            },
            '& .article-toc': {
              my: 4,
              py: 2,
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              '& p': { mb: 1, color: 'text.primary' },
              '& ol': { mb: 0, pl: 3 },
              '& ul': { mt: 0.5, mb: 1, pl: 2.5 },
              '& li': { mb: 0.5, fontSize: '0.9375rem' },
              '& a': { color: 'text.secondary' },
            },
            '& p.article-caption': {
              textAlign: 'center',
            },
            '& .article-table': {
              overflowX: 'auto',
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9375rem',
              lineHeight: 1.7,
              my: 3,
            },
            '& th, & td': {
              textAlign: 'left',
              verticalAlign: 'top',
              px: { xs: 0.5, sm: 2 },
              py: 1,
              overflowWrap: 'break-word',
              '&:first-child': { pl: 0 },
              '&:last-child': { pr: 0 },
            },
            // Respect markdown column alignment (`:---:`/`---:`), which survives as the `align` attribute
            '& th[align="center"], & td[align="center"]': { textAlign: 'center' },
            '& th[align="right"], & td[align="right"]': { textAlign: 'right' },
            '& th': {
              color: 'text.primary',
              fontWeight: 500,
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& td': {
              color: 'text.secondary',
              fontVariantNumeric: 'tabular-nums',
            },
            '& ul, & ol': {
              color: 'text.secondary',
              pl: 3,
              mb: 2,
            },
            '& li': {
              mb: 1,
              lineHeight: 1.7,
            },
            '& blockquote': {
              borderLeft: '3px solid',
              borderColor: 'divider',
              pl: 2,
              color: 'text.secondary',
              fontStyle: 'italic',
              mb: 2,
            },
            '& img': {
              maxWidth: '100%',
              borderRadius: 2,
            },
          }}
        >
          <Box component="header" sx={{ mb: 4 }}>
            {post.draft && (
              <Typography variant="caption" color="text.secondary">
                DRAFT · ローカルプレビュー
              </Typography>
            )}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 1,
                fontWeight: 400,
                letterSpacing: '-0.02em'
              }}
            >
              {post.title}
            </Typography>
            <Typography variant="body2" component="time" color="text.secondary">
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>

          {blocks ? (
            <div className={postContentClassName}>
              <ArticleContent html={post.contentHtml} blocks={blocks} />
            </div>
          ) : (
            <div className={postContentClassName} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          )}
        </Box>
      </Container>
    </Box>
  );
}

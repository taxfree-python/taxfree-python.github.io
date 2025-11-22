import { getPostData, getAllPostSlugs } from '@/lib/posts';
import Link from 'next/link';
import { Container, Box, Typography, Link as MuiLink } from '@mui/material';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md" component="section" sx={{ py: 6 }}>
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
          sx={{
            mt: 2,
          }}
        >
          <Box component="header" sx={{ mb: 4 }}>
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

          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-blue-600 dark:prose-a:text-blue-400
              prose-code:text-gray-900 dark:prose-code:text-gray-100
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
          />
        </Box>
      </Container>
    </Box>
  );
}

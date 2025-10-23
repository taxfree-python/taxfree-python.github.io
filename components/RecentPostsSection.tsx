import Link from 'next/link';
import { Container, Typography, Box, Stack } from '@mui/material';
import { BlogPostCard } from './BlogPostCard';
import type { PostData } from '@/lib/posts';

interface RecentPostsSectionProps {
  posts: PostData[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h2" component="h2">
          Recent Posts
        </Typography>
        <Link href="/blog" style={{ textDecoration: 'none' }}>
          <Typography
            color="primary"
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View All →
          </Typography>
        </Link>
      </Box>

      {posts.length === 0 ? (
        <Typography color="text.secondary">
          まだ公開されている記事はありません。
        </Typography>
      ) : (
        <Stack spacing={2}>
          {posts.map((post) => (
            <BlogPostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}

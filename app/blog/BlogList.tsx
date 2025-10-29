'use client';

import { useState } from 'react';
import { BlogPostCard } from '@/components/BlogPostCard';
import { BlogEmptyState } from '@/components/BlogEmptyState';
import { Container, Box, Typography, Stack, Button } from '@mui/material';
import type { PostData } from '@/lib/posts';

const POSTS_PER_PAGE = 10;

interface BlogListProps {
  posts: PostData[];
}

export function BlogList({ posts }: BlogListProps) {
  const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE);

  if (posts.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8e8e8 100%)',
          '@media (prefers-color-scheme: dark)': {
            background: 'linear-gradient(to bottom, #0a0a0a 0%, #141414 100%)',
          },
        }}
      >
        <BlogEmptyState />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8e8e8 100%)',
        '@media (prefers-color-scheme: dark)': {
          background: 'linear-gradient(to bottom, #0a0a0a 0%, #141414 100%)',
        },
      }}
    >
      <Container maxWidth="md" component="section" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
            Blog Posts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {posts.length} articles
          </Typography>
        </Box>

        <Stack spacing={2}>
          {posts.slice(0, displayCount).map((post) => (
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

        {displayCount < posts.length && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => setDisplayCount((prev) => prev + POSTS_PER_PAGE)}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                backgroundColor: 'rgba(23, 23, 23, 0.3)',
                backdropFilter: 'blur(10px)',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'text.secondary',
                  backgroundColor: 'rgba(23, 23, 23, 0.5)',
                },
              }}
            >
              もっと見る
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

'use client';

import { useState } from 'react';
import { BlogPostCard } from '@/components/BlogPostCard';
import { BlogEmptyState } from '@/components/BlogEmptyState';
import { Container, Box, Stack, Button } from '@mui/material';
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
          bgcolor: 'background.default',
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
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="md" component="section" sx={{ py: 6, pb: 10 }}>
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
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Button
              onClick={() => setDisplayCount((prev) => prev + POSTS_PER_PAGE)}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              もっと見る →
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

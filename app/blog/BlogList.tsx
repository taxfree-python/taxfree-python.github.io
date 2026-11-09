'use client';

import { useRef, useState } from 'react';
import { BlogPostCard, BLOG_POST_CARD_HEIGHT, BLOG_POST_CARD_DIVIDER_WIDTH } from '@/components/BlogPostCard';
import { BlogEmptyState } from '@/components/BlogEmptyState';
import { Container, Box, Stack, Button } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { PostMeta } from '@/types';

const POSTS_PER_PAGE = 10;
const LIST_GAP = '16px';
/** The "もっと見る" row: 16px above the button plus the button (36.5px). */
const MORE_ROW_HEIGHT = '3.5rem';

type BlogListProps = {
  posts: PostMeta[];
};

/**
 * Viewport height minus the header, per breakpoint. The header is one Toolbar,
 * whose height is theme.mixins.toolbar's minHeight at each breakpoint.
 */
function heightBelowHeader(theme: Theme) {
  const toolbar = theme.mixins.toolbar as Record<string, number | { minHeight: number }>;
  return Object.fromEntries(
    Object.entries(toolbar).map(([key, value]) =>
      typeof value === 'number'
        ? ['height', `calc(100dvh - ${value}px)`]
        : [key, { height: `calc(100dvh - ${value.minHeight}px)` }],
    ),
  );
}

/**
 * Before the first "もっと見る" click, the section is exactly the viewport
 * below the header and does not scroll. Cards have a fixed height, so CSS
 * rounds the space left above the "もっと見る" row down to a whole number of
 * cards and sizes the list to that, less the last card's divider; the row sits
 * right under the last card from the first paint. A click counts the cards
 * that start inside the list, adds POSTS_PER_PAGE, and switches to a plain
 * scrolling list.
 */
export function BlogList({ posts }: BlogListProps) {
  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  if (posts.length === 0) {
    return <BlogEmptyState />;
  }

  const expanded = displayCount !== null;

  const showMore = () => {
    if (expanded) {
      setDisplayCount(displayCount + POSTS_PER_PAGE);
      return;
    }
    const list = listRef.current!;
    const listBottom = list.getBoundingClientRect().bottom;
    const cards = Array.from(list.children);
    const visible = cards.filter((card) => card.getBoundingClientRect().top < listBottom).length;
    setDisplayCount(visible + POSTS_PER_PAGE);
  };

  return (
    <Container
      maxWidth="md"
      component="section"
      sx={
        expanded
          ? { pt: 4, pb: 10 }
          : (theme) => ({ pt: 4, pb: 2, containerType: 'size', ...heightBelowHeader(theme) })
      }
    >
      <Stack
        ref={listRef}
        useFlexGap
        sx={{
          rowGap: LIST_GAP,
          ...(expanded
            ? {}
            : {
                height: `calc(round(down, 100cqh - ${MORE_ROW_HEIGHT} + ${LIST_GAP}, ${BLOG_POST_CARD_HEIGHT} + ${LIST_GAP}) - ${LIST_GAP} - ${BLOG_POST_CARD_DIVIDER_WIDTH})`,
                overflow: 'clip',
              }),
        }}
      >
        {posts.slice(0, displayCount ?? posts.length).map((post) => (
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

      {(!expanded || displayCount < posts.length) && (
        <Box sx={{ height: MORE_ROW_HEIGHT, pt: 2, textAlign: 'center' }}>
          <Button
            onClick={showMore}
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              fontWeight: 400,
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
  );
}

import Link from 'next/link';
import { Typography, Box } from '@mui/material';

/**
 * Every card has this height: 0.5rem padding above and below, a 1.6rem title
 * row (one line, ellipsised), a 4px gap, a 1.5rem date row, and room for the
 * 1px divider. Lists use it to fit a whole number of cards without measuring.
 */
export const BLOG_POST_CARD_HEIGHT = '4.5rem';

/** The divider at the bottom of every card but the last, inside its height. */
export const BLOG_POST_CARD_DIVIDER_WIDTH = '1px';

type BlogPostCardProps = {
  slug: string;
  title: string;
  date: string;
};

export function BlogPostCard({ slug, title, date }: BlogPostCardProps) {
  return (
    <Box
      sx={{
        height: BLOG_POST_CARD_HEIGHT,
        flexShrink: 0,
        boxSizing: 'border-box',
        py: '0.5rem',
        display: 'grid',
        gridTemplateRows: '1.6rem 1.5rem',
        rowGap: 0.5,
        alignContent: 'start',
        '&:not(:last-child)': {
          borderBottom: `${BLOG_POST_CARD_DIVIDER_WIDTH} solid`,
          borderColor: 'divider',
        }
      }}
    >
      <Link href={`/blog/${slug}`} style={{ textDecoration: 'none', minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            lineHeight: '1.6rem',
            color: 'text.primary',
            '&:hover': {
              textDecoration: 'underline',
            },
            transition: 'all 0.2s',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </Typography>
      </Link>
      <Typography
        variant="body2"
        component="time"
        color="text.secondary"
        sx={{ lineHeight: '1.5rem' }}
      >
        {date}
      </Typography>
    </Box>
  );
}

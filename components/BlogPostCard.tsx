import Link from 'next/link';
import { Typography, Box } from '@mui/material';

interface BlogPostCardProps {
  slug: string;
  title: string;
  date: string;
}

export function BlogPostCard({ slug, title, date }: BlogPostCardProps) {
  return (
    <Box
      sx={{
        py: 1,
        '&:not(:last-child)': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        }
      }}
    >
      <Link href={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            letterSpacing: '-0.01em',
            mb: 0.5,
            color: 'text.primary',
            '&:hover': {
              textDecoration: 'underline',
            },
            transition: 'all 0.2s',
          }}
        >
          {title}
        </Typography>
      </Link>
      <Typography
        variant="body2"
        component="time"
        color="text.secondary"
      >
        {date}
      </Typography>
    </Box>
  );
}

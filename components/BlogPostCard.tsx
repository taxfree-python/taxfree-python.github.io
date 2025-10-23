import Link from 'next/link';
import { Typography } from '@mui/material';
import { Card } from './Card';

interface BlogPostCardProps {
  slug: string;
  title: string;
  date: string;
}

export function BlogPostCard({ slug, title, date }: BlogPostCardProps) {
  return (
    <Card sx={{ '&:hover': { boxShadow: 6 } }}>
      <Link href={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            color: 'text.primary',
            '&:hover': { color: 'primary.main' },
            transition: 'color 0.2s',
          }}
        >
          {title}
        </Typography>
      </Link>
      <Typography variant="body2" component="time" color="text.secondary">
        {date}
      </Typography>
    </Card>
  );
}

import NextLink from 'next/link';
import { Box, Container, Link, Typography } from '@mui/material';
import type { GalleryWork } from '@/types';
import { GalleryEmptyState } from './GalleryEmptyState';

type GallerySectionProps = {
  works: GalleryWork[];
  showTitle?: boolean;
};

function formatMonth(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

export function GallerySection({ works, showTitle = true }: GallerySectionProps) {
  // 作品が0件の場合はEmptyStateを表示
  if (works.length === 0) {
    return <GalleryEmptyState />;
  }

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      {showTitle && (
        <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 4 }}>
          Gallery
        </Typography>
      )}

      <Box>
        {works.map((work) => (
          <Box key={work.id} sx={{ mb: 3 }}>
            <Link
              component={NextLink}
              href={work.href}
              variant="h6"
              underline="hover"
              sx={{
                // Keep the hover underline continuous under descenders (g, y, p)
                // by moving it below them instead of letting the browser skip ink.
                textUnderlineOffset: '0.25em',
                textDecorationSkipInk: 'none',
              }}
            >
              {work.title}
            </Link>
            <Typography variant="caption" color="text.secondary" display="block">
              {formatMonth(work.date)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

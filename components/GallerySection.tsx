'use client';

import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Card, CardMedia, CardContent, Chip } from '@mui/material';
import type { GalleryWork } from '@/types/gallery';
import { GalleryEmptyState } from './GalleryEmptyState';

type GallerySectionProps = {
  works: GalleryWork[];
  showTitle?: boolean;
};

export function GallerySection({ works, showTitle = true }: GallerySectionProps) {
  const router = useRouter();

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

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {works.map((work) => (
          <Card
            key={work.id}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
            onClick={() => router.push(work.media)}
          >
            <CardMedia
              component="img"
              image={work.thumbnail}
              alt={work.title}
              sx={{ height: 240, objectFit: 'cover' }}
            />
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {work.title}
                <Chip label="Interactive" size="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                {new Date(work.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                })}
              </Typography>
              {work.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {work.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

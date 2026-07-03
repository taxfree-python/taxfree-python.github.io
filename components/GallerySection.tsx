'use client';

import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import type { GalleryWork } from '@/types/gallery';
import { GalleryEmptyState } from './GalleryEmptyState';

type GallerySectionProps = {
  works: GalleryWork[];
  showTitle?: boolean;
  showCategories?: boolean;
};

export function GallerySection({ works, showTitle = true, showCategories = true }: GallerySectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 作品が0件の場合はEmptyStateを表示
  if (works.length === 0) {
    return <GalleryEmptyState />;
  }

  // Get unique categories
  const categories = [
    'all',
    ...Array.from(
      new Set(
        works
          .map((work) => work.category)
          .filter((category): category is string => category !== undefined && category.length > 0),
      ),
    ),
  ];

  // Filter works by category
  const filteredWorks =
    selectedCategory === 'all'
      ? works
      : works.filter((work) => work.category === selectedCategory);

  const handleCategoryChange = (_event: SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      {showTitle && (
        <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 4 }}>
          Gallery
        </Typography>
      )}

      {showCategories && categories.length > 1 && (
        <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" value="all" />
            {categories.slice(1).map((category) => {
              const label = category.charAt(0).toUpperCase() + category.slice(1);
              return (
                <Tab
                  key={category}
                  label={label}
                  value={category}
                />
              );
            })}
          </Tabs>
        </Box>
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
        {filteredWorks.map((work) => (
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

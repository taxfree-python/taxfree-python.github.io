'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { GalleryWork } from '@/types/gallery';
import { GalleryEmptyState } from './GalleryEmptyState';

interface GallerySectionProps {
  works: GalleryWork[];
  showTitle?: boolean;
  showCategories?: boolean;
}

export function GallerySection({ works, showTitle = true, showCategories = true }: GallerySectionProps) {
  const [selectedWork, setSelectedWork] = useState<GalleryWork | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 作品が0件の場合はEmptyStateを表示
  if (works.length === 0) {
    return <GalleryEmptyState />;
  }

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(works.map(w => w.category).filter(Boolean)))];

  // Filter works by category
  const filteredWorks =
    selectedCategory === 'all'
      ? works
      : works.filter(w => w.category === selectedCategory);

  const handleWorkClick = (work: GalleryWork) => {
    setSelectedWork(work);
  };

  const handleCloseDialog = () => {
    setSelectedWork(null);
  };

  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const renderMedia = (work: GalleryWork, isThumbnail: boolean = true) => {
    const src = isThumbnail ? work.thumbnail : work.media;

    if (work.mediaType === 'video') {
      return (
        <video
          src={src}
          controls={!isThumbnail}
          autoPlay={!isThumbnail}
          loop
          style={{
            width: '100%',
            height: isThumbnail ? 240 : 'auto',
            objectFit: 'cover',
          }}
        />
      );
    }

    return (
      <CardMedia
        component="img"
        image={src}
        alt={work.title}
        sx={{
          height: isThumbnail ? 240 : 'auto',
          objectFit: 'cover',
        }}
      />
    );
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
            {categories.slice(1).map(category => {
              const categoryStr = category || '';
              const label = categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);
              return (
                <Tab
                  key={categoryStr}
                  label={label}
                  value={categoryStr}
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
        {filteredWorks.map(work => (
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
            onClick={() => handleWorkClick(work)}
          >
            {renderMedia(work, true)}
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {work.title}
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

      {/* Lightbox Dialog */}
      <Dialog
        open={!!selectedWork}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
          },
        }}
      >
        <IconButton
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.primary',
            zIndex: 1,
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {selectedWork && (
          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ position: 'relative' }}>
              {renderMedia(selectedWork, false)}
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                {selectedWork.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {new Date(selectedWork.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              {selectedWork.description && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedWork.description}
                </Typography>
              )}
              {selectedWork.tools && selectedWork.tools.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Tools Used
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedWork.tools.map(tool => (
                      <Box
                        key={tool}
                        sx={{
                          px: 2,
                          py: 0.5,
                          bgcolor: 'action.selected',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2">{tool}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  );
}

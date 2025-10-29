'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GalleryWork } from '@/types/gallery';

interface FeaturedWorksSectionProps {
  works: GalleryWork[];
}

export function FeaturedWorksSection({ works }: FeaturedWorksSectionProps) {
  const [selectedWork, setSelectedWork] = useState<GalleryWork | null>(null);

  if (works.length === 0) {
    return null;
  }

  const handleWorkClick = (work: GalleryWork) => {
    setSelectedWork(work);
  };

  const handleCloseDialog = () => {
    setSelectedWork(null);
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
            height: isThumbnail ? 200 : 'auto',
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
          height: isThumbnail ? 200 : 'auto',
          objectFit: 'cover',
        }}
      />
    );
  };

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h2" component="h2">
          Featured Works
        </Typography>
        <Link href="/gallery" passHref style={{ textDecoration: 'none' }}>
          <Button
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            View All
          </Button>
        </Link>
      </Box>

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
        {works.map(work => (
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
              <Typography variant="caption" color="text.secondary">
                {new Date(work.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                })}
              </Typography>
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

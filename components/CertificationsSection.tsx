'use client';

import { useState } from 'react';
import { Container, Typography, Box, Stack, Collapse } from '@mui/material';
import { CertificationsContent } from '@/types/profile';
import { formatActivityDate } from '@/lib/activityPeriod';

interface CertificationsSectionProps {
  content: CertificationsContent;
}

export function CertificationsSection({ content }: CertificationsSectionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (name: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 400,
          letterSpacing: '-0.02em'
        }}
      >
        {content.title}
      </Typography>
      <Stack spacing={2}>
        {content.certifications.map((certification) => (
          <Box key={certification.name}>
            <Box
              onClick={() => toggleExpanded(certification.name)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  letterSpacing: '-0.01em'
                }}
              >
                {certification.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  ml: 2,
                  whiteSpace: 'nowrap'
                }}
              >
                {formatActivityDate(certification.acquiredDate)}
              </Typography>
            </Box>
            <Collapse in={expandedIds.has(certification.name)}>
              <Box sx={{ py: 2, pl: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {certification.issuer}
                </Typography>
                {certification.score && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {certification.score}
                  </Typography>
                )}
                {certification.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {certification.description}
                  </Typography>
                )}
              </Box>
            </Collapse>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}

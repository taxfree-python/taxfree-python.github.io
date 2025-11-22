'use client';

import { useState } from 'react';
import { Container, Typography, Box, Stack, Collapse } from '@mui/material';
import { QualificationsContent } from '@/types/profile';
import { formatActivityDate } from '@/lib/activityPeriod';

interface QualificationsSectionProps {
  content: QualificationsContent;
}

export function QualificationsSection({ content }: QualificationsSectionProps) {
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
        {content.qualifications.map((qualification) => (
          <Box key={qualification.name}>
            <Box
              onClick={() => toggleExpanded(qualification.name)}
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
                {qualification.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  ml: 2,
                  whiteSpace: 'nowrap'
                }}
              >
                {formatActivityDate(qualification.acquiredDate)}
              </Typography>
            </Box>
            <Collapse in={expandedIds.has(qualification.name)}>
              <Box sx={{ py: 2, pl: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {qualification.issuer}
                </Typography>
                {qualification.score && (
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5
                    }}
                  >
                    {qualification.score}
                  </Typography>
                )}
                {qualification.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {qualification.description}
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

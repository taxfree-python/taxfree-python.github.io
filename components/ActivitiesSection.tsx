'use client';

import { useState } from 'react';
import { Container, Typography, Box, Stack, Button, Collapse } from '@mui/material';
import { ProjectActivity } from '../types/activities';
import { formatActivityPeriod } from '../lib/activityPeriod';

interface ActivitiesSectionProps {
  activities: ProjectActivity[];
  allActivities?: ProjectActivity[];
}

export function ActivitiesSection({ activities, allActivities = [] }: ActivitiesSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const displayedActivities = showAll ? allActivities : activities;
  const hasMore = allActivities.length > activities.length;

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6, pb: 10 }}>
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
        Experience
      </Typography>

      <Stack spacing={2}>
        {displayedActivities.map((activity) => (
          <Box key={activity.id}>
            <Box
              onClick={() => toggleExpanded(activity.id)}
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
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {activity.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize'
                  }}
                >
                  [{activity.category}]
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  ml: 2,
                  whiteSpace: 'nowrap'
                }}
              >
                {formatActivityPeriod(activity.period)}
              </Typography>
            </Box>
            <Collapse in={expandedIds.has(activity.id)}>
              <Box sx={{ py: 2, pl: 2 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {activity.description}
                </Typography>
              </Box>
            </Collapse>
          </Box>
        ))}
      </Stack>

      {hasMore && (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            onClick={() => setShowAll(!showAll)}
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              }
            }}
          >
            {showAll ? '← Show Less' : 'View All Experience →'}
          </Button>
        </Box>
      )}
    </Container>
  );
}

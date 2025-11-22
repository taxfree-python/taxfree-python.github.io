'use client';

import { useState } from 'react';
import { Container, Typography, Box, Stack, Button, Collapse } from '@mui/material';
import { ProjectActivity, ActivityCategory } from '../types/activities';
import { formatActivityPeriod, getActivityPeriodEndValue, getActivityPeriodStartValue } from '../lib/activityPeriod';

interface ActivitiesSectionProps {
  activities: ProjectActivity[];
  allActivities?: ProjectActivity[];
}

const categoryLabels: Record<ActivityCategory, string> = {
  work: 'Work',
  research: 'Research',
  others: 'Others',
};

const categoryOrder: ActivityCategory[] = ['work', 'research', 'others'];

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

  // Sort activities by end date (most recent first, ongoing activities at top)
  const sortedActivities = [...displayedActivities].sort((a, b) => {
    const endA = getActivityPeriodEndValue(a.period);
    const endB = getActivityPeriodEndValue(b.period);

    if (endA !== endB) {
      return endB - endA; // Descending order (most recent first)
    }

    // If end dates are the same, sort by start date (most recent first)
    const startA = getActivityPeriodStartValue(a.period);
    const startB = getActivityPeriodStartValue(b.period);
    return startB - startA;
  });

  // Group activities by category
  const groupedActivities = categoryOrder.reduce((acc, category) => {
    acc[category] = sortedActivities.filter(a => a.category === category);
    return acc;
  }, {} as Record<ActivityCategory, ProjectActivity[]>);

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

      <Stack spacing={6}>
        {categoryOrder.map((category) => {
          const categoryActivities = groupedActivities[category];
          if (categoryActivities.length === 0) return null;

          return (
            <Box key={category}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: 'text.secondary',
                  fontSize: '1rem'
                }}
              >
                {categoryLabels[category]}
              </Typography>
              <Stack spacing={2}>
                {categoryActivities.map((activity) => (
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
            </Box>
          );
        })}
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

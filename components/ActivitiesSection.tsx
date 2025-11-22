'use client';

import { useState } from 'react';
import { Container, Typography, Box, Stack, Button } from '@mui/material';
import { ProjectActivity } from '../types/activities';
import { formatActivityPeriod } from '../lib/activityPeriod';

interface ActivitiesSectionProps {
  selectedSkill?: string | null;
  activities: ProjectActivity[];
  allActivities?: ProjectActivity[];
}

export function ActivitiesSection({ activities, allActivities = [] }: ActivitiesSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedActivities = showAll ? allActivities : activities;
  const hasMore = allActivities.length > activities.length;

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
        {displayedActivities.map((activity) => (
          <Box
            key={activity.id}
            sx={{
              '&:not(:last-child)': {
                pb: 6,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                letterSpacing: '-0.01em',
                mb: 0.5
              }}
            >
              {activity.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {formatActivityPeriod(activity.period)}
            </Typography>

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

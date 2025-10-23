'use client';

import { useState } from 'react';
import { Container, Typography, Stack } from '@mui/material';
import { ActivityCard } from './ActivityCard';
import { ActivityDialog } from './ActivityDialog';
import { projectsAndActivities } from '../data/activities';
import { ProjectActivity } from '../types/activities';

interface ActivitiesSectionProps {
  selectedSkill?: string | null;
}

export function ActivitiesSection({ selectedSkill }: ActivitiesSectionProps) {
  const [selectedActivity, setSelectedActivity] = useState<ProjectActivity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const source: ProjectActivity[] = projectsAndActivities;
  const filteredActivities = selectedSkill
    ? source.filter((activity) => activity.skills.includes(selectedSkill))
    : source;

  const handleActivityClick = (activity: ProjectActivity) => {
    setSelectedActivity(activity);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedActivity(null);
  };

  return (
    <Container maxWidth="md" component="section" sx={{ py: 6, pb: 10 }}>
      <Typography variant="h2" component="h2" gutterBottom>
        Activities & Projects
        {selectedSkill && (
          <Typography
            component="span"
            variant="h6"
            color="text.secondary"
            sx={{ ml: 2, fontWeight: 'normal' }}
          >
            - Filtered by: {selectedSkill}
          </Typography>
        )}
      </Typography>

      {filteredActivities.length === 0 ? (
        <Typography color="text.secondary">
          該当するアクティビティはありません
        </Typography>
      ) : (
        <Stack spacing={2}>
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              title={activity.title}
              date={activity.date}
              description={activity.description}
              skills={activity.skills}
              onClick={() => handleActivityClick(activity)}
            />
          ))}
        </Stack>
      )}

      <ActivityDialog
        activity={selectedActivity}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </Container>
  );
}

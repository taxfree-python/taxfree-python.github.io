'use client';

import { useState } from 'react';
import { Container, Typography, Stack, Tabs, Tab, Box } from '@mui/material';
import { ActivityCard } from './ActivityCard';
import { ActivityDialog } from './ActivityDialog';
import { projectsAndActivities } from '../data/activities';
import { ProjectActivity, ActivityCategory } from '../types/activities';

interface ActivitiesSectionProps {
  selectedSkill?: string | null;
}

type TabValue = 'all' | ActivityCategory;

export function ActivitiesSection({ selectedSkill }: ActivitiesSectionProps) {
  const [selectedActivity, setSelectedActivity] = useState<ProjectActivity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabValue>('all');

  const source: ProjectActivity[] = projectsAndActivities;

  // Filter by category tab
  const categoryFiltered = selectedTab === 'all'
    ? source
    : source.filter((activity) => activity.category === selectedTab);

  // Then filter by skill if selected
  const filteredActivities = selectedSkill
    ? categoryFiltered.filter((activity) => activity.skills.includes(selectedSkill))
    : categoryFiltered;

  const handleActivityClick = (activity: ProjectActivity) => {
    setSelectedActivity(activity);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedActivity(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setSelectedTab(newValue);
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="activity category tabs">
          <Tab label="All" value="all" />
          <Tab label="Work" value="work" />
          <Tab label="Personal" value="personal" />
        </Tabs>
      </Box>

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

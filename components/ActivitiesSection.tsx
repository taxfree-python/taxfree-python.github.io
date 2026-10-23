import { Container, Typography, Box, Stack } from '@mui/material';
import { ActivityRow } from '@/components/ActivityRow';
import { ACTIVITY_CATEGORIES, type Activity, type ActivityCategory, type CalendarPeriod } from '@/types';

type ActivitiesSectionProps = {
  activities: Activity[];
};

const categoryLabels: Record<ActivityCategory, string> = {
  education: 'Education',
  work: 'Work',
  research: 'Research',
  community: 'Community',
};

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  // Sort by the years shown (end year desc, ongoing first, then start year desc)
  // so the order matches what the reader sees rather than hidden months.
  const endYear = (period: CalendarPeriod) => period.end?.year ?? Infinity;
  const sortedActivities = [...activities].sort(
    (a, b) => endYear(b.period) - endYear(a.period) || b.period.start.year - a.period.start.year,
  );

  return (
    <Container
      maxWidth="md"
      component="section"
      sx={{
        pt: 4,
        pb: 10,
        // Print is black on white: the dark theme's greys would vanish on paper.
        '@media print': { pt: 0, pb: 0, '& .MuiTypography-root': { color: 'common.black' } },
      }}
    >
      <Stack spacing={6}>
        {ACTIVITY_CATEGORIES.map((category) => (
          <Box key={category}>
            <Typography
              variant="body2"
              component="h2"
              sx={{ mb: 2, color: 'text.secondary', breakAfter: 'avoid' }}
            >
              {categoryLabels[category]}
            </Typography>
            <Stack spacing={2}>
              {sortedActivities
                .filter((activity) => activity.category === category)
                .map((activity) => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}

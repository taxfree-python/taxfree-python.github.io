import { Container, Typography, Box, Stack } from '@mui/material';
import { ACTIVITY_CATEGORIES, type Activity, type ActivityCategory, type CalendarPeriod } from '@/types';

type ActivitiesSectionProps = {
  activities: Activity[];
};

const categoryLabels: Record<ActivityCategory, string> = {
  work: 'Work',
  research: 'Research',
  community: 'Community',
};

// Year-only period end, e.g. "present" or "2025". Single-year periods keep the
// "start – end" shape so every row lines up.
function formatEndYear(period: CalendarPeriod): string {
  return period.end === undefined ? 'present' : `${period.end.year}`;
}

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  // Sort by the years shown (end year desc, ongoing first, then start year desc)
  // so the order matches what the reader sees rather than hidden months.
  const endYear = (period: CalendarPeriod) => period.end?.year ?? Infinity;
  const sortedActivities = [...activities].sort(
    (a, b) => endYear(b.period) - endYear(a.period) || b.period.start.year - a.period.start.year,
  );

  return (
    <Container maxWidth="md" component="section" sx={{ pt: 4, pb: 10 }}>
      <Stack spacing={6}>
        {ACTIVITY_CATEGORIES.map((category) => (
          <Box key={category}>
            <Typography variant="body2" component="h2" sx={{ mb: 2, color: 'text.secondary' }}>
              {categoryLabels[category]}
            </Typography>
            <Stack spacing={2}>
              {sortedActivities
                .filter((activity) => activity.category === category)
                .map((activity) => (
                  <Box
                    key={activity.id}
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}
                  >
                    <Typography variant="subtitle1" component="p" sx={{ minWidth: 0, flex: '1 1 auto' }}>
                      {activity.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        flexShrink: 0,
                        display: 'inline-grid',
                        gridTemplateColumns: 'auto auto 4.5em',
                        columnGap: '0.4em',
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      <span>{activity.period.start.year}</span>
                      <span>–</span>
                      <span>{formatEndYear(activity.period)}</span>
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}

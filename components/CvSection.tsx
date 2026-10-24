import { Container, Typography, Box, Stack } from '@mui/material';
import { ActivityRow } from '@/components/ActivityRow';
import { PublicationsSection } from '@/components/PublicationsSection';
import {
  ACTIVITY_CATEGORIES,
  type Activity,
  type ActivityCategory,
  type CalendarPeriod,
  type Publication,
} from '@/types';

type CvSectionProps = {
  activities: Activity[];
  publications: Publication[];
};

// Publications are listed after this activity category.
const publicationsAfter: ActivityCategory = 'research';

const categoryLabels: Record<ActivityCategory, string> = {
  education: 'Education',
  work: 'Work',
  research: 'Research',
  community: 'Community',
};

function GroupHeading({ children }: { children: string }) {
  return (
    <Typography variant="body2" component="h2" sx={{ mb: 2, color: 'text.secondary', breakAfter: 'avoid' }}>
      {children}
    </Typography>
  );
}

/** The whole CV: one group per activity category, with publications inserted after `publicationsAfter`. */
export function CvSection({ activities, publications }: CvSectionProps) {
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
        '@media print': { pt: 0, pb: 0, '& .MuiTypography-root, & .MuiTypography-root *': { color: 'common.black' } },
      }}
    >
      <Stack spacing={6}>
        {ACTIVITY_CATEGORIES.flatMap((category) => {
          const group = (
            <Box key={category}>
              <GroupHeading>{categoryLabels[category]}</GroupHeading>
              <Stack spacing={2}>
                {sortedActivities
                  .filter((activity) => activity.category === category)
                  .map((activity) => (
                    <ActivityRow key={activity.id} activity={activity} />
                  ))}
              </Stack>
            </Box>
          );
          if (category !== publicationsAfter) return [group];
          return [
            group,
            <Box key="publications">
              <GroupHeading>Publications</GroupHeading>
              <PublicationsSection publications={publications} />
            </Box>,
          ];
        })}
      </Stack>
    </Container>
  );
}

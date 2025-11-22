import { Container, Typography, Box, Stack } from '@mui/material';
import { QualificationsContent } from '@/types/profile';

interface QualificationsSectionProps {
  content: QualificationsContent;
}

export function QualificationsSection({ content }: QualificationsSectionProps) {
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
      <Stack spacing={6}>
        {content.qualifications.map((qualification) => (
          <Box
            key={qualification.name}
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
              {qualification.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {qualification.issuer} • {qualification.date}
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
        ))}
      </Stack>
    </Container>
  );
}

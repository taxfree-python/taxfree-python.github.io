import { Container, Typography, Box, Chip } from '@mui/material';
import { Card } from './Card';
import { QualificationsContent } from '@/types/profile';

interface QualificationsSectionProps {
  content: QualificationsContent;
}

export function QualificationsSection({ content }: QualificationsSectionProps) {
  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 4 }}>
        {content.title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {content.qualifications.map((qualification) => (
          <Card key={qualification.name}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h6" component="h3" fontWeight="bold">
                {qualification.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {qualification.issuer}
                </Typography>
                <Chip label={qualification.date} size="small" />
              </Box>
              {qualification.score && (
                <Typography variant="body1" color="primary" fontWeight="medium">
                  {qualification.score}
                </Typography>
              )}
              {qualification.description && (
                <Typography variant="body2" color="text.secondary">
                  {qualification.description}
                </Typography>
              )}
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

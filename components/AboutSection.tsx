import { Container, Typography } from '@mui/material';
import { Card } from './Card';
import { AboutContent } from '@/types/profile';

interface AboutSectionProps {
  content: AboutContent;
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <Container maxWidth="md" component="section" sx={{ py: 6 }}>
      <Card>
        <Typography variant="h2" component="h2" gutterBottom>
          {content.title}
        </Typography>
        {content.paragraphs.map((paragraph) => (
          <Typography key={paragraph} variant="body1" color="text.primary" paragraph>
            {paragraph}
          </Typography>
        ))}
      </Card>
    </Container>
  );
}

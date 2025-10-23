import { Container, Typography } from '@mui/material';
import { HeroContent } from '@/types/profile';
import { SocialLinks } from './SocialLinks';

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <Container maxWidth="md" component="section" sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
        {content.title}
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        {content.subtitle}
      </Typography>
      <SocialLinks links={content.socialLinks} />
    </Container>
  );
}

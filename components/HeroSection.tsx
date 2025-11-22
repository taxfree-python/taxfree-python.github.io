import { Container, Typography } from '@mui/material';
import { HeroContent } from '@/types/profile';
import { SocialLinks } from './SocialLinks';

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <Container maxWidth="md" component="section" sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, mb: 3 }}>
        {content.title}
      </Typography>
      <Typography
        variant="h5"
        component="p"
        sx={{ color: 'text.secondary', mb: 3, fontWeight: 400, letterSpacing: '-0.01em' }}
      >
        {content.subtitle}
      </Typography>
      <SocialLinks links={content.socialLinks} />
    </Container>
  );
}

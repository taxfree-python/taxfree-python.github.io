import { Container, Typography } from '@mui/material';
import type { HeroSubtitle, LabeledLink } from '@/types';
import { SocialLinks } from './SocialLinks';
import { DynamicSubtitle } from './DynamicSubtitle';

type HeroSectionProps = {
  title: string;
  subtitle: HeroSubtitle;
  socialLinks: LabeledLink[];
};

export function HeroSection({ title, subtitle, socialLinks }: HeroSectionProps) {
  return (
    <Container maxWidth="md" component="section" sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>
      <DynamicSubtitle {...subtitle} />
      <SocialLinks links={socialLinks} />
    </Container>
  );
}

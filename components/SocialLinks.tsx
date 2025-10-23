import Link from 'next/link';
import { Box, Button } from '@mui/material';
import { SocialLink } from '@/types/profile';

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
      {links.map((link) => (
        <Button
          key={link.href}
          component={Link}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          sx={{
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          {link.label}
        </Button>
      ))}
    </Box>
  );
}

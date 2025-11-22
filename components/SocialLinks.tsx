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
            boxShadow: 'none',
            bgcolor: link.colorClass ? undefined : 'primary.main',
            color: link.colorClass ? undefined : 'text.primary',
            '&:hover': {
              opacity: 0.85,
              boxShadow: 'none',
            },
          }}
          className={link.colorClass}
        >
          {link.label}
        </Button>
      ))}
    </Box>
  );
}

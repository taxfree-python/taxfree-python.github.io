import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { SocialLink } from '@/types/profile';

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <Box display="flex" gap={3} justifyContent="center" flexWrap="wrap">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
              transition: 'color 0.2s',
              fontWeight: 500,
            }}
          >
            {link.label}
          </Typography>
        </Link>
      ))}
    </Box>
  );
}

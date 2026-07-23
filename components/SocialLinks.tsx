import { Fragment } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import type { LabeledLink } from '@/types';
import { fontFamilyMono } from '@/lib/theme';

type SocialLinksProps = {
  links: LabeledLink[];
};

export function SocialLinks({ links }: SocialLinksProps) {
  return (
    <Box
      display="flex"
      gap={2}
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      sx={{
        fontFamily: fontFamilyMono,
      }}
    >
      {links.map((link, index) => (
        <Fragment key={link.url}>
          {index > 0 && (
            <Typography component="span" aria-hidden="true" sx={{ color: 'grey.700', fontFamily: 'inherit' }}>
              ·
            </Typography>
          )}
          <Link href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: 'grey.500',
                fontFamily: 'inherit',
                textTransform: 'lowercase',
                transition: 'color 0.2s',
                '&:hover': {
                  color: 'text.primary',
                  textDecoration: 'underline',
                  textUnderlineOffset: '0.3em',
                },
              }}
            >
              {link.label}
            </Typography>
          </Link>
        </Fragment>
      ))}
    </Box>
  );
}

'use client';

import { Container, Typography, Box, Stack, Link } from '@mui/material';
import type { Publication, PublicationType } from '@/types/publications';
import { activityDateToComparableValue, formatActivityDate } from '@/lib/activityPeriod';

type PublicationsSectionProps = {
  publications: Publication[];
};

const typeLabels: Record<PublicationType, string> = {
  oral: 'Oral',
  poster: 'Poster',
  talk: 'Talk',
};

const highlightedAuthors: ReadonlySet<string> = new Set(['Yu Chinen', '知念優', '知念 優']);

export function PublicationsSection({ publications }: PublicationsSectionProps) {
  // Sort publications by date (most recent first)
  const sortedPublications = [...publications].sort(
    (a, b) => activityDateToComparableValue(b.date) - activityDateToComparableValue(a.date),
  );

  if (sortedPublications.length === 0) return null;

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
        Publications & Presentations
      </Typography>
      <Stack spacing={2}>
        {sortedPublications.map((publication) => (
          <Box
            key={publication.id}
            sx={{
              py: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                  letterSpacing: '-0.01em'
                }}
              >
                {publication.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  ml: 2,
                  whiteSpace: 'nowrap',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {formatActivityDate(publication.date)}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, letterSpacing: '-0.01em' }}
            >
              {publication.authors.map((author, index) => (
                <Box component="span" key={author}>
                  {index > 0 && ', '}
                  <Box
                    component="span"
                    sx={highlightedAuthors.has(author) ? { color: 'text.primary', fontWeight: 500 } : {}}
                  >
                    {author}
                  </Box>
                </Box>
              ))}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25, letterSpacing: '-0.01em' }}
            >
              {publication.venue} ({typeLabels[publication.type]})
              {publication.links?.map((link) => (
                <Box component="span" key={link.url}>
                  {' · '}
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="hover"
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}

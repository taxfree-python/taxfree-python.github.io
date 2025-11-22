'use client';

import { Container, Typography, Box, Stack } from '@mui/material';
import { SkillDetail } from '../types/skills';

interface SkillsSectionProps {
  skills: SkillDetail[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
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
        Core Skills
      </Typography>

      <Stack spacing={2}>
        {skills.map((skill) => (
          <Box
            key={skill.name}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              py: 1,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                letterSpacing: '-0.01em'
              }}
            >
              {skill.name}
            </Typography>
            {skill.experience && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  ml: 2,
                  whiteSpace: 'nowrap'
                }}
              >
                {skill.experience}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Container>
  );
}

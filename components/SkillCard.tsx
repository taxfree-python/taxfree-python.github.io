import { Box, Typography, Chip, Link } from '@mui/material';
import { Card } from './Card';
import { SkillAchievement, SkillCategory, SkillDetail } from '../types/skills';
import { ProjectActivity } from '../types/activities';

interface SkillCardProps {
  skill: SkillDetail;
  onClick?: () => void;
  isActive?: boolean;
  relatedItems?: ProjectActivity[];
}

const categoryLabels: Record<SkillCategory, string> = {
  technical: 'Technical',
  language: 'Languages & Credentials',
  communication: 'Communication',
  other: 'Other',
};

export function SkillCard({ skill, onClick, isActive = false, relatedItems = [] }: SkillCardProps) {
  const highlights = skill.highlights ?? [];
  const achievements = skill.achievements ?? [];
  const badgeText = skill.level ?? skill.experience;

  return (
    <Card
      onClick={onClick}
      sx={{
        transition: 'all 0.2s',
        ...(onClick && {
          '&:hover': {
            boxShadow: 8,
            transform: 'scale(1.02)',
          },
        }),
        ...(isActive && {
          boxShadow: 8,
          outline: '2px solid',
          outlineColor: 'primary.main',
        }),
      }}
    >
      <Box display="flex" gap={2} alignItems="flex-start">
        {/* Icon */}
        <Box fontSize="3rem" flexShrink={0}>
          {skill.icon}
        </Box>

        {/* Content */}
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1} gap={2}>
            <Box>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                {categoryLabels[skill.category]}
              </Typography>
              <Typography variant="h4" component="h3" fontWeight="bold">
                {skill.name}
              </Typography>
            </Box>
            {badgeText && (
              <Chip label={badgeText} size="small" sx={{ whiteSpace: 'nowrap' }} />
            )}
          </Box>

          <Typography variant="body1" color="text.primary" paragraph>
            {skill.description}
          </Typography>

          {highlights.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
              {highlights.map((highlight) => (
                <Chip
                  key={highlight}
                  label={highlight}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          {achievements.length > 0 && (
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              {achievements.map((item: SkillAchievement) => (
                <Typography component="li" key={`${item.label}-${item.value}`} variant="body2" sx={{ mb: 0.5 }}>
                  <Box component="span" fontWeight="bold">
                    {item.label}:
                  </Box>{' '}
                  {item.link ? (
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                    >
                      {item.value}
                    </Link>
                  ) : (
                    <span>{item.value}</span>
                  )}
                  {item.description && (
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {item.description}
                    </Typography>
                  )}
                </Typography>
              ))}
            </Box>
          )}

          {/* Related Projects */}
          {relatedItems.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Related Projects & Activities
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {relatedItems.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.title}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Click hint */}
      {onClick && (
        <Typography variant="caption" color="text.secondary" textAlign="right" display="block" mt={2}>
          Click to filter activities →
        </Typography>
      )}
    </Card>
  );
}

import { Box, Typography, Chip } from '@mui/material';
import { Card } from './Card';
import { SkillDetail, skillCategoryLabels } from '../types/skills';

interface SkillCardProps {
  skill: SkillDetail;
  onClick?: () => void;
  isActive?: boolean;
}

export function SkillCard({ skill, onClick, isActive = false }: SkillCardProps) {
  const badgeText = skill.level ?? skill.experience;

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        ...(isActive && {
          outline: '2px solid',
          outlineColor: 'primary.main',
        }),
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1} gap={2}>
        <Box flex={1}>
          <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
            {skillCategoryLabels[skill.category]}
          </Typography>
          <Typography variant="h5" component="h3" fontWeight="bold" sx={{ mt: 0.5 }}>
            {skill.name}
          </Typography>
        </Box>
        {badgeText && (
          <Chip label={badgeText} size="small" sx={{ whiteSpace: 'nowrap' }} />
        )}
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.6,
        }}
      >
        {skill.description}
      </Typography>

      {onClick && (
        <Typography variant="caption" color="primary" sx={{ mt: 2, fontWeight: 500 }}>
          詳細を見る →
        </Typography>
      )}
    </Card>
  );
}

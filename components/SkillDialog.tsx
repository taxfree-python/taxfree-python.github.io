'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SkillDetail, SkillAchievement, skillCategoryLabels } from '../types/skills';
import { ProjectActivity } from '../types/activities';

interface SkillDialogProps {
  skill: SkillDetail | null;
  isOpen: boolean;
  onClose: () => void;
  relatedItems?: ProjectActivity[];
}

export function SkillDialog({ skill, isOpen, onClose, relatedItems = [] }: SkillDialogProps) {
  if (!skill) return null;

  const highlights = skill.highlights ?? [];
  const achievements = skill.achievements ?? [];
  const badgeText = skill.level ?? skill.experience;
  const categoryLabel = skillCategoryLabels[skill.category];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography variant="h4" component="h2" gutterBottom>
              {skill.name}
            </Typography>
            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                {categoryLabel}
              </Typography>
              {badgeText && (
                <Chip label={badgeText} size="small" />
              )}
            </Box>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Description */}
          <Box>
            <Typography variant="h6" gutterBottom>
              概要
            </Typography>
            <Typography variant="body1" color="text.primary">
              {skill.description}
            </Typography>
          </Box>

          {/* Highlights */}
          {highlights.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                ハイライト
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {highlights.map((highlight) => (
                  <Chip
                    key={highlight}
                    label={highlight}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                実績
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {achievements.map((item: SkillAchievement) => (
                  <Typography component="li" key={`${item.label}-${item.value}`} variant="body1" sx={{ mb: 1 }}>
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
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {item.description}
                      </Typography>
                    )}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Related Projects */}
          {relatedItems.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                関連プロジェクト & 活動
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {relatedItems.map((item) => (
                  <Box key={item.id}>
                    <Typography variant="body1" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

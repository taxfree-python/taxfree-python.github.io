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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ProjectActivity } from '../types/activities';
import { SkillTag } from './SkillTag';

interface ActivityDialogProps {
  activity: ProjectActivity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityDialog({ activity, isOpen, onClose }: ActivityDialogProps) {
  if (!activity) return null;

  const getSkillVariant = (skill: string): 'blue' | 'green' => {
    const programmingLanguages = ['Python', 'TypeScript', 'JavaScript', 'Go', 'Rust'];
    return programmingLanguages.includes(skill) ? 'blue' : 'green';
  };

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
              {activity.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {activity.date}
            </Typography>
            {activity.kind && (
              <Chip
                label={activity.kind}
                size="small"
                color="primary"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ ml: 2 }}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '60vh' }}>
        {/* Description */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            概要
          </Typography>
          <Typography variant="body1" color="text.primary">
            {activity.description}
          </Typography>
        </Box>

        {/* Detailed Description */}
        {activity.detailedDescription && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              詳細
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
              {activity.detailedDescription}
            </Typography>
          </Box>
        )}

        {/* Achievements */}
        {activity.achievements && activity.achievements.length > 0 && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              成果
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {activity.achievements.map((achievement, index) => (
                <Typography component="li" key={index} variant="body1" color="text.primary" sx={{ mb: 0.5 }}>
                  {achievement}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {/* Skills */}
        {activity.skills.length > 0 && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              使用技術
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {activity.skills.map((skill) => (
                <SkillTag key={skill} label={skill} variant={getSkillVariant(skill)} />
              ))}
            </Box>
          </Box>
        )}

        {/* Links */}
        {activity.links && activity.links.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              関連リンク
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {activity.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <OpenInNewIcon fontSize="small" />
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

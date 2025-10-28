import { Chip } from '@mui/material';

interface SkillTagProps {
  label: string;
  variant?: 'blue' | 'green';
  onClick?: () => void;
  isActive?: boolean;
}

export function SkillTag({
  label,
  variant = 'blue',
  onClick,
  isActive = false
}: SkillTagProps) {
  const tone = variant === 'blue'
    ? {
        idleBg: 'rgba(255, 255, 255, 0.14)',
        hoverBg: 'rgba(255, 255, 255, 0.2)',
        border: 'rgba(255, 255, 255, 0.28)',
        activeColor: 'primary',
      }
    : {
        idleBg: 'rgba(255, 255, 255, 0.1)',
        hoverBg: 'rgba(255, 255, 255, 0.16)',
        border: 'rgba(255, 255, 255, 0.22)',
        activeColor: 'secondary',
      };

  return (
    <Chip
      label={label}
      color={isActive ? (tone.activeColor as 'primary' | 'secondary') : 'default'}
      onClick={onClick}
      clickable={!!onClick}
      variant={isActive ? 'filled' : 'outlined'}
      sx={{
        backgroundColor: !isActive ? tone.idleBg : undefined,
        color: !isActive ? 'grey.200' : undefined,
        borderColor: !isActive ? tone.border : undefined,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: !isActive
            ? (onClick ? tone.hoverBg : tone.idleBg)
            : undefined,
        },
      }}
    />
  );
}

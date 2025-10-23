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
  const getColor = () => {
    if (variant === 'blue') {
      return isActive ? 'primary' : 'default';
    }
    return isActive ? 'secondary' : 'default';
  };

  return (
    <Chip
      label={label}
      color={getColor() as 'primary' | 'secondary' | 'default'}
      onClick={onClick}
      clickable={!!onClick}
      sx={{
        backgroundColor: !isActive
          ? variant === 'blue'
            ? 'primary.dark'
            : 'secondary.dark'
          : undefined,
        '&:hover': onClick
          ? {
              opacity: 0.8,
            }
          : undefined,
      }}
    />
  );
}

import { ReactNode } from 'react';
import { Card as MuiCard, CardContent, SxProps, Theme } from '@mui/material';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export function Card({ children, onClick, sx }: CardProps) {
  return (
    <MuiCard
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              boxShadow: 6,
            }
          : undefined,
        ...sx,
      }}
    >
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
}

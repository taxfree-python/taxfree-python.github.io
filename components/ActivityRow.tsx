'use client';

import { useState } from 'react';
import { ButtonBase, Box, Collapse, Typography } from '@mui/material';
import type { Activity, CalendarPeriod } from '@/types';

// Year-only period end, e.g. "present" or "2025". Single-year periods keep the
// "start – end" shape so every row lines up.
function formatEndYear(period: CalendarPeriod): string {
  return period.end === undefined ? 'present' : `${period.end.year}`;
}

// Grid shared by the toggle row and the static row: title and period.
// Below `sm` the period drops under the title.
const rowGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
  columnGap: 1,
  alignItems: 'baseline',
  width: '100%',
  textAlign: 'left',
  color: 'text.primary',
} as const;

const titleSx = { minWidth: 0, gridColumn: 1 } as const;

const periodSx = {
  gridColumn: { xs: 1, sm: 2 },
  display: 'inline-grid',
  justifySelf: { xs: 'start', sm: 'end' },
  gridTemplateColumns: 'auto auto 4.5em',
  columnGap: '0.4em',
  color: 'text.secondary',
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
} as const;

type ActivityRowProps = {
  activity: Activity;
};

/**
 * One Experience entry. With details the whole row toggles them, with no icon:
 * hovering or focusing brightens the period. Without details it is plain text.
 * Print shows every detail.
 */
export function ActivityRow({ activity }: ActivityRowProps) {
  const [open, setOpen] = useState(false);
  const detailsId = `activity-details-${activity.id}`;

  const content = (
    <>
      <Typography variant="subtitle1" component="span" sx={titleSx}>
        {activity.title}
      </Typography>
      <Typography variant="body2" component="span" className="activity-period" sx={periodSx}>
        <span>{activity.period.start.year}</span>
        <span>–</span>
        <span>{formatEndYear(activity.period)}</span>
      </Typography>
    </>
  );

  if (activity.details.length === 0) {
    return (
      <Box sx={{ breakInside: 'avoid', py: { xs: 1, sm: 0 } }}>
        <Box sx={rowGridSx}>{content}</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ breakInside: 'avoid' }}>
      <ButtonBase
        disableRipple
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((value) => !value)}
        sx={{
          ...rowGridSx,
          font: 'inherit',
          py: { xs: 1, sm: 0 },
          minHeight: { xs: 44, sm: 0 },
          borderRadius: 0.5,
          '& .activity-period': { transition: 'color 150ms' },
          '&:hover .activity-period, &.Mui-focusVisible .activity-period': { color: 'text.primary' },
          '&.Mui-focusVisible': { outline: '1px solid', outlineColor: 'text.secondary', outlineOffset: 2 },
          '@media print': { cursor: 'default' },
        }}
      >
        {content}
      </ButtonBase>
      <Collapse
        in={open}
        timeout={150}
        id={detailsId}
        sx={{
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          // Collapsed details stay in the DOM so print can show them.
          '@media print': { height: 'auto !important', visibility: 'visible !important', overflow: 'visible' },
        }}
      >
        <Box sx={{ pt: 0.5, pb: { xs: 1, sm: 0 }, pr: { xs: 0, sm: 4 } }}>
          {activity.details.map((detail) => (
            <Typography
              key={detail}
              variant="body2"
              component="p"
              sx={{ color: 'text.secondary', lineHeight: 1.7 }}
            >
              {detail}
            </Typography>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

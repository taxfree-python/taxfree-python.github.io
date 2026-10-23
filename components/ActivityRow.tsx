'use client';

import { useState } from 'react';
import { ButtonBase, Box, Collapse, Typography } from '@mui/material';
import type { Activity, CalendarPeriod } from '@/types';

// Year-only period end, e.g. "present" or "2025". Single-year periods keep the
// "start – end" shape so every row lines up.
function formatEndYear(period: CalendarPeriod): string {
  return period.end === undefined ? 'present' : `${period.end.year}`;
}

const CHEVRON_SIZE = 14;

function Chevron({ open }: { open: boolean }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 16 16"
      aria-hidden
      sx={{
        width: CHEVRON_SIZE,
        height: CHEVRON_SIZE,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform 150ms',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
      }}
    >
      <path d="M3.5 6l4.5 4.5L12.5 6" />
    </Box>
  );
}

// Grid shared by the toggle row and the static row: title, period, chevron slot.
// Below `sm` the period drops under the title and the chevron stays at the right edge.
const rowGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr 1.5rem', sm: '1fr auto 1.5rem' },
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

const chevronSlotSx = {
  gridColumn: { xs: 2, sm: 3 },
  gridRow: { xs: '1 / span 2', sm: 1 },
  alignSelf: 'center',
  justifySelf: 'end',
  display: 'flex',
  color: 'text.secondary',
  '@media print': { display: 'none' },
} as const;

type ActivityRowProps = {
  activity: Activity;
};

/** One Experience entry. With details the whole row toggles them; without, it is plain text. Print shows every detail. */
export function ActivityRow({ activity }: ActivityRowProps) {
  const [open, setOpen] = useState(false);
  const detailsId = `activity-details-${activity.id}`;

  const content = (
    <>
      <Typography variant="subtitle1" component="span" sx={titleSx}>
        {activity.title}
      </Typography>
      <Typography variant="body2" component="span" sx={periodSx}>
        <span>{activity.period.start.year}</span>
        <span>–</span>
        <span>{formatEndYear(activity.period)}</span>
      </Typography>
    </>
  );

  if (activity.details.length === 0) {
    return (
      <Box sx={{ breakInside: 'avoid', py: { xs: 1, sm: 0 } }}>
        <Box sx={rowGridSx}>
          {content}
          <Box aria-hidden sx={{ ...chevronSlotSx, width: CHEVRON_SIZE, height: CHEVRON_SIZE }} />
        </Box>
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
          '&:hover .activity-chevron, &:focus-visible .activity-chevron': { color: 'text.primary' },
          '&.Mui-focusVisible': { outline: '1px solid', outlineColor: 'text.secondary', outlineOffset: 2 },
          '@media print': { cursor: 'default' },
        }}
      >
        {content}
        <Box className="activity-chevron" sx={chevronSlotSx}>
          <Chevron open={open} />
        </Box>
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

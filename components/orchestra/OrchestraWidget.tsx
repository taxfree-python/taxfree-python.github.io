'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';
import type { ComponentType } from 'react';
import type { OrchestraWidgetName } from '@/lib/orchestra-widgets';

function WidgetLoading() {
  return (
    <Box
      sx={{
        my: 4,
        p: { xs: 2, sm: 3 },
        minHeight: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <CircularProgress size={24} />
    </Box>
  );
}

const WIDGETS: Record<OrchestraWidgetName, ComponentType> = {
  LayoutViewer: dynamic(() => import('./LayoutViewer'), { loading: WidgetLoading, ssr: false }),
  EvolutionReplay: dynamic(() => import('./EvolutionReplay'), { loading: WidgetLoading, ssr: false }),
  ABPlayer: dynamic(() => import('./ABPlayer'), { loading: WidgetLoading, ssr: false }),
};

type Props = {
  name: OrchestraWidgetName;
};

export default function OrchestraWidget({ name }: Props) {
  const Widget = WIDGETS[name];
  return <Widget />;
}

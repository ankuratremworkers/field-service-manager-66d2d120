import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

import type { JobStatus } from '../types';

type Palette = { bg: string; fg: string; border: string };

// Semantic status colours — kept separate from the app accent because they
// carry meaning (blue = scheduled, amber = in progress, green = done, red =
// cancelled). Each mode has its own tuning so contrast reads well.
const LIGHT: Record<JobStatus, Palette> = {
  Scheduled: { bg: '#E0EDFF', fg: '#1E3A8A', border: '#93B8F7' },
  'In Progress': { bg: '#FFF4D6', fg: '#7A4D00', border: '#F6C76C' },
  Completed: { bg: '#DCFCE7', fg: '#166534', border: '#86EFAC' },
  Cancelled: { bg: '#FEE2E2', fg: '#991B1B', border: '#FCA5A5' },
};

const DARK: Record<JobStatus, Palette> = {
  Scheduled: {
    bg: 'rgba(59, 130, 246, 0.16)',
    fg: '#93C5FD',
    border: 'rgba(147, 197, 253, 0.35)',
  },
  'In Progress': {
    bg: 'rgba(245, 158, 11, 0.16)',
    fg: '#FCD34D',
    border: 'rgba(252, 211, 77, 0.35)',
  },
  Completed: {
    bg: 'rgba(34, 197, 94, 0.16)',
    fg: '#86EFAC',
    border: 'rgba(134, 239, 172, 0.35)',
  },
  Cancelled: {
    bg: 'rgba(239, 68, 68, 0.16)',
    fg: '#FCA5A5',
    border: 'rgba(252, 165, 165, 0.35)',
  },
};

export function StatusChip({ status }: { status: JobStatus | string }) {
  const theme = useTheme();
  const map = theme.palette.mode === 'dark' ? DARK : LIGHT;
  const c =
    map[status as JobStatus] ??
    (theme.palette.mode === 'dark'
      ? { bg: 'rgba(148,163,184,0.16)', fg: '#CBD5E1', border: 'rgba(203,213,225,0.30)' }
      : { bg: '#E5E7EB', fg: '#374151', border: '#CBD5E1' });
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        fontWeight: 600,
        letterSpacing: 0.2,
        borderRadius: 1,
        height: 24,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}

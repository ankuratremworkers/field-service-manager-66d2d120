import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { StatusChip } from '../components/StatusChip';
import { listJobsGroupedByStatus } from '../services/jobs';
import { fetchStats } from '../services/stats';
import type { GroupedJobs, JobStatus, Stats } from '../types';
import { JOB_STATUSES } from '../types';

// Semantic accent stripes for the per-status cards. Kept separate from the
// app's primary accent because these are status-coded (see StatusChip).
const STATUS_ACCENT: Record<JobStatus, { light: string; dark: string }> = {
  Scheduled: { light: '#2563EB', dark: '#60A5FA' },
  'In Progress': { light: '#B45309', dark: '#FBBF24' },
  Completed: { light: '#15803D', dark: '#4ADE80' },
  Cancelled: { light: '#B91C1C', dark: '#F87171' },
};

function CountCard({
  title,
  value,
  accent,
  emphasise = false,
}: {
  title: string;
  value: number;
  accent: string;
  emphasise?: boolean;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        flex: 1,
        minWidth: 180,
        borderLeft: `4px solid ${accent}`,
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', display: 'block' }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          mt: 0.5,
          color: emphasise ? 'primary.main' : 'text.primary',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

function formatWhen(iso: string | null): string {
  if (!iso) return 'Unscheduled';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DashboardPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stats, setStats] = useState<Stats | null>(null);
  const [grouped, setGrouped] = useState<GroupedJobs | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([fetchStats(), listJobsGroupedByStatus()])
      .then(([s, g]) => {
        if (!active) return;
        setStats(s);
        setGrouped(g);
      })
      .catch((e: Error) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats || !grouped) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const recent = JOB_STATUSES.flatMap((s) => grouped[s] ?? [])
    .slice()
    .sort((a, b) => {
      const at = a.updated_at ?? a.created_at ?? '';
      const bt = b.updated_at ?? b.created_at ?? '';
      return bt.localeCompare(at);
    })
    .slice(0, 6);

  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        Overview
      </Typography>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ mb: 4 }}>
        <CountCard
          title="Total jobs"
          value={stats.total}
          accent={theme.palette.primary.main}
          emphasise
        />
        {JOB_STATUSES.map((s) => (
          <CountCard
            key={s}
            title={s}
            value={stats[s]}
            accent={isDark ? STATUS_ACCENT[s].dark : STATUS_ACCENT[s].light}
          />
        ))}
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent jobs
        </Typography>
        {recent.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No jobs yet.
          </Typography>
        ) : (
          <Stack divider={<Divider flexItem />} spacing={0}>
            {recent.map((j) => (
              <Stack
                key={j.id}
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'center' }}
                sx={{ py: 1.75, gap: 2 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    minWidth: 90,
                    color: 'text.secondary',
                  }}
                >
                  {j.reference}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                  {j.customer}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', minWidth: 180 }}
                >
                  {formatWhen(j.scheduled_for)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', minWidth: 140 }}
                >
                  {j.engineer_name ?? '—'}
                </Typography>
                <Box sx={{ minWidth: 130 }}>
                  <StatusChip status={j.status} />
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { JobDialog } from '../components/JobDialog';
import { StatusChip } from '../components/StatusChip';
import { listEngineers } from '../services/engineers';
import { createJob, deleteJob, listJobs, updateJob } from '../services/jobs';
import type { Engineer, Job, JobInput, JobStatus } from '../types';
import { JOB_STATUSES } from '../types';

function formatWhen(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function suggestReference(jobs: Job[]): string {
  let maxN = 0;
  for (const j of jobs) {
    const m = /^JOB-(\d+)$/i.exec(j.reference);
    if (m) maxN = Math.max(maxN, Number(m[1]));
  }
  return `JOB-${String(maxN + 1).padStart(4, '0')}`;
}

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | JobStatus>('');

  const [editing, setEditing] = useState<Job | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsRes, engRes] = await Promise.all([
        listJobs({
          search: search.trim() || undefined,
          status: statusFilter || undefined,
        }),
        listEngineers(false),
      ]);
      setJobs(jobsRes);
      setEngineers(engRes);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    // Debounce reloads while the user is typing.
    const t = setTimeout(() => {
      void reload();
    }, 200);
    return () => clearTimeout(t);
  }, [reload]);

  const suggestedRef = useMemo(() => suggestReference(jobs), [jobs]);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (job: Job) => {
    setEditing(job);
    setDialogOpen(true);
  };

  const handleSave = async (input: JobInput) => {
    if (editing) {
      await updateJob(editing.id, input);
      setToast('Job updated');
    } else {
      await createJob(input);
      setToast('Job created');
    }
    setDialogOpen(false);
    await reload();
  };

  const handleDelete = async (id: number) => {
    await deleteJob(id);
    setToast('Job deleted');
    setDialogOpen(false);
    await reload();
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ md: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Scheduling
          </Typography>
          <Typography variant="h4">Jobs</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
          New job
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            placeholder="Search by reference, customer, or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as '' | JobStatus)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">
              <em>All statuses</em>
            </MenuItem>
            {JOB_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 110 }}>Reference</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Address</TableCell>
                <TableCell sx={{ width: 160 }}>Scheduled</TableCell>
                <TableCell sx={{ width: 160 }}>Engineer</TableCell>
                <TableCell sx={{ width: 140 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No jobs match these filters.
                      </Typography>
                      <Button size="small" onClick={openNew}>
                        Create a job
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((j) => (
                  <TableRow
                    key={j.id}
                    hover
                    onClick={() => openEdit(j)}
                    sx={{ cursor: 'pointer', '& td': { py: 1.5 } }}
                  >
                    <TableCell
                      sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                    >
                      {j.reference}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{j.customer}</TableCell>
                    <TableCell
                      sx={{
                        display: { xs: 'none', md: 'table-cell' },
                        color: 'text.secondary',
                        maxWidth: 280,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {j.address || '—'}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {formatWhen(j.scheduled_for)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: j.engineer_name ? 'text.primary' : 'text.disabled',
                        fontStyle: j.engineer_name ? 'normal' : 'italic',
                      }}
                    >
                      {j.engineer_name ?? 'Unassigned'}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={j.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <JobDialog
        open={dialogOpen}
        job={editing}
        engineers={engineers}
        suggestedReference={suggestedRef}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <Snackbar
        open={toast !== null}
        autoHideDuration={2600}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={toast ?? ''}
      />
    </Box>
  );
}

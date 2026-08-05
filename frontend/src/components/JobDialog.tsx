import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';

import type { Engineer, Job, JobInput, JobStatus } from '../types';
import { JOB_STATUSES } from '../types';

type Props = {
  open: boolean;
  job: Job | null;
  engineers: Engineer[];
  suggestedReference: string;
  onClose: () => void;
  onSave: (input: JobInput) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
};

function toLocalInputValue(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  // yyyy-MM-ddTHH:mm — the format <input type="datetime-local"> expects.
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInputValue(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function JobDialog({
  open,
  job,
  engineers,
  suggestedReference,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [reference, setReference] = useState('');
  const [customer, setCustomer] = useState('');
  const [address, setAddress] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [engineerId, setEngineerId] = useState<number | ''>('');
  const [status, setStatus] = useState<JobStatus>('Scheduled');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (job) {
      setReference(job.reference);
      setCustomer(job.customer);
      setAddress(job.address);
      setScheduledFor(toLocalInputValue(job.scheduled_for));
      setEngineerId(job.engineer_id ?? '');
      setStatus(job.status);
      setNotes(job.notes);
    } else {
      setReference(suggestedReference);
      setCustomer('');
      setAddress('');
      setScheduledFor('');
      setEngineerId('');
      setStatus('Scheduled');
      setNotes('');
    }
    setError(null);
    setSaving(false);
  }, [open, job, suggestedReference]);

  const assignableEngineers = useMemo(() => {
    // Show all active engineers plus the currently-assigned one even if inactive.
    const list = engineers.filter((e) => e.active);
    if (job?.engineer_id && !list.some((e) => e.id === job.engineer_id)) {
      const assigned = engineers.find((e) => e.id === job.engineer_id);
      if (assigned) list.push(assigned);
    }
    return list;
  }, [engineers, job]);

  const handleSave = async () => {
    if (!reference.trim() || !customer.trim()) {
      setError('Reference and customer are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        reference: reference.trim(),
        customer: customer.trim(),
        address: address.trim(),
        scheduled_for: fromLocalInputValue(scheduledFor),
        engineer_id: engineerId === '' ? null : Number(engineerId),
        status,
        notes,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save job');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!job || !onDelete) return;
    if (!window.confirm(`Delete job ${job.reference}? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await onDelete(job.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete job');
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{job ? `Edit ${job.reference}` : 'New job'}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
              fullWidth
              sx={{ maxWidth: { sm: 200 } }}
            />
            <TextField
              label="Customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              fullWidth
            />
          </Stack>
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Scheduled for"
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatus)}
              fullWidth
            >
              {JOB_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            select
            label="Engineer"
            value={engineerId === '' ? '' : String(engineerId)}
            onChange={(e) => setEngineerId(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
          >
            <MenuItem value="">
              <em>Unassigned</em>
            </MenuItem>
            {assignableEngineers.map((e) => (
              <MenuItem key={e.id} value={String(e.id)}>
                {e.name}
                {!e.active ? ' (inactive)' : ''}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Box>
          {job && onDelete && (
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDelete}
              disabled={saving}
            >
              Delete
            </Button>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {job ? 'Save changes' : 'Create job'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

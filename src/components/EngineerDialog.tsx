import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

import type { Engineer, EngineerInput } from '../types';

type Props = {
  open: boolean;
  engineer: Engineer | null;
  onClose: () => void;
  onSave: (input: EngineerInput) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
};

export function EngineerDialog({ open, engineer, onClose, onSave, onDelete }: Props) {
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (engineer) {
      setName(engineer.name);
      setSkills(engineer.skills);
      setActive(engineer.active);
    } else {
      setName('');
      setSkills('');
      setActive(true);
    }
    setError(null);
    setSaving(false);
  }, [open, engineer]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({ name: name.trim(), skills: skills.trim(), active });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save engineer');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!engineer || !onDelete) return;
    if (!window.confirm(`Delete ${engineer.name}? Their jobs will become unassigned.`)) return;
    setSaving(true);
    try {
      await onDelete(engineer.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete engineer');
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{engineer ? 'Edit engineer' : 'New engineer'}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            helperText="Comma-separated (e.g. plumbing, boilers, gas safe)"
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={active} onChange={(_, v) => setActive(v)} />}
            label={active ? 'Active — available for new jobs' : 'Inactive — hidden from job assignment'}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Box>
          {engineer && onDelete && (
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
            {engineer ? 'Save changes' : 'Create engineer'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

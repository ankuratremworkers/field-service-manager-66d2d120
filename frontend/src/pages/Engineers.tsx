import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';

import { EngineerDialog } from '../components/EngineerDialog';
import {
  createEngineer,
  deleteEngineer,
  listEngineers,
  updateEngineer,
} from '../services/engineers';
import type { Engineer, EngineerInput } from '../types';

function parseSkills(skills: string): string[] {
  return skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function EngineersPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Engineer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listEngineers(false);
      setEngineers(list);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load engineers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (eng: Engineer) => {
    setEditing(eng);
    setDialogOpen(true);
  };

  const handleSave = async (input: EngineerInput) => {
    if (editing) {
      await updateEngineer(editing.id, input);
      setToast('Engineer updated');
    } else {
      await createEngineer(input);
      setToast('Engineer created');
    }
    setDialogOpen(false);
    await reload();
  };

  const handleDelete = async (id: number) => {
    await deleteEngineer(id);
    setToast('Engineer deleted');
    setDialogOpen(false);
    await reload();
  };

  const toggleActive = async (eng: Engineer, next: boolean) => {
    try {
      await updateEngineer(eng.id, { active: next });
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update engineer');
    }
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
            Workforce
          </Typography>
          <Typography variant="h4">Engineers</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
          New engineer
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell sx={{ width: 120 }} align="center">
                  Active
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : engineers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No engineers yet.
                      </Typography>
                      <Button size="small" onClick={openNew}>
                        Add your first engineer
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                engineers.map((eng) => (
                  <TableRow key={eng.id} hover sx={{ '& td': { py: 1.5 } }}>
                    <TableCell
                      onClick={() => openEdit(eng)}
                      sx={{ cursor: 'pointer', fontWeight: 500 }}
                    >
                      {eng.name}
                    </TableCell>
                    <TableCell onClick={() => openEdit(eng)} sx={{ cursor: 'pointer' }}>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {parseSkills(eng.skills).length === 0 ? (
                          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                            —
                          </Typography>
                        ) : (
                          parseSkills(eng.skills).map((s) => (
                            <Chip
                              key={s}
                              label={s}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 1 }}
                            />
                          ))
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={eng.active}
                        onChange={(_, v) => void toggleActive(eng, v)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EngineerDialog
        open={dialogOpen}
        engineer={editing}
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

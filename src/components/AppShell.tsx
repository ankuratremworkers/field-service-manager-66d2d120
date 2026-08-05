import AssignmentIcon from '@mui/icons-material/Assignment';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import LightModeIcon from '@mui/icons-material/LightMode';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { useThemeMode } from '../theme/ThemeModeContext';

type NavItem = { to: string; label: string; icon: ReactNode };

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
  { to: '/jobs', label: 'Jobs', icon: <AssignmentIcon fontSize="small" /> },
  { to: '/engineers', label: 'Engineers', icon: <EngineeringIcon fontSize="small" /> },
];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { mode, toggle } = useThemeMode();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 3, minHeight: 64 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mr: 4 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.contrastText',
                fontWeight: 800,
                fontSize: 14,
                letterSpacing: 1,
              }}
            >
              FS
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#F8FAFC',
                fontWeight: 700,
                letterSpacing: -0.3,
              }}
            >
              Field Service
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ flexGrow: 1 }}>
            {NAV.map((item) => {
              const active =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  startIcon={item.icon}
                  sx={{
                    color: active ? '#FFFFFF' : 'rgba(248,250,252,0.72)',
                    bgcolor: active ? 'rgba(56,189,248,0.16)' : 'transparent',
                    px: 2,
                    py: 0.75,
                    borderRadius: 1,
                    borderBottom: active
                      ? '2px solid'
                      : '2px solid transparent',
                    borderColor: active ? 'primary.main' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.10)',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
          <Tooltip
            title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <IconButton
              onClick={toggle}
              aria-label="Toggle theme"
              sx={{
                color: 'rgba(248,250,252,0.85)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.10)',
                  color: '#FFFFFF',
                },
              }}
            >
              {mode === 'dark' ? (
                <LightModeIcon fontSize="small" />
              ) : (
                <DarkModeIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

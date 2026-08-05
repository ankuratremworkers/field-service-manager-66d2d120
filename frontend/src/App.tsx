import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/Dashboard';
import { EngineersPage } from './pages/Engineers';
import { JobsPage } from './pages/Jobs';

// Root — routes are declared here and only here.
export function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/engineers" element={<EngineersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

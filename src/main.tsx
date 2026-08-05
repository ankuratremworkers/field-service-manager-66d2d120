import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { ThemeModeProvider } from './theme/ThemeModeContext';

// The one entry point. Never add src/index.tsx alongside it.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <App />
    </ThemeModeProvider>
  </React.StrictMode>,
);

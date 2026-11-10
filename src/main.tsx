import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker for full offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New content available.');
  },
  onOfflineReady() {
    console.log('[PWA] MilkyPy application and Pyodide core ready for offline execution.');
  },
  onRegistered(registration) {
    console.log('[PWA] Service Worker registered:', registration?.scope);
  },
  onRegisterError(error) {
    console.warn('[PWA] Service Worker registration failed:', error);
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

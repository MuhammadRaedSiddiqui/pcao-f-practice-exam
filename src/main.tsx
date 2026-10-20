import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { App } from './App';
import './styles.css';
import { initAnalytics } from './services/analytics';
import { observeGuidedLocation } from './domain/guided/navigationIntent';

void initAnalytics();

const router = createBrowserRouter([
  // App keeps exam/auth state mounted and renders the matched page itself.
  { path: '/', element: <App />, children: [
    { index: true, element: <></> },
    { path: 'history', element: <></> },
    { path: 'settings', element: <></> },
    { path: 'guided', element: <></> },
    { path: 'guided/session/:sessionId', element: <></> },
  ] },
  { path: '*', element: <Navigate to="/" replace /> },
], { basename: import.meta.env.BASE_URL });

observeGuidedLocation(router.state.location.key);
router.subscribe(state => observeGuidedLocation(state.location.key));

createRoot(document.getElementById('root')!).render(<StrictMode><RouterProvider router={router} /></StrictMode>);

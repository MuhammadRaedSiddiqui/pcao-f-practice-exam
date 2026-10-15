import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import { initAnalytics } from './services/analytics';

void initAnalytics();

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

/**
 * React 19 App Entry Point with Strict Mode
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import { AppStateProvider } from '@hooks/useAppState';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales/i18n';
import './styles/globals.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AppStateProvider>
        <AppWrapper />
      </AppStateProvider>
    </I18nextProvider>
  </React.StrictMode>
);

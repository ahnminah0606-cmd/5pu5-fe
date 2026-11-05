import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
if (!['/', '/index.html'].includes(window.location.pathname)) {
  window.location.replace('/404.html');
} else
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );

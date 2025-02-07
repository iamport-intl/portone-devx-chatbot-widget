// src/entry-client.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatPage from './pages/ChatPage';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  // Mount the ChatWidget.
  createRoot(container).render(<ChatPage />);
});

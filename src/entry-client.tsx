// src/entry-client.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatPage from './pages/ChatPage';

// Create a container div for the widget and append it to the document body.
const container = document.createElement('div');
document.body.appendChild(container);

// Mount the ChatWidget.
createRoot(container).render(<ChatPage />);

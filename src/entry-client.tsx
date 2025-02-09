// src/entry-client.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatPage from './app/page';
import './styles/globals.css'; // Importing Tailwind CSS and custom styles

// Set the globals so that the UMD build can access the libraries.
window.React = React;

function mountWidget() {
    const container = document.createElement('div');
    container.classList.add('portone-chat-widget');
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.right = '0';
    container.style.zIndex = '9999'; // Adjust as necessary
    document.body.appendChild(container);
    createRoot(container).render(<ChatPage />);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
} else {
    mountWidget();
}
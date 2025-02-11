// src/entry-client.tsx
'use client';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';
import './styles/globals.css'; // Importing Tailwind CSS and custom styles

// Expose React in the global scope.
window.React = React;

function mountWidget() {
    // Create (or locate) a unique container.
    let container = document.getElementById('chat-widget-root-hgnj');
    if (!container) {
        container = document.createElement('div');
        container.id = 'chat-widget-root-hgnj';
        container.classList.add('chat-widget-root-hgnj');
        document.body.appendChild(container);
    }
    createRoot(container).render(<Home />);
}

// Mount when DOM is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
} else {
    mountWidget();
}
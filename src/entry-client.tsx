// src/entry-client.tsx
'use client';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';
import './styles/globals.css'; // Importing Tailwind CSS and custom styles

// Expose React in the global scope.
window.React = React;

function mountWidget() {
    // Create or find the unique container.
    let container = document.getElementById('chat-widget-root-hgnj');
    if (!container) {
        container = document.createElement('div');
        container.id = 'chat-widget-root-hgnj';
        container.classList.add('chat-widget-root-hgnj');
        document.body.appendChild(container);
    }

    // Attach a Shadow DOM to the container if not already attached.
    if (!container.shadowRoot) {
        const shadowRoot = container.attachShadow({ mode: 'open' });
        // Expose the shadow root globally so that style-loader can insert styles into it.
        window.__CHAT_WIDGET_SHADOW_ROOT__ = shadowRoot;
    }

    // Create a mount point element inside the Shadow DOM.
    const mountEl = document.createElement('div');
    // Clear any previous content.
    container.shadowRoot.innerHTML = '';
    container.shadowRoot.appendChild(mountEl);

    // Render the widget.
    createRoot(mountEl).render(<Home />);
}

// Mount when the DOM is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
} else {
    mountWidget();
}
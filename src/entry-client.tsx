// src/entry-client.tsx
'use client';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';
import './styles/globals.css'; // Importing Tailwind CSS and custom styles

// Expose React in the global scope.
window.React = React;

let rootContainer: HTMLElement | null = null; // Keep track of the container

// Function to dispatch path changes to the widget
function dispatchPathUpdate() {
  if (rootContainer) { // Only dispatch if widget is mounted
    const newPath = window.location.pathname;
    console.log('Host page dispatching path:', newPath);
    const event = new CustomEvent('widgetpathchange', { detail: { path: newPath } });
    window.dispatchEvent(event);
  }
}

function mountWidget() {
    // Create (or locate) a unique container.
    rootContainer = document.getElementById('chat-widget-root-hgnj'); // Assign to tracked variable
    if (!rootContainer) {
        rootContainer = document.createElement('div');
        rootContainer.id = 'chat-widget-root-hgnj';
        rootContainer.classList.add('chat-widget-root-hgnj');
        document.body.appendChild(rootContainer);
    }
    // Get initial path from host window
    const initialPath = window.location.pathname;
    // Pass initialPath to Home
    createRoot(rootContainer).render(<Home initialPath={initialPath} />); 

    // --- Add listeners after mounting ---

    // Listen for back/forward navigation
    window.addEventListener('popstate', dispatchPathUpdate);

    // Monkey-patch history methods
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      dispatchPathUpdate(); // Dispatch after pushState
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      dispatchPathUpdate(); // Dispatch after replaceState
    };

    console.log('Chat widget mounted and history listeners attached.');
}

// Mount when DOM is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
} else {
    mountWidget();
}
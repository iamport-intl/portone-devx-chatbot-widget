   // src/entry-client.tsx
   import React from 'react';
   import { createRoot } from 'react-dom/client';
   import ChatPage from './pages/ChatPage';

   function mountWidget() {
     // Make React available globally if needed by externals.
     window.React = React;
     const container = document.createElement('div');
     document.body.appendChild(container);
     const root = createRoot(container);
     root.render(<ChatPage />);
   }

   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', mountWidget);
   } else {
     mountWidget();
   }
   // src/entry-client.tsx
   import React from 'react';
   import { createRoot } from 'react-dom/client';
   import ChatPage from './pages/ChatPage';

   // Set the globals so that the UMD build can access the libraries.
   window.React = React;

   function mountWidget() {
     const container = document.createElement('div');
     container.classList.add('portone-chat-widget');
     document.body.appendChild(container);
     createRoot(container).render(<ChatPage />);
   }

   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', mountWidget);
   } else {
     mountWidget();
   }
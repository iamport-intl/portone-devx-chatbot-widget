import PromptCard from '../atoms/PromptCard';
import React from 'react';

type InitialPromptsProps = {
  onSelectPrompt?: (prompt: string) => void;
};

const prompts = [
  "Which type of account is right for my business?",
  "How do I find and securely store my PortOne API keys and secret keys after creating my account?",
  "What are the different integration types offered by PortOne (web, mobile, plugins, API), and which one is best suited for my platform? How do I choose the best type for my business?",
  "What are the prerequisites for integrating with the PortOne Payment API?",
  "How does JWT authentication work with the PortOne APIs, and how do I generate a JWT token?",
  "What is the PortOne integration test plan, and how can I effectively test my integration before going live? What are some common errors I should watch out for during testing?",
  "How do I generate a payment request signature for my payment requests?",
  "What are the differences between the PortOne Payment Service and Checkout Service for web integration?",
  "How do I integrate the PortOne Web SDK (Payment Service and Checkout Service) into my website?",
  "How do I handle the different types of payment responses (redirect parameters, webhooks)? How can I verify the signatures in my responses?",
  "How does the refund process work with PortOne, and how do I initiate a refund?",
  "What are the differences between the Embed, Connect, and Custom SDK integration options for mobile? Which option is best for my app's needs and resources?",
  "How do I integrate the PortOne mobile SDK (Android, iOS, Flutter, React Native) into my application? What are the specific steps and code examples for each platform?",
  "How do I handle payment status updates and deep links in my mobile app after a payment is completed?",
  "What are the key considerations for embedding a checkout experience within an iframe using the mobile SDKs?",
  "How do I create a payment link via the PortOne dashboard and the API? What parameters do I need to specify?",
  "What are the different states a payment link can be in throughout its lifecycle?",
  "How can I create a payment page within the PortOne dashboard? What customization options are available? What are the advantages of using a payment page over a single payment link?",
  "How do I create and manage regular subscriptions and on-demand subscriptions using the PortOne API? What are the key differences between these subscription types?",
  "What parameters are needed to generate a signature for regular and on-demand subscription requests?",
  "How do I configure webhooks to receive real-time notifications from PortOne about payment statuses and refunds? What are the specific details included in these webhook responses?",
  "How do I interpret the data presented in the PortOne Reconciliation Dashboard, including the Sankey chart and detailed reports?",
  "How do I configure payment channels and payment methods within the PortOne merchant portal? What information do I need to provide for each payment channel?",
  "What is included in the PortOne Go-Live Checklist, and what steps should I take to ensure a smooth transition to a live environment?",
  "How does the PortOne Reconciliation feature work, and how can I configure it for my business?",
  "How do I use the PortOne Ingestion tool to upload my transaction data?",
  "How do I create invoices through the PortOne Admin console, including using invoice templates and bulk uploads?",
  "How do I view and manage individual invoice details within the PortOne Admin console?",  
  "What are the different error codes returned by the PortOne APIs? How can I troubleshoot common errors?",
  "What are the differences between a Single Merchant and a Master Merchant account?",
  "How to integrate portone web sdk in my website? Give me a step by step guide.",
  "Can portone help me in reconciling my accounts across multiple payment gateways?",
  "How to activate my account",
];

export default function InitialPrompts({
  onSelectPrompt,
}: InitialPromptsProps) {
  // Memoize prompt selection to only calculate once on mount
  const selectedPrompts = React.useMemo(() => {
    return prompts.sort(() => Math.random() - 0.5).slice(0, 3);
  }, []); // Empty dependency array ensures this only runs once

  return (
    <div className="initial-prompts space-y-2 mb-4 px-4 flex flex-col overflow-y-auto">
      {selectedPrompts.map((prompt, index) => (
        <PromptCard
          key={index}
          text={prompt}
          onClick={() => onSelectPrompt?.(prompt)}
        />
      ))}
    </div>
  );
}
//   // select 3 random prompts
//   const selectedPrompts = prompts.sort(() => Math.random() - 0.5).slice(0, 3);
//   return (
//     <div className="space-y-2 mb-4 px-4 flex flex-col">
//       {selectedPrompts.map((prompt, index) => (
//         <PromptCard 
//           key={index} 
//           text={prompt} 
//           onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
//         />
//       ))}
//     </div>
//   );
// } 
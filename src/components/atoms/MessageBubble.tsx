import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { sendFeedback } from '../../services/chatService';
import { getAssetUrl } from '../../services/assetsService';

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'), { 
  ssr: false, 
  loading: () => <p>Loading...</p> 
});

type MessageBubbleProps = {
  sender: 'user' | 'bot' | 'indicator';
  message: string;
  conversationId?: string;
  messageId?: string;
  sentiment?: string; // "positive", "negative" or "neutral"
};

const MessageBubble = ({ sender, message, conversationId, messageId, sentiment }: MessageBubbleProps) => {
  // Normalize the sentiment to a string so that both numeric and string values work.
  const normalizedSentiment = sentiment?.toString();
  const initialFeedback = normalizedSentiment === "positive" ? 'up' : normalizedSentiment === "negative" ? 'down' : null;
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(initialFeedback);

  const alignmentClasses = {
    user: 'self-end bg-[#fc6b2d1a] mr-4 chat-bubble-user',
    bot: 'self-start bg-gray-50 ml-4 chat-bubble-bot',
    indicator: 'self-start ml-4'
  };

  if (!message || message.length === 0) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div className={clsx('p-3 rounded-xl mb-3 relative max-w-[85%]', alignmentClasses[sender])}>
      {sender === 'bot' ? (
        <>
          <MarkdownRenderer content={message} />
          <div className="flex gap-2 mt-2">
            {feedback === null ? (
              <>
                <button
                  onClick={() => {
                    setFeedback('up');
                    sendFeedback(conversationId as string, messageId as string, "positive");
                  }}
                  className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                >
                  👍
                </button>
                <button
                  onClick={() => {
                    setFeedback('down');
                    sendFeedback(conversationId as string, messageId as string, "negative");
                  }}
                  className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                >
                  👎
                </button>
              </>
            ) : feedback === 'up' ? (
              <button className="cursor-pointer bg-gray-200 text-white p-1 rounded">👍</button>
            ) : (
              <button className="cursor-pointer bg-gray-200 text-white p-1 rounded">👎</button>
            )}
          </div>
        </>
      ) : sender === 'indicator' ? (
        <img
          src={getAssetUrl("typing.gif")}
          alt="Typing..."
          className="w-10 h-5 object-contain"
          style={{ imageRendering: 'auto' }}
        />
      ) : (
        message
      )}
    </div>
  );
};

export default React.memo(MessageBubble);

const styles = `
  .chat-bubble-user {
    color: black;
    position: relative;
    border-radius: 1rem 1rem 0 1rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    text-align: left;
  }

  .chat-bubble-bot {
    color: #253E54;
    position: relative;
    border-radius: 1rem 1rem 1rem 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    text-align: left;
  }

`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
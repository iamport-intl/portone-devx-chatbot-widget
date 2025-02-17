import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { sendFeedback } from '../../services/chatService';
import { getAssetUrl } from '../../services/assetsService';
import Image from 'next/image';

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
  latestMessageId?: string; // new prop to mark the latest bot message
};

const MessageBubble = ({ sender, message, conversationId, messageId, sentiment, latestMessageId }: MessageBubbleProps) => {
  // Normalize the sentiment to a string so that both numeric and string values work.
  const normalizedSentiment = sentiment?.toString();
  const initialFeedback = normalizedSentiment === "positive" ? 'up' : normalizedSentiment === "negative" ? 'down' : null;
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(initialFeedback);

  // New state for expand/collapse of truncated messages.
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE_LENGTH = 200;
  const isLatest = sender === 'bot' && (messageId === latestMessageId);
  let displayedMessage = message;

  // For bot messages that are not the latest and are long, show a truncated version.
  if (sender === 'bot' && !isLatest && !expanded && message.length > TRUNCATE_LENGTH) {
    displayedMessage = message.slice(0, TRUNCATE_LENGTH) + '...';
  }

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
          <MarkdownRenderer content={displayedMessage} />
          {/* Toggle "See more" / "See less" button if message is long and not the latest */}
          {latestMessageId && messageId !== latestMessageId && message.length > TRUNCATE_LENGTH && (
            <div className="mb-3">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-primary hover:underline"
              >
                {expanded ? "See less" : "See more"}
              </button>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-2 feedback-btns">
            {feedback === null ? (
              <>
                <button
                  onClick={() => {
                    setFeedback('up');
                    sendFeedback(conversationId as string, messageId as string, "positive");
                  }}
                  className="feedback-btn cursor-pointer hover:bg-gray-200 p-1 rounded"
                >
                  👍
                </button>
                <button
                  onClick={() => {
                    setFeedback('down');
                    sendFeedback(conversationId as string, messageId as string, "negative");
                  }}
                  className="feedback-btn cursor-pointer hover:bg-gray-200 p-1 rounded"
                >
                  👎
                </button>
              </>
            ) : feedback === 'up' ? (
              <button className="feedback-btn active cursor-pointer bg-gray-200 text-white p-1 rounded">👍</button>
            ) : (
              <button className="feedback-btn active cursor-pointer bg-gray-200 text-white p-1 rounded">👎</button>
            )}
          </div>
        </>
      ) : sender === 'indicator' ? (
        <Image
          src={getAssetUrl("typing.gif")}
          alt="Typing..."
          width={20}
          height={15}
          style={{ objectFit: 'contain', imageRendering: 'auto' }}
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

  .feedback-btns {
    position: absolute;
    bottom: -15px;
    left: 10px;
  }

  .feedback-btn {
    padding: 5px;
    border-radius: 50%;
    background-color: #F1F1F2;
    color: #fc6b2d;
  }

  .feedback-btn:hover {
    background-color: #fc6b2d1a;
  }

  .feedback-btn.active {
    background-color: #fc6b2d1a;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
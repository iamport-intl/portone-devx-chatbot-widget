import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { sendFeedback } from '../../services/chatService';
import { getAssetUrl } from '../../services/assetsService';
import Image from 'next/image';

const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'), { 
  ssr: false, 
  loading: () => <div className="animate-pulse">
       <Image
          src={getAssetUrl("typing.gif")}
          unoptimized
          alt="Typing..."
          width={20}
          height={15}
          style={{ objectFit: 'contain', imageRendering: 'auto' }}
        />
  </div>
});

export type MessageBubbleProps = {
  sender: 'user' | 'bot' | 'indicator';
  message: string;
  conversationId?: string;
  messageId?: string;
  sentiment?: string; // "positive", "negative" or "neutral"
  latestMessageId?: string; // new prop to mark the latest bot message
};

// Moved outside so it is not re-created on every render.
const alignmentClasses = {
  user: 'self-end bg-[#fc6b2d1a] mr-4 chat-bubble-user',
  bot: 'self-start bg-gray-50 ml-4 chat-bubble-bot pb-[30px] leading-relaxed',
  indicator: 'self-start ml-4'
};

const MessageBubble = ({ sender, message, conversationId, messageId, sentiment, latestMessageId }: MessageBubbleProps) => {
  // Normalize sentiment value.
  const normalizedSentiment = sentiment?.toString();
  const initialFeedback = normalizedSentiment === "positive" ? 'up' : normalizedSentiment === "negative" ? 'down' : null;
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(initialFeedback);

  // State to control expansion of the message.
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE_LENGTH = 200;
  const isLatest = sender === 'bot' && (messageId === latestMessageId);
  let displayedMessage = message;

  // Truncate long messages if they are not the latest.
  if (sender === 'bot' && !isLatest && !expanded && message.length > TRUNCATE_LENGTH) {
    displayedMessage = message.slice(0, TRUNCATE_LENGTH) + '...';
  }

  if (!message || message.length === 0) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div className={clsx('p-3 rounded-xl mb-3 relative max-w-[85%]', alignmentClasses[sender])}>
      {sender === 'bot' ? (
        <>
          <MarkdownRenderer content={displayedMessage} />
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
          unoptimized
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
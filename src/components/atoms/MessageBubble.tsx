import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

type MessageBubbleProps = {
  role: 'user' | 'bot' | 'indicator';
  content: string;
};

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const alignmentClasses = {
    user: 'self-end bg-[#fc6b2d1a] mr-4 chat-bubble-user',
    bot: 'self-start bg-gray-50 ml-4 chat-bubble-bot',
    indicator: 'self-start ml-4'
  };

  return (
    <div
      className={clsx(
        'p-3 rounded-xl mb-3 relative max-w-[85%]',
        alignmentClasses[role]
      )}
    >
      {role === 'bot' && <ReactMarkdown>{content}</ReactMarkdown>}
      {role === 'indicator' && (
        <img
          src="/typing.gif"
          alt="Typing..."
          className="w-10 h-5 object-contain"
          style={{ imageRendering: 'auto' }}
        />
      )}
      {role === 'user' && content}
    </div>
  );
}

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
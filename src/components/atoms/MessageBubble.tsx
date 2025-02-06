import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

type MessageBubbleProps = {
  role: 'user' | 'bot' | 'indicator';
  content: string;
};

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  return (
    <div
      className={clsx(
        'p-3 rounded-xl mb-3 relative max-w-[85%]',
        role === 'user' && 'bg-[#fc6b2d1a] float-right chat-bubble-user mr-4',
        role === 'bot' && 'bg-gray-50 float-left chat-bubble-bot ml-4',
        role === 'indicator' && 'italic text-gray-500 mx-auto'
      )}
    >
      {role === 'bot' ? <ReactMarkdown>{content}</ReactMarkdown> : content}
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
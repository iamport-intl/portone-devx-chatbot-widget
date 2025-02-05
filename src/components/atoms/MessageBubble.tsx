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
        'p-2 rounded-lg',
        role === 'user' && 'bg-secondary text-black',
        role === 'bot' && 'bg-gray-100 text-black',
        role === 'indicator' && 'italic text-gray-500'
      )}
      style={role === 'user' ? { backgroundColor: '#fc6b2d1a', color: 'black' } : {}}
    >
      {role === 'bot' ? <ReactMarkdown>{content}</ReactMarkdown> : content}
    </div>
  );
}

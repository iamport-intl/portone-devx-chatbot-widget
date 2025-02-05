import MessageBubble from '../atoms/MessageBubble';

type Message = {
  id: string;
  role: 'user' | 'bot' | 'indicator';
  content: string;
};

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 p-3 overflow-y-auto space-y-2">
      {messages.map((msg, index) => (
        <MessageBubble key={`${msg.id}-${index}`} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
}

import MessageBubble from '../atoms/MessageBubble';
import { Message } from '@/types/chat';

type MessageListProps = {
  messages: Message[];
  endRef?: React.RefObject<HTMLDivElement | null>;
};

export default function MessageList({ messages, endRef }: MessageListProps) {
  console.log(messages);
  return (
    <div className="chat-window flex-1 p-3 overflow-y-auto flex flex-col space-y-2">
      {messages.map((msg, index) => (
        <MessageBubble
          key={`${msg.id}-${index}`}
          sender={msg.sender}
          message={msg.message}
          sentiment={msg.sentiment}
          conversationId={msg.conversationId}
          messageId={msg.id}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}

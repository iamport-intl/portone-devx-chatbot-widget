import React from 'react';
import ConversationCard, { Conversation } from '../atoms/ConversationCard';

type ConversationHistoryProps = {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation & { messages: any[]; last_message_time: string; user_id: string }) => void;
};

export default function ConversationHistory({ conversations, onSelectConversation }: ConversationHistoryProps) {
  return (
    <div className="p-4 overflow-y-auto flex-1">
      {conversations.length === 0 ? (
        <div>No conversations found.</div>
      ) : (
        conversations.map((conv) => (
          <ConversationCard
            key={conv.conversation_id}
            conversation={conv}
            onClick={() => onSelectConversation(conv as any)}
          />
        ))
      )}
    </div>
  );
}
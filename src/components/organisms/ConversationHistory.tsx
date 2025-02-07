import React from 'react';
import ConversationCard from '../atoms/ConversationCard';
import { Conversation } from '@/types/chat';

type ConversationHistoryProps = {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
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
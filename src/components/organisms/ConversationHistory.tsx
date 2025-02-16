import React from 'react';
import ConversationCard from '../atoms/ConversationCard';
import { Conversation } from '@/types/chat';

type ConversationHistoryProps = {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string) => void;
};

export default function ConversationHistory({ conversations, onSelectConversation, onDeleteConversation }: ConversationHistoryProps) {
  return (
    <div className="overflow-y-auto flex-1 conversation-history flex items-center">
      <div className="w-full flex flex-col gap-2 bg-white p-4 rounded-lg mt-14">
        {conversations.length === 0 ? (
          <div className="text-center">No conversations found.</div>
        ) : (
          conversations.map((conv) => (
            <ConversationCard
              key={conv.conversation_id}
              conversation={conv}
              onClick={() => onSelectConversation(conv)}
              onDelete={() => onDeleteConversation(conv.conversation_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
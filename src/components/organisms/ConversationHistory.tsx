import React, { useCallback } from 'react';
import ConversationCard from '../atoms/ConversationCard';
import { Conversation } from '@/types/chat';

type ConversationHistoryProps = {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string) => void;
};

const ConversationItem = React.memo(function ConversationItem({
  conversation,
  onSelectConversation,
  onDeleteConversation,
}: {
  conversation: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversationId: string) => void;
}) {
  const handleSelect = useCallback(() => {
    onSelectConversation(conversation);
  }, [conversation, onSelectConversation]);

  const handleDelete = useCallback(() => {
    onDeleteConversation(conversation.conversation_id);
  }, [conversation, onDeleteConversation]);

  return (
    <ConversationCard
      conversation={conversation}
      onClick={handleSelect}
      onDelete={handleDelete}
    />
  );
});

export default function ConversationHistory({
  conversations,
  onSelectConversation,
  onDeleteConversation,
}: ConversationHistoryProps) {
  return (
    <div className="overflow-y-auto flex-1 conversation-history">
      <div className="w-full flex flex-col gap-2 bg-white p-4 rounded-lg">
        {conversations.length === 0 ? (
          <div className="text-center">No conversations found.</div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.conversation_id}
              conversation={conv}
              onSelectConversation={onSelectConversation}
              onDeleteConversation={onDeleteConversation}
            />
          ))
        )}
      </div>
    </div>
  );
}
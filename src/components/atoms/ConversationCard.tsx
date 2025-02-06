import React from 'react';

export type Conversation = {
  conversation_id: string;
  created_at: string;
  title: string;
  // Other fields (e.g. messages, last_message_time, user_id) will be available in the conversation object.
};

type ConversationCardProps = {
  conversation: Conversation;
  onClick: () => void;
};

export default function ConversationCard({ conversation, onClick }: ConversationCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 mb-2"
    >
      <div>
        <p className="text-sm text-gray-800">{conversation.title}</p>
      </div>
      <div>
       <p className="text-xs text-gray-500">{new Date(Number(conversation.created_at) * 1000).toDateString()}</p>
      </div>
    </div>
  );
}
import React from 'react';
import { Conversation } from '@/types/chat';

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
       <p className="text- text-gray-500">{new Date(Number(conversation.created_at) * 1000).toDateString()}</p>
      </div>
    </div>
  );
}
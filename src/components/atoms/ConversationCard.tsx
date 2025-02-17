import React from 'react';
import { Conversation } from '@/types/chat';
import Image from 'next/image';
import { getAssetUrl } from '@/services/assetsService';

type ConversationCardProps = {
  conversation: Conversation;
  onClick: () => void;
  onDelete?: () => void;
};

function ConversationCard({ conversation, onClick, onDelete }: ConversationCardProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the card's left side onClick from being triggered.
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    } else {
      console.log("Delete clicked for", conversation.conversation_id);
    }
  };

  return (
    <div className="flex items-stretch bg-gray-50 rounded-lg mb-2 overflow-hidden">
      <button
        type="button"
        onClick={onClick}
        className="relative flex-1 p-4 cursor-pointer group hover:bg-gray-100 text-left"
      >
        <div className="flex flex-col">
          <p className="text-sm text-gray-800">{conversation.title}</p>
          <p className="text-xs text-gray-500">
            {new Date(Number(conversation.created_at) * 1000).toDateString()}
          </p>
        </div>
        <div className="absolute top-0 right-0 h-full w-px bg-gray-200 group-hover:bg-blue-500" />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="relative p-4 flex items-center justify-center group hover:bg-gray-100"
        aria-label="Delete conversation"
      >
        <div className="absolute top-0 left-0 h-full w-px bg-gray-200 group-hover:bg-red-500" />
        <Image
          src={getAssetUrl('trash.svg')}
          alt="Delete"
          width={30}
          height={30}
          className="cursor-pointer"
        />
      </button>
    </div>
  );
}

export default React.memo(ConversationCard);

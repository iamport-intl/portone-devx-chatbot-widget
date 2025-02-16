import React from 'react';
import { Conversation } from '@/types/chat';
import Image from 'next/image';
import { getAssetUrl } from '@/services/assetsService';

type ConversationCardProps = {
  conversation: Conversation;
  onClick: () => void;
  onDelete?: () => void;
};

export default function ConversationCard({
  conversation,
  onClick,
  onDelete,
}: ConversationCardProps) {
  const handleDelete = (e: React.MouseEvent<HTMLImageElement>) => {
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
      <div
        onClick={onClick}
        className="relative flex-1 p-4 cursor-pointer group hover:bg-gray-100"
      >
        <div className="flex flex-col">
          <p className="text-sm text-gray-800">{conversation.title}</p>
          <p className="text-xs text-gray-500">
            {new Date(Number(conversation.created_at) * 1000).toDateString()}
          </p>
        </div>
        <div className="absolute top-0 right-0 h-full w-px bg-gray-200 group-hover:bg-blue-500" />
      </div>

      {/* Right side: Delete icon */}
      <div className="relative p-4 flex items-center justify-center group hover:bg-gray-100">
        <div className="absolute top-0 left-0 h-full w-px bg-gray-200 group-hover:bg-red-500" />
        <Image
          src={getAssetUrl('trash.svg')}
          alt="Delete"
          width={30}
          height={30}
          onClick={handleDelete}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}

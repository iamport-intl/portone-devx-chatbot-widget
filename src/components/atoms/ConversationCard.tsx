import React from 'react';
import { Conversation } from '@/types/chat';
import Image from 'next/image';
import { getAssetUrl } from '@/services/assetsService';


type ConversationCardProps = {
  conversation: Conversation;
  onClick: () => void;
  onDelete?: () => void;
};

export default function ConversationCard({ conversation, onClick, onDelete }: ConversationCardProps) {
  const handleDelete = (e: React.MouseEvent<HTMLImageElement>) => {
    // Prevent the card's onClick from being triggered.
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    } else {
      console.log("Delete clicked for", conversation.conversation_id);
    }
  };

  return (
    <div className="flex flex-row gap-2 bg-gray-50 hover:bg-gray-100 p-4 rounded-lg mb-2 items-center justify-between" >
      <div
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="flex flex-col">
          <p className="text-sm text-gray-800">{conversation.title}</p>
          <p className="text-xs text-gray-500">{new Date(Number(conversation.created_at) * 1000).toDateString()}</p>
        </div>
      </div>
      <hr className="w-1 h-10 mx-2 bg-gray-200" />
      <Image
          src={getAssetUrl('trash.svg')}
          alt="Delete"
          width={30}
          height={30}
          onClick={handleDelete}
          className="ml-4 cursor-pointer"
        />
    </div>
  );
}

import React from 'react';
import Image from 'next/image';
import { getAssetUrl } from '../../services/assetsService';

type ChatHeaderProps = {
  title: string;
  onClose: () => void;
  leftComponent?: React.ReactNode;
};

const ChatHeader = ({ title, onClose, leftComponent }: ChatHeaderProps) => {
  return (
    <div className="bg-[#fc6b2d] p-6 flex justify-between items-center relative">
      {leftComponent && <div>{leftComponent}</div>}
      <h2 className="text-white text-xl font-bold mx-auto">{title}</h2>
      <Image
        onClick={onClose}
        src={getAssetUrl("close.svg")}
        alt="Close"
        title="Close"
        width={20}
        height={20}
        className="cursor-pointer"
      />
    </div>
  );
};

export default React.memo(ChatHeader);
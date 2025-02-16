import React from 'react';
import Image from 'next/image';
import { getAssetUrl } from '@/services/assetsService';

type ChatButtonProps = {
    onClick: () => void;
    style?: React.CSSProperties;
  };

const ChatButton = ({ onClick }: ChatButtonProps) => {
    return (
      <Image
        onClick={onClick}
        src="/chat-intro.svg"
        alt="Help"
        width={100}
        height={70}
        className="fixed bottom-0 right-0 m-2 cursor-pointer"
      />
    );
  };

export default React.memo(ChatButton);
  
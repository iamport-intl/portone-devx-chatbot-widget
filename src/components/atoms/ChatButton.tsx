import React from 'react';
import Image from 'next/image';
import { getAssetUrl } from '@/services/assetsService';

type ChatButtonProps = {
    onClick: () => void;
    style?: React.CSSProperties;
};

const ChatButton = ({ onClick, style }: ChatButtonProps) => {
    return (
      <button
        type="button"
        onClick={onClick}
        style={style}
        className="fixed bottom-0 right-0 m-2 cursor-pointer focus:outline-none group"
        aria-label="Open chat"
      >
        <Image
          src={getAssetUrl("chat-intro.svg")}
          alt="Help"
          width={100}
          height={70}
          priority
          className="transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </button>
    );
};

export default React.memo(ChatButton);
  
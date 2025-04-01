import React, { useState } from 'react';
import Image from 'next/image';
import { getAssetUrl } from '@/services/assetsService';

type ChatButtonProps = {
    onClick: () => void;
    style?: React.CSSProperties;
};

const ChatButton = ({ onClick, style }: ChatButtonProps) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        onClick();
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        style={style}
        className={`fixed bottom-0 right-0 m-8 cursor-pointer focus:outline-none ${
          !isClicked ? 'bounce-animation' : ''
        }`}
        aria-label="Open chat"
      >
        <Image
          src={getAssetUrl("chat-intro1.svg")}
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
  
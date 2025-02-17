import React from 'react';
import Image from 'next/image';
import { getAssetUrl } from '../../services/assetsService';

type ChatHeaderProps = {
  title: string;
  onClose: () => void;
  onSwitchToNew?: () => void;
  onSwitchToHistory?: () => void;
  showHistoryTab?: boolean;
};

const ChatHeader = ({
  title,
  onClose,
  onSwitchToNew,
  onSwitchToHistory,
  showHistoryTab = false,
}: ChatHeaderProps) => {
  return (
    <div>
      <div className="bg-[#fc6b2d] p-6 relative flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="focus:outline-none"
        >
          <Image
            src={getAssetUrl("close.svg")}
            alt="Close"
            title="Close"
            width={20}
            height={20}
            className="cursor-pointer"
            priority
          />
        </button>
      </div>
      {(onSwitchToNew || (onSwitchToHistory && showHistoryTab)) && (
        <nav aria-label="Chat Navigation">
          <div className="flex">
            {showHistoryTab && onSwitchToHistory && (
              <button
                type="button"
                onClick={onSwitchToHistory}
                className="flex-1 flex items-center justify-center py-2 cursor-pointer text-center text-[#26374B] bg-[#FFDFC6] focus:outline-none"
                aria-label="View conversation history"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={getAssetUrl("history.svg")}
                    alt="History"
                    width={20}
                    height={20}
                    priority
                  />
                  History
                </div>
              </button>
            )}
            {onSwitchToNew && (
              <button
                type="button"
                onClick={onSwitchToNew}
                className="flex-1 flex items-center justify-center py-2 cursor-pointer text-center text-[#26374B] bg-[#FFEDDF] focus:outline-none"
                aria-label="Start new chat"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={getAssetUrl("plus.svg")}
                    alt="New Chat"
                    width={20}
                    height={20}
                    priority
                  />
                  New Chat
                </div>
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  );
};

export default React.memo(ChatHeader);
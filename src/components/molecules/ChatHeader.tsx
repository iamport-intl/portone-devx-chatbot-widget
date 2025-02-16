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
      {(onSwitchToNew || (onSwitchToHistory && showHistoryTab)) && (
        <div className="flex">
          {showHistoryTab && onSwitchToHistory && (
            <div
              className="flex-1 flex items-center justify-center py-2 cursor-pointer text-center text-[#26374B] bg-[#FFDFC6]"
              onClick={onSwitchToHistory}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={getAssetUrl("history.svg")}
                  alt="History"
                  width={20}
                  height={20}
                />
                History
              </div>
            </div>
          )}
          {onSwitchToNew && (
            <div
              className="flex-1 flex items-center justify-center py-2 cursor-pointer text-center text-[#26374B] bg-[#FFEDDF]"
              onClick={onSwitchToNew}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={getAssetUrl("plus.svg")}
                  alt="New Chat"
                  width={20}
                  height={20}
                />
                New Chat
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatHeader);
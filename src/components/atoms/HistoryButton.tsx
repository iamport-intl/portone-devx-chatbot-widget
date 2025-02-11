import React from 'react';
import Image from 'next/image';
import { getAssetUrl } from '../../services/assetsService';

type HistoryButtonProps = {
  onClick: () => void;
  isHistoryView?: boolean;
};

const HistoryButton = ({ onClick, isHistoryView = false }: HistoryButtonProps) => {
  return (
    <div className="flex items-center justify-center">
      {isHistoryView ? (
        <Image
          onClick={onClick}
          src={getAssetUrl("back.svg")}
          alt="Back"
          title="Return to Chat"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      ) : (
        <Image
          onClick={onClick}
          src={getAssetUrl("history.svg")}
          alt="History"
          title="See Conversation History"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default React.memo(HistoryButton);   
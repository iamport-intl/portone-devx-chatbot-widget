import React from 'react';
import { getAssetUrl } from '../../services/assetsService';

type HistoryButtonProps = {
  onClick: () => void;
  isHistoryView?: boolean;
};

export default function HistoryButton({ onClick, isHistoryView = false }: HistoryButtonProps) {
  return (
    <div className="flex items-center justify-center">
      {isHistoryView ? (
        <img
          onClick={onClick}
          src={getAssetUrl("back.svg")}
          alt="Back"
          className="w-5 h-5 cursor-pointer"
        />
      ) : (
        <img
          onClick={onClick}
          src={getAssetUrl("history.svg")}
          alt="History"
          className="w-5 h-5 cursor-pointer"
        />
      )}
    </div>
  );
}   
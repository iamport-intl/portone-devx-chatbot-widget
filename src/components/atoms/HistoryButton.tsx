import React from 'react';

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
          src="/back.svg"
          className="w-5 h-5 cursor-pointer text-white"
        />
      ) : (
        <img
          onClick={onClick}
          src="/history.svg"
          className="w-5 h-5 cursor-pointer text-white"
        />
      )}
    </div>
  );
}   
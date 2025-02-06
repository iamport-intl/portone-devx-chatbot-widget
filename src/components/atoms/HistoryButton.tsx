import React from 'react';

type HistoryButtonProps = {
  onClick: () => void;
  isHistoryView?: boolean;
};

export default function HistoryButton({ onClick, isHistoryView = false }: HistoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
    >
      {isHistoryView ? 'Back' : 'History'}
    </button>
  );
}
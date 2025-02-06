import React from 'react';

type ChatHeaderProps = {
  title: string;
  onClose: () => void;
  leftComponent?: React.ReactNode;
};

export default function ChatHeader({ title, onClose, leftComponent }: ChatHeaderProps) {
  return (
    <div className="bg-[#fc6b2d] p-6 flex justify-between items-center relative">
      {leftComponent && <div className="absolute left-4 top-4">{leftComponent}</div>}
      <h2 className="text-white text-xl font-bold mx-auto">{title}</h2>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 p-1"
      >
        ✕
      </button>
    </div>
  );
}
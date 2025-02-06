import React from 'react';

type ChatHeaderProps = {
  title: string;
  onClose: () => void;
  leftComponent?: React.ReactNode;
};

export default function ChatHeader({ title, onClose, leftComponent }: ChatHeaderProps) {
  return (
    <div className="bg-[#fc6b2d] p-6 flex justify-between items-center relative">
      {leftComponent && <div className="">{leftComponent}</div>}
      <h2 className="text-white text-xl font-bold mx-auto">{title}</h2>
      <img
        onClick={onClose}
        src="/close.svg"
        className="w-5 h-5 cursor-pointer text-white"
      />
    </div>
  );
}
import React from 'react';

type CancelButtonProps = {
  onClick: () => void;
};

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <div className="bg-[#fc6b2d] p-4 rounded-lg cursor-pointer" onClick={onClick}>
      <img
        src="/cancel.svg"
        className="w-5 h-5 text-white cursor-pointer"
      />
    </div>
  );
} 
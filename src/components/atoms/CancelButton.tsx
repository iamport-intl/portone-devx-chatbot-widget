import React from 'react';
import { getAssetUrl } from '../../services/assetsService';

type CancelButtonProps = {
  onClick: () => void;
};

export default function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <div className="bg-[#fc6b2d] p-4 rounded-lg cursor-pointer" onClick={onClick}>
      <img
        src={getAssetUrl("cancel.svg")}
        alt="Cancel"
        className="w-5 h-5 cursor-pointer"
      />
    </div>
  );
} 
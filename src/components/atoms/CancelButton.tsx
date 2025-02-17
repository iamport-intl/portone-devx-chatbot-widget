import React from 'react';
import Image from 'next/image';
import { getAssetUrl } from '../../services/assetsService';

type CancelButtonProps = {
  onClick: () => void;
};

const CancelButton = ({ onClick }: CancelButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Cancel message"
      className="bg-[#fc6b2d] p-4 rounded-lg cursor-pointer focus:outline-none"
    >
      <Image
        src={getAssetUrl("cancel.svg")}
        alt="Cancel"
        width={20}
        height={20}
        className="w-5 h-5"
      />
    </button>
  );
};

export default React.memo(CancelButton); 
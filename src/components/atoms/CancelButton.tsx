import React from 'react';
import Image from 'next/image';
import { getAssetUrl } from '../../services/assetsService';

type CancelButtonProps = {
  onClick: () => void;
};

const CancelButton = ({ onClick }: CancelButtonProps) => {
  return (
    <div className="bg-[#fc6b2d] p-4 rounded-lg cursor-pointer" onClick={onClick}>
      <Image
        src={getAssetUrl("cancel.svg")}
        alt="Cancel"
        width={20}
        height={20}
        className="w-5 h-5 cursor-pointer"
      />
    </div>
  );
};

export default React.memo(CancelButton); 
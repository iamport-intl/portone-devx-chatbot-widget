import React from 'react';

type PromptCardProps = {
  text: string;
  onClick?: () => void;
};

const PromptCard = ({ text, onClick }: PromptCardProps) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 text-left focus:outline-none"
      aria-label={text}
    >
      {text}
    </button>
  );
};

export default React.memo(PromptCard); 
import React from 'react';

type PromptCardProps = {
  text: string;
  onClick?: () => void;
};

const PromptCard = ({ text, onClick }: PromptCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
    >
      {text}
    </div>
  );
};

export default React.memo(PromptCard); 
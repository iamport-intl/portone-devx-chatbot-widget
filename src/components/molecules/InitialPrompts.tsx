import PromptCard from '../atoms/PromptCard';

type InitialPromptsProps = {
  onSelectPrompt?: (prompt: string) => void;
};

const prompts = [
  "How to use PortOne for your Indian Shopify store",
  "I am getting Amount Limit error. What does it mean?",
  "How to activate my account",
];

export default function InitialPrompts({ onSelectPrompt }: InitialPromptsProps) {
  return (
    <div className="space-y-2 mb-4 px-4 flex flex-col">
      {prompts.map((prompt, index) => (
        <PromptCard 
          key={index} 
          text={prompt} 
          onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
        />
      ))}
    </div>
  );
} 
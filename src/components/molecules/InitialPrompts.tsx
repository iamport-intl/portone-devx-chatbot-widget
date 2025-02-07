import PromptCard from '../atoms/PromptCard';

type InitialPromptsProps = {
  onSelectPrompt?: (prompt: string) => void;
};

const prompts = [
  "How to integrate portone web sdk in my website? Give me a step by step guide.",
  "Can portone help me in reconciling my accounts across multiple payment gateways?",
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
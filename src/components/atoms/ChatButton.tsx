type ChatButtonProps = {
    onClick: () => void;
    icon?: React.ReactNode;
    style?: React.CSSProperties;
  };
  export default function ChatButton({ onClick, icon, style }: ChatButtonProps) {
    return (
      <button
        onClick={onClick}
        style={{ backgroundColor: '#fc6b2d', ...style }}
        className="fixed bottom-4 right-4 text-white p-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      >
        {icon || '💬'}
      </button>
    );
  }
  
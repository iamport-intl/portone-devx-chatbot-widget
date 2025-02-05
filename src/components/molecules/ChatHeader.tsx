type ChatHeaderProps = {
    title: string;
    onClose: () => void;
  };
  export default function ChatHeader({ title, onClose }: ChatHeaderProps) {
    return (
      <div className="bg-primary p-3 flex justify-between" style={{ backgroundColor: '#fc6b2d' }}>
        <h2 className="text-white font-semibold">{title}</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200 w-5 h-5 bg-slate-500 rounded-full text-xs font-semibold text-center">
          X
        </button>
      </div>
    );
  }
  
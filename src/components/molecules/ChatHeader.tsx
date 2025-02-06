type ChatHeaderProps = {
    title: string;
    onClose: () => void;
  };
  export default function ChatHeader({ title, onClose }: ChatHeaderProps) {
    return (
      <div className="bg-[#fc6b2d] p-6 flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">Welcome to PortOne Support</h2>
        <button 
          onClick={onClose} 
          className="text-white hover:text-gray-200 p-1"
        >
          ✕
        </button>
      </div>
    );
  }
  
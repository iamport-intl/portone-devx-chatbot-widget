'use client';

import ChatWidget from '@/components/organisms/ChatWidget';

// Define props type
type ChatTemplateProps = {
  initialPath: string;
};

export default function ChatTemplate({ initialPath }: ChatTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pass initialPath to ChatWidget */}
      <ChatWidget initialPath={initialPath} />
    </div>
  );
}

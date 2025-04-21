'use client';

import ChatPage from '@/pages/ChatPage';
import ChatTemplate from '../templates/ChatTemplate';

// Define props type
type HomeProps = {
  initialPath: string;
};

export default function Home({ initialPath }: HomeProps) {
  // Pass initialPath to ChatTemplate
  return <ChatTemplate initialPath={initialPath} />;
}
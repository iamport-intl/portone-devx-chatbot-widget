export type Message = {
  id: string;
  sentiment: string;
  conversationId: string;
  message: string;
  sender: 'user' | 'bot' | 'indicator';
};

export type MessageMap = Record<string, Message>;

export type Conversation = {
  conversation_id: string;
  created_at: string;
  messages: MessageMap;
  last_message_time: string;
  user_id: string;
  title: string;
}; 
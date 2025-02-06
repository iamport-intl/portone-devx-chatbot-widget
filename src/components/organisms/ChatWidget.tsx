'use client';

import { useEffect, useState, useRef } from 'react';
import ChatHeader from "../molecules/ChatHeader"
import MessageList from "../molecules/MessageList"
import InputField from "../atoms/InputField"
import ChatButton from "../atoms/ChatButton"
import { assignUser, fetchConversations, sendMessage as apiSendMessage } from "../../services/chatService"


type Message = {
  id: string;
  role: 'user' | 'indicator' | 'bot';
  content: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // On mount, check localStorage or assign new user.
  useEffect(() => {
    const storedUser = localStorage.getItem('chat_user_id');
    if (storedUser) {
      setUserId(storedUser);
      fetchConversations(storedUser).then((conversations) => setMessages(conversations));
    } else {
      assignUser().then((data) => {
        if (data.user_id) {
          setUserId(data.user_id);
          localStorage.setItem('chat_user_id', data.user_id);
        }
      });
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || !userId || isLoading) return;
    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    const botMessageId = (Date.now() + 1).toString();
    // Create initial bot message with typing indicator
    const initialBotMessage: Message = { id: botMessageId, role: 'indicator', content: 'Typing...' };

    // Add both user message and initial bot message
    setMessages((prev) => [...prev, userMessage, initialBotMessage]);
    setInput('');

    try {
      const { content: botContent, conversationId: newConversationId } = await apiSendMessage(
        userId,
        userMessage.content,
        conversationId,
        (partial: string) => {
          // When we get first partial data, change role to 'bot' and set the content
          setMessages((prev) =>
            prev.map((msg) => 
              msg.id === botMessageId 
                ? { ...msg, role: 'bot', content: partial }
                : msg
            )
          );
        }
      );

      setConversationId(newConversationId);

      // Update with final message content
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, role: 'bot', content: botContent } : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ChatButton onClick={() => setOpen(!open)} icon="💬" />
      {open && (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <ChatHeader title="Welcome to PortOne Support" onClose={() => setOpen(false)} />
          <MessageList messages={messages} endRef={messagesEndRef} />
          
          <div className="p-4 bg-white border-t">
            {!messages.some(msg => msg.role === 'user') && (
              <div className="space-y-2 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100">
                  How to use PortOne for your Indian Shopify store
                </div>
                <div className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100">
                  I am getting Amount Limit error. What does it mean?
                </div>
                <div className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100">
                  How to activate my account
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <InputField
                value={input}
                placeholder="Talk to Support..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-4 bg-[#fc6b2d] text-white rounded-lg hover:bg-[#e85d1f] disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

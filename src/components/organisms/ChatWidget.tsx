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
    if (!input.trim() || !userId) return;
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
    }
  };

  return (
    <>
      <ChatButton onClick={() => setOpen(!open)} icon="💬" />
      {open && (
        <div className="fixed bottom-20 right-4 w-2/5 h-1/2 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden">
          <ChatHeader title="Chatbot" onClose={() => setOpen(false)} />
          <MessageList messages={messages} />

          <div className="p-4 border-t border-gray-200">
            {!messages.some(msg => msg.role === 'user') && (
              <h3 className="text-black font-semibold text-lg pb-3">
                Hello! How can I help you today?
              </h3>
            )}
            <InputField
              value={input}
              placeholder="Type your message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </>
  );
}

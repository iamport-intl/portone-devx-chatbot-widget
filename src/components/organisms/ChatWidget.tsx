'use client';

import { useEffect, useState, useRef } from 'react';
import ChatHeader from "../molecules/ChatHeader"
import MessageList from "../molecules/MessageList"
import InputField from "../atoms/InputField"
import ChatButton from "../atoms/ChatButton"
import InitialPrompts from "../molecules/InitialPrompts"
import { assignUser, fetchConversations, sendMessage as apiSendMessage } from "../../services/chatService"
import HistoryButton from "../atoms/HistoryButton"
import ConversationHistory from "../organisms/ConversationHistory"


type Message = {
  id: string;
  role: 'user' | 'indicator' | 'bot';
  content: string;
};

type Conversation = {
  conversation_id: string;
  created_at: string;
  messages: {
    id: string;
    message: string;
    sender: string;
    timestamp: string;
  }[];
  last_message_time: string;
  user_id: string;
  title: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // On mount, check localStorage or assign new user.
  useEffect(() => {
    const storedUser = localStorage.getItem('chat_user_id');
    if (storedUser) {
      setUserId(storedUser);
      fetchConversations(storedUser).then((conversations) => setConversationHistory(conversations));
    } else {
      assignUser().then((data) => {
        if (data.user_id) {
          setUserId(data.user_id);
          localStorage.setItem('chat_user_id', data.user_id);
          fetchConversations(data.user_id).then((conversations) => setConversationHistory(conversations));
        }
      });
    }
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setConversationId(conversation.conversation_id);
    const mappedMessages = conversation.messages.map((msg) => ({
      id: msg.id,
      content: msg.message,
      role: (msg.sender === 'user' ? 'user' : 'bot') as 'user' | 'bot'
    }));
    setMessages(mappedMessages);
    setShowHistory(false);
  };

  const handleSendMessage = async (messageOverride?: string) => {
    const messageText = messageOverride !== undefined ? messageOverride.trim() : input.trim();
    if (!messageText || !userId || isLoading) return;
    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: messageText };
    const botMessageId = (Date.now() + 1).toString();
    
    const initialBotMessage: Message = { id: botMessageId, role: 'indicator', content: 'Typing...' };

    setMessages((prev) => [...prev, userMessage, initialBotMessage]);
    setInput('');

    try {
      const { content: botContent, conversationId: newConversationId } = await apiSendMessage(
        userId,
        userMessage.content,
        conversationId,
        (partial: string) => {
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
          <ChatHeader
            title={showHistory ? "Conversation History" : "Welcome to PortOne Support"}
            onClose={() => setOpen(false)}
            leftComponent={
              <HistoryButton
                onClick={() => setShowHistory(!showHistory)}
                isHistoryView={showHistory}
              />
            }
          />
          {showHistory ? (
            <ConversationHistory
              conversations={conversationHistory}
              onSelectConversation={handleSelectConversation}
            />
          ) : (
            <>
              <MessageList messages={messages} endRef={messagesEndRef} />
              {!messages.some(msg => msg.role === 'user') && (
                <InitialPrompts onSelectPrompt={(prompt) => handleSendMessage(prompt)} />
              )} 
              <div className="p-4 bg-white border-t">
                
                <div className="flex items-center gap-2">
                  <InputField
                    value={input}
                    placeholder="Talk to Support..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={isLoading}
                    className="p-4 bg-[#fc6b2d] text-white rounded-lg hover:bg-[#e85d1f] disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

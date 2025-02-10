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
import { Message, MessageMap, Conversation } from '@/types/chat'
import CancelButton from '../atoms/CancelButton';
import { getAssetUrl } from '../../services/assetsService';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<MessageMap>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Reference to hold the current abort controller for the sendMessage call.
  const sendControllerRef = useRef<AbortController | null>(null);
  // Reference to keep track of the pending bot message id (used for cancellation).
  const pendingMessageRef = useRef<string | null>(null);

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
    const mappedMessages: MessageMap = {};
    Object.values(conversation.messages).forEach((msg) => {
      mappedMessages[msg.id] = {
        id: msg.id,
        message: msg.message, // Use the "message" field from the API
        sender: msg.sender === 'user' ? 'user' : 'bot', // Use the "sender" field from the API
        sentiment: msg.sentiment, // Optionally, use the API's sentiment value
        conversationId: conversation.conversation_id
      };
    });
    setMessages(mappedMessages);
    setShowHistory(false);
  };

  const handleSendMessage = async (messageOverride?: string) => {
    const messageText = messageOverride !== undefined ? messageOverride.trim() : input.trim();
    if (!messageText || !userId || isLoading) return;
    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', message: messageText, sentiment: "0", conversationId: conversationId };
    // Generate a unique ID for the pending bot message.
    const botMessageId = (Date.now() + 1).toString();
    // Save the pending message id so it can be cancelled
    pendingMessageRef.current = botMessageId;

    const initialBotMessage: Message = { id: botMessageId, sender: 'indicator', message: 'Typing...', sentiment: "0", conversationId: conversationId };

    setMessages((prev) => ({ ...prev, [userMessage.id]: userMessage, [initialBotMessage.id]: initialBotMessage }));
    setInput('');

    // Create an AbortController so we can cancel the streaming request
    const controller = new AbortController();
    sendControllerRef.current = controller;

    try {
      const { content: botContent, conversationId: newConversationId } = await apiSendMessage(
        userId,
        userMessage.message,
        conversationId,
        (partial: string) => {
          // Update the pending bot message on partial update
          setMessages((prev) => ({
            ...prev,
            [botMessageId]: { ...prev[botMessageId], sender: 'bot', message: partial },
          }));
        },
        controller.signal
      );

      setConversationId(newConversationId);

      setMessages((prev) => ({
        ...prev,
        [botMessageId]: { ...prev[botMessageId], sender: 'bot', message: botContent },
      }));
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log("Message sending aborted");
        // Optionally remove the pending message from state
        setMessages((prev) => {
          const updated = { ...prev };
          delete updated[botMessageId];
          return updated;
        });
      } else {
        console.error('Error sending message:', error);
      }
    } finally {
      sendControllerRef.current = null;
      pendingMessageRef.current = null;
      setIsLoading(false);
    }
  };

  const handleCancelMessage = async () => {
    if (sendControllerRef.current && pendingMessageRef.current) {
      // Abort the ongoing fetch request.
      sendControllerRef.current.abort();
    }
  };

  // New functionality: Create a new chat thread
  const handleNewChatThread = () => {
    // Reset conversation and clear previous messages and input.
    setShowHistory(false);
    setConversationId('');
    setMessages({});
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <>
      <ChatButton onClick={() => setOpen(!open)} icon="💬" />
      {open && (
        <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <ChatHeader
            title={showHistory ? "Conversation History" : "PortOne Support"}
            onClose={() => setOpen(false)}
            leftComponent={
              <div className="flex gap-2">
                {conversationHistory.length > 0 && (
                  <HistoryButton
                    onClick={() => setShowHistory(!showHistory)}
                    isHistoryView={showHistory}
                  />
                )}
                <img
                  src={getAssetUrl("plus.svg")}
                  alt="New Chat"
                  title="Start a New Chat"
                  onClick={handleNewChatThread}
                  className="w-6 h-6 cursor-pointer"
                />
              </div>
            }
          />
          {showHistory ? (
            <ConversationHistory
              conversations={conversationHistory}
              onSelectConversation={handleSelectConversation}
            />
          ) : (
            <>
              <MessageList messages={Object.values(messages || {})} endRef={messagesEndRef} />
              {!Object.values(messages || {}).some(msg => msg.sender === 'user') && (
                <InitialPrompts onSelectPrompt={(prompt) => handleSendMessage(prompt)} />
              )}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                  <InputField
                    ref={inputRef}
                    value={input}
                    placeholder="Chat with Support..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                  />
                  {isLoading ? (
                    <CancelButton onClick={handleCancelMessage} />
                  ) : (
                    <div
                      className="bg-[#fc6b2d] p-4 rounded-lg cursor-pointer"
                      onClick={() => {
                        if (!isLoading) {
                          handleSendMessage();
                        }
                      }}
                    >
                      <img src={getAssetUrl("send.svg")} className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

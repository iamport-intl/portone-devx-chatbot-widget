'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import ChatHeader from "../molecules/ChatHeader"
import MessageList from "../molecules/MessageList"
import InputField from "../atoms/InputField"
import ChatButton from "../atoms/ChatButton"
import InitialPrompts, { FALLBACK_PROMPTS } from "../molecules/InitialPrompts"
import { assignUser, fetchConversations, sendMessage as apiSendMessage, deleteConversation, fetchStarterQuestions } from "../../services/chatService"
import ConversationHistory from "../organisms/ConversationHistory"
import { MessageMap, Conversation } from '@/types/chat'
import CancelButton from '../atoms/CancelButton';
import { getAssetUrl } from '../../services/assetsService';
import React from 'react';
import Image from 'next/image';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false)
  const [messages, setMessages] = useState<MessageMap>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [starterPrompts, setStarterPrompts] = useState<string[]>([]);
  const [isPromptsLoading, setIsPromptsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Reference to hold the current abort controller for the sendMessage call.
  const sendControllerRef = useRef<AbortController | null>(null);
  // Reference to keep track of the pending bot message id (used for cancellation).
  const pendingMessageRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(getAssetUrl("chat-open.mp3"));
    audioRef.current.volume = 0.5;
  }, []);

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

  // Fetch starter questions on mount or when path changes (using location for now)
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsPromptsLoading(true);
      // Using window.location.pathname as the path source.
      // Ensure this is appropriate for your application's routing.
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      try {
        const { questions } = await fetchStarterQuestions(currentPath);
        if (questions && questions.length > 0) {
          setStarterPrompts(questions);
        } else {
          // Fallback if API returns empty or error
          setStarterPrompts(FALLBACK_PROMPTS.sort(() => Math.random() - 0.5).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching starter prompts, using fallback:", error);
        // Fallback on network error
        setStarterPrompts(FALLBACK_PROMPTS.sort(() => Math.random() - 0.5).slice(0, 3));
      } finally {
        setIsPromptsLoading(false);
      }
    };

    fetchPrompts();
  }, [typeof window !== 'undefined' ? window.location.pathname : '']);

  const handleSelectConversation = useCallback((conversation: Conversation) => {
    handleCancelMessage();
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
  }, []);

  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      setConversationHistory((prev) => prev.filter(conv => conv.conversation_id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }, []);

  const handleSendMessage = useCallback(async (messageOverride?: string) => {
    const messageText = messageOverride !== undefined ? messageOverride.trim() : input.trim();
    if (!messageText || !userId || isLoading) return;
    setIsLoading(true);
    const userMessage = { id: Date.now().toString(), sender: 'user', message: messageText, sentiment: "0", conversationId: conversationId } as const;
    const botMessageId = (Date.now() + 1).toString();
    pendingMessageRef.current = botMessageId;
    const initialBotMessage = { id: botMessageId, sender: 'indicator', message: 'Typing...', sentiment: "0", conversationId: conversationId } as const;
    setMessages((prev) => ({ ...prev, [userMessage.id]: userMessage, [initialBotMessage.id]: initialBotMessage }));
    setInput('');
    const controller = new AbortController();
    sendControllerRef.current = controller;
    try {
      const { content: botContent, conversationId: newConversationId } = await apiSendMessage(
        userId,
        userMessage.message,
        conversationId,
        (partial: string) => {
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
      
      // Play sound when bot response is complete
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
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
  }, [input, userId, isLoading, conversationId]);

  const handleSendClick = useCallback(() => {
    if (!isLoading) {
      handleSendMessage();
    }
  }, [isLoading, handleSendMessage]);

  const handleCancelMessage = useCallback(() => {
    if (sendControllerRef.current && pendingMessageRef.current) {
      sendControllerRef.current.abort();
    }
  }, []);

  // New functionality: Create a new chat thread
  const handleNewChatThread = useCallback(() => {
    handleCancelMessage();
    // Reset conversation and clear previous messages and input.
    setShowHistory(false);
    setConversationId('');
    setMessages({});
    setInput('');
    inputRef.current?.focus();
  }, []);

  const handleSelectPrompt = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt);
    },
    [handleSendMessage] // Make sure handleSendMessage is either stable (e.g., memoized) or included as a dependency.
  );

  const toggleChatOpen = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleSwitchToNew = useCallback(() => {
    handleNewChatThread();
    setShowHistory(false);
  }, [handleNewChatThread]);
  const handleSwitchToHistory = useCallback(() => setShowHistory(true), []);

  return (
    <>
      {/* Only show the ChatButton when prompts are loaded */}
      {!isPromptsLoading && <ChatButton onClick={toggleChatOpen} />}

      {open && (
        <div className="fixed bottom-8 right-2 w-[calc(100vw-1rem)] max-w-md h-[80vh] max-h-[600px] md:bottom-9 md:right-4 md:w-96 md:h-[600px] md:max-w-none bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {initialLoad ?
          <>
          <ChatHeader
            title={showHistory ? "Conversation History" : process.env.APP_TITLE || 'PortOne'}
            onClose={handleClose}
            onSwitchToNew={handleSwitchToNew}
            onSwitchToHistory={handleSwitchToHistory}
            showHistoryTab={conversationHistory.length > 0}
          />
          {showHistory ? (
            <ConversationHistory
              conversations={conversationHistory}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
            />
          ) : (
            <>
              <MessageList messages={Object.values(messages || {})} endRef={messagesEndRef} />
              {!Object.values(messages || {}).some(msg => msg.sender === 'user') && !isPromptsLoading && starterPrompts.length > 0 && (
                <InitialPrompts prompts={starterPrompts} onSelectPrompt={handleSelectPrompt} />
              )}
              {isPromptsLoading && (
                 <div className="p-4 text-center text-gray-500">Loading suggestions...</div>
              )}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                  <InputField
                    ref={inputRef}
                    value={input}
                    placeholder="Chat with Support..."
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    disabled={isLoading}
                  />
                  {isLoading ? (
                    <CancelButton onClick={handleCancelMessage} />
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendClick}
                      className="bg-[#fc6b2d] p-4 rounded-lg cursor-pointer focus:outline-none"
                      aria-label="Send message"
                    >
                      <Image src={getAssetUrl("send.svg")} alt="Send" width={20} height={20}  />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </>
        :
        <>
        <div className="flex flex-col w-full h-full">
          <div className="bg-[#FF7628] p-6 flex-1 relative">
            <button 
              onClick={handleClose}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-yellow-500 transition-colors"
              aria-label="Close chat"
            >
              <Image
                src={getAssetUrl("close.svg")}
                alt="Close"
                title="Close"
                width={20}
                height={20}
                className="cursor-pointer"
                priority
              />
            </button>
            <p className="text-black font-semibold text-3xl mb-2">Hey there! 👋</p>
            <p className="text-black text-xl">Hi, I am PortOne Chatbot (Beta),</p>
            <p className="text-black text-lg">I can help clarify any questions you might have on the documentation</p>
          </div>
          <div className="bg-white p-4 flex-1">
            <div className="my-4 flex justify-center space-x-2">
              <button onClick={() => setInitialLoad(true)} className="bg-gray-200 p-2 rounded-lg">Chat now with PortOne ChatBot 💬</button>
            </div>
            <p className="text-gray-600 font-sm mt-10 text-center leading-[25px]">
              Messages you send are received by PortOne ChatBot (Beta) & Qualified for this conversation. Your use of this tool is subject to PortOne ChatBot's User.
            </p>
          </div>
        </div>
        </>
      }
        </div>
      )}
    </>
  );
}

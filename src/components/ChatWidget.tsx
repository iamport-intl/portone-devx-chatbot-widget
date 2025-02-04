// src/components/ChatWidget.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

type Message = {
  id: string;
  role: 'user' | 'bot' | 'indicator';
  content: string;
};

// https://chatbot-backend-t8bw.onrender.com
const API_BASE = 'http://localhost:8000'; // replace with your backend URL

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  // const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // On mount, check localStorage for a userId. If not found, request one.
  useEffect(() => {
    const storedUser = localStorage.getItem('chat_user_id');
    if (storedUser) {
      setUserId(storedUser);
      fetchConversations(storedUser);
    } else {
      fetch(`${API_BASE}/api/assign_user`, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.user_id) {
            setUserId(data.user_id);
            localStorage.setItem('chat_user_id', data.user_id);
          }
        })
        .catch((err) => console.error('Error assigning user:', err));
    }
  }, []);

  // Retrieve previous conversations.
  const fetchConversations = (user: string) => {
    fetch(`${API_BASE}/api/conversations?user_id=${user}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.conversations))
      .catch((err) => console.error('Error fetching conversations:', err));
  };

  // Send user message and handle streaming response.
  const sendMessage = async () => {
    if (!input.trim() || !userId) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    // Add user message and show typing indicator.
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: 'indicator', role: 'indicator', content: 'Bot is typing...' },
    ]);
    setInput('');
    // setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: "", user_id: userId, message: userMessage.content }),
      });

      // Process streaming response.
      if (response.body) {
        const reader = response.body.getReader();
        let botContent = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          let stringValue = new TextDecoder().decode(value);
          stringValue = stringValue.replace("data: ", "");
          console.log(stringValue);
          const jsonValue = JSON.parse(stringValue);
          console.log(jsonValue);
          if (jsonValue.data) {
            botContent += jsonValue.data;
          }
          // Optionally, update the bot message in realtime.
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === 'bot_temp' ? { ...msg, content: botContent } : msg
            )
          );
        }
        // Remove typing indicator and add final bot message.
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== 'indicator' && msg.id !== 'bot_temp')
            .concat({
              id: Date.now().toString(),
              role: 'bot',
              content: botContent,
            })
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      // setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        className="fixed bottom-4 right-4 bg-primary text-white p-4 w-14 h-14 rounded-full shadow-lg text-center flex items-center justify-center"
        style={{ backgroundColor: '#fc6b2d' }}
        onClick={() => setOpen(!open)}
      >
        {/* Simple Chatbot Icon (you can replace with an SVG or icon library) */}
        <span className="w-6 h-6">💬</span>
      </button>

      {/* Chat popup */}
      {open && (
        <div className="fixed bottom-20 right-4 w-2/5 h-1/2 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div
            className="bg-primary p-3 flex justify-between"
            style={{ backgroundColor: '#fc6b2d' }}
          >
            <h2 className="text-white font-semibold">Chatbot</h2>
            <div className="flex gap-1">
              <button className="text-white hover:text-gray-200 w-5 h-5 bg-slate-500 rounded-full text-xs font-semibold text-center">O</button>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-gray-200 w-5 h-5 bg-slate-500 rounded-full text-xs font-semibold text-center"
              >
                X
              </button>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  'p-2 rounded-lg',
                  msg.role === 'user' && 'bg-secondary text-black',
                  msg.role === 'bot' && 'bg-gray-100 text-black',
                  msg.role === 'indicator' && 'italic text-gray-500'
                )}
                style={
                  msg.role === 'user'
                    ? { backgroundColor: '#fc6b2d1a', color: 'black' }
                    : {}
                }
              >
                {msg.role === 'bot' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200 m">
            <h3 className="text-black font-semibold text-lg pb-3">
              Hello! How can I help you today?
            </h3>
            <div className="flex flex-col gap-y-2 p-2 mb-3">
              <button className="bg-primary text-white p-2 rounded">
                How to create an account?
              </button>
              <button className="bg-primary text-white p-2 rounded">
                How to reset my password?
              </button>
              <button className="bg-primary text-white p-2 rounded">
                How to change my email?
              </button>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border rounded text-black"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

// src/components/ChatWidget.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

type Message = {
  id: string;
  role: "user" | "bot" | "indicator";
  content: string;
};

const API_BASE = "https://your-backend-domain.com"; // replace with your backend URL

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // On mount, check localStorage for a userId. If not found, request one.
  useEffect(() => {
    const storedUser = localStorage.getItem("chat_user_id");
    if (storedUser) {
      setUserId(storedUser);
      fetchConversations(storedUser);
    } else {
      fetch(`${API_BASE}/assign_user`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          setUserId(data.user_id);
          localStorage.setItem("chat_user_id", data.user_id);
        })
        .catch((err) => console.error("Error assigning user:", err));
    }
  }, []);

  // Retrieve previous conversations.
  const fetchConversations = (user: string) => {
    fetch(`${API_BASE}/conversations?user_id=${user}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.conversations))
      .catch((err) => console.error("Error fetching conversations:", err));
  };

  // Send user message and handle streaming response.
  const sendMessage = async () => {
    if (!input.trim() || !userId) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    // Add user message and show typing indicator.
    setMessages((prev) => [...prev, userMessage, { id: "indicator", role: "indicator", content: "Bot is typing..." }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: userMessage.content }),
      });

      // Process streaming response.
      if (response.body) {
        const reader = response.body.getReader();
        let botContent = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          botContent += new TextDecoder().decode(value);
          // Optionally, update the bot message in realtime.
          setMessages((prev) =>
            prev.map((msg) => (msg.id === "bot_temp" ? { ...msg, content: botContent } : msg))
          );
        }
        // Remove typing indicator and add final bot message.
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== "indicator" && msg.id !== "bot_temp")
            .concat({ id: Date.now().toString(), role: "bot", content: botContent })
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg"
        style={{ backgroundColor: "#fc6b2d" }}
        onClick={() => setOpen(!open)}
      >
        {/* Simple Chatbot Icon (you can replace with an SVG or icon library) */}
        💬
      </button>

      {/* Chat popup */}
      {open && (
        <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-primary p-3" style={{ backgroundColor: "#fc6b2d" }}>
            <h2 className="text-white font-semibold">Chatbot</h2>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  "p-2 rounded-lg",
                  msg.role === "user" && "bg-secondary text-black",
                  msg.role === "bot" && "bg-gray-100 text-black",
                  msg.role === "indicator" && "italic text-gray-500"
                )}
                style={msg.role === "user" ? { backgroundColor: "#fc6b2d1a", color: "black" } : {}}
              >
                {msg.role === "bot" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border rounded"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
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

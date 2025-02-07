const API_BASE = 'https://chatbot-backend-t8bw.onrender.com';

export async function assignUser() {
  const response = await fetch(`${API_BASE}/api/assign_user`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

export async function fetchConversations(userId: string) {
  const response = await fetch(`${API_BASE}/api/conversations?user_id=${userId}`);
  const data = await response.json();
  return data.conversations;
}

export async function sendMessage(
  userId: string,
  message: string,
  conversationId: string = "",
  onPartialUpdate?: (partial: string) => void,
  signal?: AbortSignal
): Promise<{ content: string; conversationId: string }> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, user_id: userId, message }),
    signal,
  });

  let botContent = '';
  let finalConversationId = conversationId;
  const decoder = new TextDecoder();
  let buffer = '';

  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Append new chunk to buffer
      buffer += decoder.decode(value, { stream: true });

      // Split the buffer by newline to process each complete line separately.
      const lines = buffer.split('\n');
      // Retain the last partial line in the buffer if it doesn't end with a newline.
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        // Process only lines beginning with "data:"
        if (trimmedLine.startsWith('data:')) {
          const jsonStr = trimmedLine.replace(/^data:\s*/, '');
          try {
            const jsonValue = JSON.parse(jsonStr);
            if (jsonValue.event === 'done') {
              finalConversationId = jsonValue.conversation_id;
            } else if (jsonValue.data) {
              botContent += jsonValue.data;
              if (onPartialUpdate) onPartialUpdate(botContent);
            }
          } catch (e) {
            console.error("Error parsing JSON:", e, "in line:", trimmedLine);
          }
        }
      }
    }
  }
  return { content: botContent, conversationId: finalConversationId };
}

export async function sendFeedback(
  conversationId: string,
  messageId: string,
  sentiment: string
): Promise<void> {
  console.log("Sending feedback:", conversationId, messageId, sentiment);
  try {
    await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: conversationId,
        message_id: messageId,
        sentiment,
      }),
    });
  } catch (error) {
    console.error("Error sending feedback:", error);
  }
}
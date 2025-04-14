const API_BASE = process.env.API_URL;

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
            if (jsonValue.error) {
              console.error("Error streaming chat message:", jsonValue.error);
              // Update UI to let the user know they should try again later.
              botContent = "An error occurred while processing your request. Please try again in a moment.";
              if (onPartialUpdate) onPartialUpdate(botContent);
              // Return early since there is an error.
              return { content: botContent, conversationId: finalConversationId };
            } else if (jsonValue.event === 'done') {
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

// New function for deleting a conversation.
export async function deleteConversation(conversationId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/conversation/${conversationId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete conversation: ${conversationId}`);
  }
}

// Function to fetch starter questions based on the current path.
export async function fetchStarterQuestions(path: string): Promise<{ questions: string[] }> {
  // Ensure the path starts with a '/'
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  const apiUrl = `${API_BASE}/api/starter-questions?path=${encodeURIComponent(formattedPath)}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      // Even though the backend aims for 200, handle potential network/server errors.
      console.error(`HTTP error fetching starter questions: ${response.status}`);
      // Return fallback structure on error to avoid breaking the caller
      return { questions: [] }; // Or potentially default questions if preferred
    }

    const data = await response.json();
    // Basic validation in case the API contract is violated
    if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
       console.error('Invalid response format from starter questions API');
       return { questions: [] }; // Return empty to signal fallback
    }
    return data; // Expected: { questions: ["q1", "q2", "q3"] }
  } catch (error) {
    console.error('Network error fetching starter questions:', error);
    // Return fallback structure on network error
    return { questions: [] }; // Return empty to signal fallback
  }
}
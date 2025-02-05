const API_BASE = 'http://localhost:8000';

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
  onPartialUpdate?: (partial: string) => void
): Promise<string> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, user_id: userId, message }),
  });
  
  let botContent = '';
  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const stringValue = new TextDecoder().decode(value).replace('data: ', '');
      const jsonValue = JSON.parse(stringValue);
      if (jsonValue.data) {
        botContent += jsonValue.data;
        if (onPartialUpdate) onPartialUpdate(botContent);
      }
    }
  }
  return botContent;
}
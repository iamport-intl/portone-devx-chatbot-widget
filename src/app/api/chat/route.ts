// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message, userId } = await request.json();

  console.log('message', message);
  console.log('userId', userId);

  const encoder = new TextEncoder();

  // Create a ReadableStream to simulate a streaming response.
  const stream = new ReadableStream({
    async start(controller) {
      // Simulate chunked responses (replace with real streaming logic)
      const responses = [
        'This is a streamed ',
        'response for your message: ',
        `${message}`,
      ];

      for (const chunk of responses) {
        controller.enqueue(encoder.encode(chunk));
        // Simulate delay between chunks
        await new Promise((res) => setTimeout(res, 500));
      }
      controller.close();
    },
  });

  return new NextResponse(stream);
}

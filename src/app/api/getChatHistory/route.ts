// src/app/api/getChatHistory/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  console.log('userId', userId);

  // For demo purposes, return an empty history.
  // Replace this with your actual data fetching logic.
  return NextResponse.json({ messages: [] });
}

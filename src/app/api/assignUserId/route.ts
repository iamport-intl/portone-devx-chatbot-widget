// src/app/api/assignUserId/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  // Generate a new user id
  const userId = uuidv4();
  return NextResponse.json({ userId });
}

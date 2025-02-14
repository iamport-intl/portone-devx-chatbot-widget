import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import type { NextConfig } from 'next';

// Determine the current environment (default to local)
const currentEnv = process.env.NODE_ENV as any || 'test';
console.log('Current environment:', currentEnv);

// Load env specific files
if (currentEnv === 'production') {
  const envPath = path.resolve(__dirname, `.env.production`);
  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    console.log(`Loaded environment variables from .env.production`);
  }
} else if (currentEnv === 'development') {
  const envPath = path.resolve(__dirname, `.env.development`);
  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    console.log(`Loaded environment variables from .env.development`);
  }
} else {
  const envPath = path.resolve(__dirname, `.env.test`);
  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    console.log(`Loaded environment variables from .env.test`);
  }
}

// Next.js automatically loads .env.production for production builds and .env.development for development.
// In your Next.js config, you can expose only the variables that are safe to expose to the client:
const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
    CDN_BASE_URL: process.env.CDN_BASE_URL,
  },
  /* config options here */
};

export default nextConfig;

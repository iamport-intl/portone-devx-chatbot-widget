const CDN_BASE_URL =
  "https://cdn.jsdelivr.net/gh/hexdecimal16/chat-widget@main/public";

export function getAssetUrl(filename: string): string {
  if (!filename) {
    throw new Error("Asset filename must be provided.");
  }
  return `${CDN_BASE_URL}/${filename}`;
} 
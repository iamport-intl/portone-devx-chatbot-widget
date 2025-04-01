const CDN_BASE_URL = process.env.CDN_BASE_URL;

export function getAssetUrl(filename: string): string {
  if (!filename) {
    throw new Error("Asset filename must be provided.");
  }
  return `${CDN_BASE_URL}/${filename}`;
} 
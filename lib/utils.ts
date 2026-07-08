import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const blobUrlCache = new Map<string, string>();

export async function getOptimizedAvatarUrl(base64: string): Promise<string> {
  if (!base64 || typeof base64 !== 'string' || !base64.startsWith('data:')) return base64;
  
  if (blobUrlCache.has(base64)) {
    return blobUrlCache.get(base64)!;
  }
  
  try {
    const res = await fetch(base64);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    blobUrlCache.set(base64, url);
    return url;
  } catch(e) {
    return base64;
  }
}

'use client';
import { useState, useEffect } from 'react';
import ChatApp from './chat-app';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ChatApp />;
}

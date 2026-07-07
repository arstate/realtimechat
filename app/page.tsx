'use client';

import dynamic from 'next/dynamic';

const ChatApp = dynamic(() => import('./chat-app'), { ssr: false });

export default function HomePage() {
  return <ChatApp />;
}

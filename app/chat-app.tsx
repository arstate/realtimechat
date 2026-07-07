'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  MessageSquare, 
  ShieldAlert, 
  Users, 
  ArrowRight, 
  MessageCircle, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  senderType: 'user' | 'admin';
  username: string;
  message: string;
  timestamp: any;
}

export default function HomePage() {
  const [username, setUsername] = useState<string>('');
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [activeUsersCount, setActiveUsersCount] = useState<number>(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Connection Validation on Boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // 2. Auth State and Saved Username Tracking
  useEffect(() => {
    const savedName = localStorage.getItem('surabaya_chat_username');
    if (savedName) {
      // Intentionally not setting state here to avoid cascading effect
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthReady(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Hydrate username after mount
  useEffect(() => {
    const savedName = localStorage.getItem('surabaya_chat_username');
    if (savedName) {
      setUsername(savedName);
      setIsNameSet(true);
    }
  }, []);

  // 3. Real-time Messages Subscription
  useEffect(() => {
    if (!isAuthReady) return;

    const q = query(
      collection(db, 'global_messages'), 
      orderBy('timestamp', 'asc'), 
      limit(150)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          msgs.push({
            id: doc.id,
            senderType: data.senderType || 'user',
            username: data.username || 'Anonymous',
            message: data.message || '',
            timestamp: data.timestamp,
          });
        });
        setMessages(msgs);
        setIsLoading(false);

        // Derive active users count (unique users who sent messages in the last hour/snapshot)
        const uniqueSenders = new Set(msgs.map(m => m.username));
        setActiveUsersCount(uniqueSenders.size || 1);
      }, 
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'global_messages');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthReady]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    if (trimmedName.length > 30) {
      alert("Nama terlalu panjang (maksimum 30 karakter)");
      return;
    }

    setUsername(trimmedName);
    setIsNameSet(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('surabaya_chat_username', trimmedName);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;

    if (trimmedMessage.length > 1000) {
      alert("Pesan terlalu panjang (maksimum 1000 karakter)");
      return;
    }

    setMessageInput('');

    try {
      await addDoc(collection(db, 'global_messages'), {
        senderType: 'user',
        username: username,
        message: trimmedMessage,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'global_messages');
    }
  };

  const handleExitChat = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari chat?")) {
      setUsername('');
      setIsNameSet(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('surabaya_chat_username');
      }
    }
  };

  // Format message timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Sambil mengirim...';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-6 overflow-hidden">
      {/* Background Radial Glow Layer */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2" />

      <AnimatePresence mode="wait">
        {!isNameSet ? (
          /* NAME MODAL SCREEN */
          <motion.div
            key="login-modal"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-md glass-panel p-8 relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <MessageCircle size={32} className="stroke-[1.75]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Surabaya Community
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Bergabung ke Shared Chat Room
                </p>
              </div>

              <form onSubmit={handleJoinChat} className="w-full space-y-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="name-input" className="text-xs font-semibold uppercase tracking-wider text-gray-400 block ml-1">
                    Nama / Nickname Anda
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                      <User size={18} />
                    </span>
                    <input
                      id="name-input"
                      type="text"
                      required
                      placeholder="Masukkan nama..."
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={30}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-200 group"
                >
                  Masuk ke Obrolan
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </form>

              <div className="pt-2 border-t border-white/5 w-full flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <ShieldAlert size={14} className="text-emerald-500/80" />
                <span>Diproteksi dengan sistem moderasi aktif</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MAIN CHAT SCREEN */
          <motion.div
            key="chat-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl h-[85vh] flex flex-col glass-panel overflow-hidden relative"
          >
            {/* Main Header */}
            <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <MessageSquare size={20} className="stroke-[2]" />
                </div>
                <div>
                  <h2 className="font-bold text-white tracking-wide text-sm md:text-base">
                    Surabaya Community Live Chat
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-indicator inline-block" />
                    <span>{activeUsersCount} Anggota Aktif</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExitChat}
                  title="Keluar dari Obrolan"
                  className="p-2 hover:bg-white/5 text-gray-400 hover:text-red-400 rounded-lg transition-colors duration-200 flex items-center gap-1.5 text-xs"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            </header>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <p className="text-xs text-gray-500 tracking-wider">Memuat pesan real-time...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-2 text-center max-w-xs mx-auto">
                  <MessageCircle size={36} className="text-gray-600 stroke-[1.5]" />
                  <p className="text-sm font-semibold text-gray-400">Belum ada obrolan</p>
                  <p className="text-xs text-gray-500">Mulai kirimkan pesan pertama Anda ke forum Surabaya!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.username === username && msg.senderType === 'user';
                  const isAdminMsg = msg.senderType === 'admin';
                  
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Name Label */}
                      {!isMe && (
                        <span className="text-xs font-semibold text-gray-400 mb-1 ml-1 flex items-center gap-1">
                          {msg.username}
                          {isAdminMsg && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                              ADMIN
                            </span>
                          )}
                        </span>
                      )}
                      
                      {isMe && (
                        <span className="text-[10px] text-gray-500 mb-1 mr-1">
                          Anda
                        </span>
                      )}

                      {/* Chat Bubble */}
                      <div className="max-w-[85%] md:max-w-[75%] relative group">
                        <div
                          className={`px-4 py-2.5 text-sm ${
                            isMe 
                              ? 'bubble-user' 
                              : isAdminMsg 
                                ? 'bg-amber-950/20 text-amber-100 border border-amber-500/20 rounded-xl'
                                : 'bubble-other'
                          }`}
                        >
                          <p className="break-words whitespace-pre-wrap leading-relaxed">
                            {msg.message}
                          </p>
                          <div 
                            className={`text-[9px] mt-1 text-right select-none ${
                              isMe ? 'text-indigo-200' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <footer className="p-4 border-t border-white/10 bg-white/[0.01]">
              <form onSubmit={handleSendMessage} className="flex gap-2.5">
                <input
                  type="text"
                  required
                  maxLength={1000}
                  placeholder={`Menulis sebagai ${username}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl shadow-md transition-all duration-200 flex items-center justify-center shrink-0"
                >
                  <Send size={18} />
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Quick Link */}
      <div className="mt-6 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-400 transition-colors duration-200">
        <Users size={12} />
        <span>Ingin moderasi?</span>
        <Link href="/admin" className="font-semibold text-indigo-400 hover:underline">
          Masuk Halaman Admin &rarr;
        </Link>
      </div>
    </main>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ref, 
  query, 
  orderByChild, 
  limitToLast, 
  onValue, 
  push, 
  remove,
  set,
  get,
  serverTimestamp 
} from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { 
  Trash2, 
  Send, 
  Lock, 
  ShieldCheck, 
  MessageSquare, 
  LogOut, 
  Settings, 
  BarChart3, 
  AlertCircle, 
  Users, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  senderType: 'user' | 'admin';
  username: string;
  message: string;
  timestamp: any;
}

export default function AdminPage() {
  const [password, setPassword] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
  const [adminMessage, setAdminMessage] = useState<string>('');
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>('Admin Support');
  
  // Analytics
  const [userStats, setUserStats] = useState<{ total: number; users: number; admins: number }>({
    total: 0,
    users: 0,
    admins: 0
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Authenticate with firebase auth and verify if session exists
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthReady(true);
        try {
          // Check if active session already exists in Realtime Database
          const sessionRef = ref(db, `admin_sessions/${user.uid}`);
          const docSnap = await get(sessionRef);
          if (docSnap.exists() && docSnap.val().password === 'pemkot2026') {
            setIsAdminLoggedIn(true);
          }
        } catch (e) {
          // Session doesn't exist or is invalid, prompt login
          console.log("No valid admin session found");
        } finally {
          setIsVerifying(false);
        }
      } else {
        setIsVerifying(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-time Messages Listener (Only for logged-in admins)
  useEffect(() => {
    if (!isAdminLoggedIn || !authReady) return;

    const q = query(
      ref(db, 'global_messages'), 
      orderByChild('timestamp'), 
      limitToLast(150)
    );

    const unsubscribe = onValue(
      q, 
      (snapshot) => {
        const msgs: Message[] = [];
        let userCount = new Set<string>();
        let adminMsgsCount = 0;

        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const senderType = data.senderType || 'user';
          const username = data.username || 'Anonymous';
          
          if (senderType === 'admin') {
            adminMsgsCount++;
          } else {
            userCount.add(username);
          }

          msgs.push({
            id: childSnapshot.key as string,
            senderType,
            username,
            message: data.message || '',
            timestamp: data.timestamp,
          });
        });

        setMessages(msgs);
        setUserStats({
          total: msgs.length,
          users: userCount.size,
          admins: adminMsgsCount
        });
        setIsLoadingMessages(false);
      }, 
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'global_messages');
        setIsLoadingMessages(false);
      }
    );

    return () => unsubscribe();
  }, [isAdminLoggedIn, authReady]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Autentikasi sedang diinisialisasi. Silakan tunggu sebentar.");
      return;
    }

    setIsVerifying(true);
    try {
      // Secure write to admin_sessions. It will only succeed if password matches in rules.
      await set(ref(db, `admin_sessions/${auth.currentUser.uid}`), {
        password: password,
        timestamp: serverTimestamp()
      });

      setIsAdminLoggedIn(true);
    } catch (error: any) {
      console.error(error);
      alert("Sandi Moderasi Salah! Hanya admin Surabaya Community yang memiliki akses.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Logout submission
  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
      setIsVerifying(true);
      const user = auth.currentUser;
      if (user) {
        try {
          await remove(ref(db, `admin_sessions/${user.uid}`));
        } catch (e) {
          console.error("Error clearing session:", e);
        }
      }
      setIsAdminLoggedIn(false);
      setPassword('');
      setIsVerifying(false);
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (msgId: string) => {
    if (confirm("Hapus pesan ini dari room publik? Tindakan ini tidak bisa dibatalkan.")) {
      try {
        await remove(ref(db, `global_messages/${msgId}`));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `global_messages/${msgId}`);
      }
    }
  };

  // Send admin message handler
  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = adminMessage.trim();
    if (!trimmedMessage) return;

    if (trimmedMessage.length > 1000) {
      alert("Pesan terlalu panjang (maksimum 1000 karakter)");
      return;
    }

    setAdminMessage('');

    try {
      await push(ref(db, 'global_messages'), {
        senderType: 'admin',
        username: adminName.trim() || 'Admin Support',
        message: trimmedMessage,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'global_messages');
    }
  };

  // Format timestamp helper
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Mengirim...';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="relative z-10 flex flex-col min-h-screen overflow-hidden">
      {/* Background Radial Glow Layer */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="w-full">
        {isVerifying ? (
          /* INITIAL LOADING STATE */
          <div key="loading" className="flex-1 flex flex-col items-center justify-center space-y-4 min-h-screen">
            <div className="w-10 h-10 rounded-full border-3 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <p className="text-sm text-gray-400 tracking-wider font-semibold">Mengamankan koneksi panel...</p>
          </div>
        ) : !isAdminLoggedIn ? (
          /* PASSWORD GATE SCREEN */
          <div key="gate" className="flex-1 flex items-center justify-center p-4 min-h-screen">
            <div
              className="w-full max-w-md glass-panel p-8 relative overflow-hidden transition-all duration-300"
            >
              {/* Gold/Orange decoration bar to symbolize admin protective gate */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-500" />
              
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock size={30} className="stroke-[1.75]" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 justify-center">
                    Admin Gate
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    Silakan masukkan sandi otorisasi moderasi
                  </p>
                </div>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-gray-400 block ml-1">
                      Kata Sandi Admin
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      required
                      placeholder="Masukkan sandi..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all duration-200"
                  >
                    Verifikasi Sandi
                  </button>
                </form>

                <div className="pt-3 border-t border-white/5 w-full flex items-center justify-between text-xs text-gray-500">
                  <Link href="/" className="hover:text-indigo-400 flex items-center gap-1 transition-colors duration-200">
                    <ArrowLeft size={14} /> Kembali ke Chat Room
                  </Link>
                  <span>Masa Berlaku: 2026</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* HIGHLY GRAPHICAL ADMIN SPLIT LAYOUT PANEL */
          <div
            key="dashboard"
            className="flex-1 flex flex-col md:flex-row h-screen transition-all duration-300"
          >
            {/* COLUMN 1: LEFT SIDEBAR (CONTROL & STATISTICS PANEL) */}
            <aside className="w-full md:w-[320px] bg-slate-950/85 border-b md:border-b-0 md:border-r border-white/10 flex flex-col h-[280px] md:h-screen shrink-0">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-amber-500" />
                  <span className="font-bold tracking-wider text-sm uppercase text-amber-500">Surabaya Mod</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Keluar Admin"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors duration-200"
                >
                  <LogOut size={16} />
                </button>
              </div>

              {/* Live Room Info and Mini Dashboard Controls */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-indigo-400" /> Statistik Room
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-left">
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Total Chat</span>
                      <span className="text-xl font-bold text-white mt-1 block">{userStats.total}</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-left">
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Pengguna</span>
                      <span className="text-xl font-bold text-emerald-400 mt-1 block">{userStats.users}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Settings size={14} className="text-indigo-400" /> Konfigurasi Admin
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-semibold block">Nama Display Admin</span>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        maxLength={30}
                        placeholder="Nama Display Admin"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors duration-150"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-bold block text-amber-300 mb-0.5">Mode Moderasi Aktif</span>
                    Setiap pesan yang dikirim oleh user akan terdaftar di panel kanan. Anda memiliki hak penuh untuk menghapus pesan yang melanggar ketentuan.
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-white/10 text-center text-[10px] text-gray-600 bg-white/[0.005]">
                <Link href="/" className="font-semibold text-indigo-400 hover:underline inline-flex items-center gap-1">
                  Kembali ke Chat Publik &rarr;
                </Link>
              </div>
            </aside>

            {/* COLUMN 2: RIGHT CHAT AREA (MODERATION CHAT WINDOW) */}
            <section className="flex-1 flex flex-col h-[calc(100vh-280px)] md:h-screen bg-slate-950/20">
              {/* Chat Area Header */}
              <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-bold text-white tracking-wide text-sm md:text-base">
                        Shared Live Chat Room
                      </h2>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                        Moderator View
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Memantau dan menghapus pesan melanggar secara instan
                    </p>
                  </div>
                </div>
              </header>

              {/* Live Chat Messages list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoadingMessages ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                    <p className="text-xs text-gray-500 tracking-wider">Membuka stream pesan...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-2 text-center max-w-xs mx-auto">
                    <MessageSquare size={36} className="text-gray-600 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-gray-400">Belum ada obrolan</p>
                    <p className="text-xs text-gray-500">Room sedang kosong.</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isAdminMsg = msg.senderType === 'admin';
                    
                    return (
                      <div
                        key={msg.id || index}
                        className="flex flex-col items-start"
                      >
                        {/* Name Label */}
                        <div className="flex items-center gap-2 mb-1 ml-1 text-xs font-semibold text-gray-400">
                          <span>{msg.username}</span>
                          {isAdminMsg && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                              ADMIN
                            </span>
                          )}
                          <span className="text-[10px] text-gray-500 font-normal">
                            ({formatTime(msg.timestamp)})
                          </span>
                        </div>

                        {/* Chat Bubble with trash icon next to it */}
                        <div className="flex items-center gap-3 max-w-[85%] md:max-w-[75%] group w-full">
                          <div
                            className={`px-4 py-2.5 text-sm flex-1 ${
                              isAdminMsg 
                                ? 'bg-amber-950/20 text-amber-100 border border-amber-500/20 rounded-xl'
                                : 'bubble-other'
                            }`}
                          >
                            <p className="break-words whitespace-pre-wrap leading-relaxed">
                              {msg.message}
                            </p>
                          </div>

                          {/* Quick Moderator Actions */}
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Hapus Pesan"
                            className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-500/20 hover:border-red-500 text-red-400 rounded-lg transition-all duration-200 shadow-sm opacity-80 hover:opacity-100 shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Admin Input Form footer */}
              <footer className="p-4 border-t border-white/10 bg-white/[0.01]">
                <form onSubmit={handleSendAdminMessage} className="flex gap-2.5">
                  <input
                    type="text"
                    required
                    maxLength={1000}
                    placeholder={`Kirim pengumuman resmi sebagai ${adminName}...`}
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={!adminMessage.trim()}
                    className="p-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50 disabled:hover:bg-amber-600 text-white rounded-xl shadow-md transition-all duration-200 flex items-center justify-center shrink-0"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </footer>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

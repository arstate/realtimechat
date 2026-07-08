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
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { getOptimizedAvatarUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Send, 
  Lock, 
  ShieldCheck, 
  ShieldAlert,
  MessageSquare, 
  LogOut, 
  Settings, 
  Tv,
  BarChart3, 
  AlertCircle, 
  Users, 
  ChevronRight,
  ArrowLeft,
  Smile,
  Cat,
  Dog,
  Bird,
  Rabbit,
  Ghost,
  Bot,
  User,
  Sun,
  Moon
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  senderType: 'user' | 'admin';
  username: string;
  message: string;
  timestamp: any;
  avatar?: string;
  color?: string;
}

const AVATARS = [
  { id: 'smile', icon: Smile },
  { id: 'cat', icon: Cat },
  { id: 'dog', icon: Dog },
  { id: 'bird', icon: Bird },
  { id: 'rabbit', icon: Rabbit },
  { id: 'bot', icon: Bot },
  { id: 'ghost', icon: Ghost },
  { id: 'user', icon: User }
];

const COLOR_THEMES = [
  // Indigo / Purple
  {
    light: {
      bg: 'bg-indigo-50/90 border-indigo-200 hover:bg-indigo-100/90 shadow-indigo-100/30',
      borderLeft: '#4f46e5',
      userText: 'text-indigo-900',
      msgText: 'text-indigo-950 font-bold',
      badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      timeText: 'text-indigo-600/70',
    },
    dark: {
      bg: 'bg-indigo-950/40 border-indigo-500/30 hover:bg-indigo-950/50 hover:border-indigo-500/50 shadow-indigo-950/40',
      borderLeft: '#6366f1',
      userText: 'text-indigo-300',
      msgText: 'text-indigo-100',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      timeText: 'text-indigo-400/60',
    }
  },
  // Emerald / Green
  {
    light: {
      bg: 'bg-emerald-50/90 border-emerald-200 hover:bg-emerald-100/90 shadow-emerald-100/30',
      borderLeft: '#059669',
      userText: 'text-emerald-900',
      msgText: 'text-emerald-950 font-bold',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      timeText: 'text-emerald-600/70',
    },
    dark: {
      bg: 'bg-emerald-950/40 border-emerald-500/30 hover:bg-emerald-950/50 hover:border-emerald-500/50 shadow-emerald-950/40',
      borderLeft: '#10b981',
      userText: 'text-emerald-300',
      msgText: 'text-emerald-100',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      timeText: 'text-emerald-400/60',
    }
  },
  // Rose / Pink
  {
    light: {
      bg: 'bg-rose-50/90 border-rose-200 hover:bg-rose-100/90 shadow-rose-100/30',
      borderLeft: '#db2777',
      userText: 'text-rose-900',
      msgText: 'text-rose-950 font-bold',
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      timeText: 'text-rose-600/70',
    },
    dark: {
      bg: 'bg-rose-950/40 border-rose-500/30 hover:bg-rose-950/50 hover:border-rose-500/50 shadow-rose-950/40',
      borderLeft: '#f43f5e',
      userText: 'text-rose-300',
      msgText: 'text-rose-100',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      timeText: 'text-rose-400/60',
    }
  },
  // Cyan / Teal
  {
    light: {
      bg: 'bg-cyan-50/90 border-cyan-200 hover:bg-cyan-100/90 shadow-cyan-100/30',
      borderLeft: '#0891b2',
      userText: 'text-cyan-900',
      msgText: 'text-cyan-950 font-bold',
      badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      timeText: 'text-cyan-600/70',
    },
    dark: {
      bg: 'bg-cyan-950/40 border-cyan-500/30 hover:bg-cyan-950/50 hover:border-cyan-500/50 shadow-cyan-950/40',
      borderLeft: '#06b6d4',
      userText: 'text-cyan-300',
      msgText: 'text-cyan-100',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      timeText: 'text-cyan-400/60',
    }
  },
  // Amber / Orange
  {
    light: {
      bg: 'bg-amber-50/90 border-amber-200 hover:bg-amber-100/90 shadow-amber-100/30',
      borderLeft: '#d97706',
      userText: 'text-amber-900',
      msgText: 'text-amber-950 font-bold',
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      timeText: 'text-amber-600/70',
    },
    dark: {
      bg: 'bg-amber-950/45 border-amber-500/30 hover:bg-amber-950/55 hover:border-amber-500/50 shadow-amber-950/40',
      borderLeft: '#f59e0b',
      userText: 'text-amber-300',
      msgText: 'text-amber-100',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      timeText: 'text-amber-400/60',
    }
  },
  // Violet / Fuchsia
  {
    light: {
      bg: 'bg-violet-50/90 border-violet-200 hover:bg-violet-100/90 shadow-violet-100/30',
      borderLeft: '#7c3aed',
      userText: 'text-violet-900',
      msgText: 'text-violet-950 font-bold',
      badge: 'bg-violet-100 text-violet-700 border-violet-200',
      timeText: 'text-violet-600/70',
    },
    dark: {
      bg: 'bg-violet-950/40 border-violet-500/30 hover:bg-violet-950/50 hover:border-violet-500/50 shadow-violet-950/40',
      borderLeft: '#8b5cf6',
      userText: 'text-violet-300',
      msgText: 'text-violet-100',
      badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      timeText: 'text-violet-400/60',
    }
  },
  // Blue / Sky
  {
    light: {
      bg: 'bg-blue-50/90 border-blue-200 hover:bg-blue-100/90 shadow-blue-100/30',
      borderLeft: '#2563eb',
      userText: 'text-blue-900',
      msgText: 'text-blue-950 font-bold',
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      timeText: 'text-blue-600/70',
    },
    dark: {
      bg: 'bg-blue-950/40 border-blue-500/30 hover:bg-blue-950/50 hover:border-blue-500/50 shadow-blue-950/40',
      borderLeft: '#3b82f6',
      userText: 'text-blue-300',
      msgText: 'text-blue-100',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      timeText: 'text-blue-400/60',
    }
  }
];

const getThemeForMsg = (msg: Message, isLight: boolean) => {
  const isAdminMsg = msg.senderType === 'admin';
  
  if (isAdminMsg) {
    // Elegant Moderator theme (Amber / Gold Accent)
    return {
      bg: isLight 
        ? 'bg-amber-50/95 border-amber-300 hover:bg-amber-100 shadow-amber-100/40' 
        : 'bg-amber-950/30 border-amber-500/40 hover:bg-amber-950/40 hover:border-amber-500/60 shadow-amber-950/30',
      borderLeft: '#f59e0b',
      userText: isLight ? 'text-amber-900 font-extrabold' : 'text-amber-400 font-extrabold',
      msgText: isLight ? 'text-amber-950 font-black' : 'text-amber-100 font-bold',
      badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
      timeText: isLight ? 'text-amber-700/60' : 'text-amber-400/60',
    };
  }

  // Choose index based on color, or fall back to username hash
  const color = msg.color || '';
  let themeIdx = 0;
  if (color.includes('blue') || color.includes('sky')) themeIdx = 6;
  else if (color.includes('emerald') || color.includes('green')) themeIdx = 1;
  else if (color.includes('teal') || color.includes('cyan')) themeIdx = 3;
  else if (color.includes('rose') || color.includes('pink') || color.includes('fuchsia')) themeIdx = 2;
  else if (color.includes('orange') || color.includes('amber')) themeIdx = 4;
  else if (color.includes('violet') || color.includes('purple')) themeIdx = 5;
  else if (color.includes('indigo')) themeIdx = 0;
  else {
    let hash = 0;
    const str = msg.username || '';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    themeIdx = Math.abs(hash) % COLOR_THEMES.length;
  }

  const theme = COLOR_THEMES[themeIdx];
  return isLight ? theme.light : theme.dark;
};

export default function AdminPage() {
  const [password, setPassword] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
  const [adminMessage, setAdminMessage] = useState<string>('');
  const [adminName, setAdminName] = useState<string>('Admin Support');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState<boolean>(false);
  const [showDeleteAvatarConfirm, setShowDeleteAvatarConfirm] = useState<string | null>(null);
  const [showVideotronPreview, setShowVideotronPreview] = useState<boolean>(false);
  const [videotronTheme, setVideotronTheme] = useState<'dark' | 'light'>('dark');
  const videotronEndRef = useRef<HTMLDivElement>(null);
  const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(true);
  const [isChatEnabled, setIsChatEnabled] = useState<boolean>(true);
  const [chatTitle, setChatTitle] = useState<string>('Surabaya Community Live Chat');
  const [chatIcon, setChatIcon] = useState<string>('');
    const [draftTitle, setDraftTitle] = useState<string>('Surabaya Community Live Chat');
  const [adminView, setAdminView] = useState<'chat' | 'avatars'>('chat');
  const [userAvatars, setUserAvatars] = useState<{id: string, url: string}[]>([]);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const [isAssetDownloading, setIsAssetDownloading] = useState<boolean>(true);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<string>('Menyiapkan koneksi aman...');
  
  // Analytics
  const [userStats, setUserStats] = useState<{ total: number; users: number; admins: number }>({
    total: 0,
    users: 0,
    admins: 0
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Asset pre-loading and caching effect
  useEffect(() => {
    let isMounted = true;
    
    async function loadAssets() {
      if (typeof window === 'undefined') return;
      
      // Fire DB requests immediately so they resolve in the background while UI animates
      const dbSettingsPromise = Promise.all([
        get(ref(db, 'chat_enabled')),
        get(ref(db, 'chat_filter_enabled'))
      ]).catch(e => {
        console.error("DB error in background fetch:", e);
        return [null, null];
      });
      
      const cachedTitle = localStorage.getItem('surabaya_cached_chat_title');
      const cachedIcon = localStorage.getItem('surabaya_cached_chat_icon');
      const cachedAvatars = localStorage.getItem('surabaya_cached_user_avatars');
      const cachedChatEnabled = localStorage.getItem('surabaya_cached_chat_enabled');
      const cachedFilterEnabled = localStorage.getItem('surabaya_cached_chat_filter_enabled');
      
      if (cachedChatEnabled !== null) setIsChatEnabled(cachedChatEnabled === 'true');
      if (cachedFilterEnabled !== null) setIsFilterEnabled(cachedFilterEnabled === 'true');

      const hasCache = cachedTitle && cachedIcon && cachedAvatars;
      
      if (hasCache) {
        // Hydrate from cache immediately for instant UI responsiveness
        setChatTitle(cachedTitle);
        setDraftTitle(cachedTitle);
        try {
          const optimizedIcon = await getOptimizedAvatarUrl(cachedIcon);
          setChatIcon(optimizedIcon);
        } catch (e) {
          setChatIcon(cachedIcon);
        }
        
        try {
          const parsedAvatars = JSON.parse(cachedAvatars);
          const keys = Object.keys(parsedAvatars);
          const avatarsArr = await Promise.all(
            keys.map(async k => ({
              id: k,
              url: await getOptimizedAvatarUrl(parsedAvatars[k])
            }))
          );
          setUserAvatars(avatarsArr);
        } catch (e) {
          console.error('Error loading avatars from cache', e);
        }

        // Beautiful swift loading animation for returning cached users
        const statuses = [
          { text: 'Membaca konfigurasi dari cache lokal...', progress: 25 },
          { text: 'Memverifikasi integritas aset gambar...', progress: 50 },
          { text: 'Mengunduh pengaturan sensor & ruang obrolan...', progress: 85 },
          { text: 'Selesai!', progress: 100 }
        ];

        let currentProgress = 0;
        for (const step of statuses) {
          if (!isMounted) return;
          setDownloadStatus(step.text);
          
          if (step.progress === 85) {
            const [chatEnabledSnap, filterEnabledSnap] = await dbSettingsPromise;
            if (chatEnabledSnap) setIsChatEnabled(chatEnabledSnap.val() !== false);
            if (filterEnabledSnap) setIsFilterEnabled(filterEnabledSnap.val() !== false);
          }
          
          await new Promise<void>((resolve) => {
            const target = step.progress;
            const interval = setInterval(() => {
              if (currentProgress >= target) {
                clearInterval(interval);
                resolve();
              } else {
                currentProgress += 10;
                setDownloadProgress(Math.min(currentProgress, target));
              }
            }, 2);
          });
          await new Promise(r => setTimeout(r, 10));
        }
        
        if (isMounted) {
          setIsAssetDownloading(false);
        }
      } else {
        // First-time visit: fetch assets from server and save to cache
        const statuses = [
          { text: 'Menghubungkan ke server Surabaya...', progress: 15 },
          { text: 'Mengunduh konfigurasi ruang obrolan...', progress: 35 },
          { text: 'Memproses & mengompresi gambar ikon...', progress: 55 },
          { text: 'Mengunduh & mengoptimalkan kustom avatar...', progress: 75 },
          { text: 'Sinkronisasi filter obrolan & izin akses...', progress: 95 },
          { text: 'Menyimpan aset ke cache lokal...', progress: 100 }
        ];

        setDownloadStatus(statuses[0].text);
        setDownloadProgress(5);
        
        try {
          // Parallelize all network requests to the database
          const configPromise = get(ref(db, 'chat_config'));
          const [chatEnabledSnap, filterEnabledSnap] = await dbSettingsPromise;
          
          if (chatEnabledSnap) setIsChatEnabled(chatEnabledSnap.val() !== false);
          if (filterEnabledSnap) setIsFilterEnabled(filterEnabledSnap.val() !== false);

          setDownloadStatus(statuses[1].text);
          setDownloadProgress(25);
          await new Promise(r => setTimeout(r, 10));

          const configSnapshot = await configPromise;
          const val = configSnapshot.val();
          if (val) {
            if (val.title) {
              setChatTitle(val.title);
              setDraftTitle(val.title);
              localStorage.setItem('surabaya_cached_chat_title', val.title);
            }
            setDownloadProgress(35);
            await new Promise(r => setTimeout(r, 10));

            setDownloadStatus(statuses[2].text);
            if (val.icon) {
              const optimizedIcon = await getOptimizedAvatarUrl(val.icon);
              setChatIcon(optimizedIcon);
              localStorage.setItem('surabaya_cached_chat_icon', val.icon);
            }
            setDownloadProgress(55);
            await new Promise(r => setTimeout(r, 10));

            setDownloadStatus(statuses[3].text);
            if (val.userAvatars) {
              const keys = Object.keys(val.userAvatars);
              const avatarsArr = await Promise.all(
                keys.map(async k => ({
                  id: k,
                  url: await getOptimizedAvatarUrl(val.userAvatars[k])
                }))
              );
              setUserAvatars(avatarsArr);
              localStorage.setItem('surabaya_cached_user_avatars', JSON.stringify(val.userAvatars));
            } else {
              setUserAvatars([]);
            }
            setDownloadProgress(75);
            await new Promise(r => setTimeout(r, 10));
          } else {
            setChatTitle('Surabaya Community Live Chat');
            setDraftTitle('Surabaya Community Live Chat');
            setDownloadProgress(75);
          }
        } catch (e) {
          console.error("Error downloading from DB:", e);
        }
        
        setDownloadStatus(statuses[4].text);
        setDownloadProgress(95);
        await new Promise(r => setTimeout(r, 10));
        
        setDownloadStatus(statuses[5].text);
        setDownloadProgress(100);
        await new Promise(r => setTimeout(r, 20));
        
        if (isMounted) {
          setIsAssetDownloading(false);
        }
      }
    }

    loadAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Check local storage for admin session
  useEffect(() => {
    const adminSession = localStorage.getItem('surabaya_admin_session');
    if (adminSession === 'pemkot2026') {
      setIsAdminLoggedIn(true);
    }
    setIsVerifying(false);
  }, []);

  // 2. Real-time Messages Listener (Only for logged-in admins)
  useEffect(() => {
    if (!isAdminLoggedIn) return;

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
            avatar: data.avatar,
            color: data.color,
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
  }, [isAdminLoggedIn]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    videotronEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showVideotronPreview]);

  // 3. Real-time Chat & Filter Enabled State Subscription
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const filterRef = ref(db, 'chat_filter_enabled');
    const unsubscribeFilter = onValue(filterRef, (snapshot) => {
      const val = snapshot.val();
      const isEnabled = val !== false;
      setIsFilterEnabled(isEnabled); // default to true if null/undefined
      localStorage.setItem('surabaya_cached_chat_filter_enabled', isEnabled.toString());
    });

     const configRef = ref(db, 'chat_config');
     const unsubscribeConfig = onValue(configRef, async (snapshot) => {
       const val = snapshot.val();
       if (val) {
         if (val.title) {
           setChatTitle(val.title);
           setDraftTitle(val.title);
           localStorage.setItem('surabaya_cached_chat_title', val.title);
         }
         if (val.icon) {
           const optimizedIcon = await getOptimizedAvatarUrl(val.icon);
           setChatIcon(optimizedIcon);
           localStorage.setItem('surabaya_cached_chat_icon', val.icon);
         }
         if (val.userAvatars) {
           const keys = Object.keys(val.userAvatars);
           const avatarsArr = await Promise.all(
             keys.map(async k => ({
               id: k,
               url: await getOptimizedAvatarUrl(val.userAvatars[k])
             }))
           );
           setUserAvatars(avatarsArr);
           localStorage.setItem('surabaya_cached_user_avatars', JSON.stringify(val.userAvatars));
         } else {
           setUserAvatars([]);
           localStorage.removeItem('surabaya_cached_user_avatars');
         }
       } else {
         setUserAvatars([]);
         localStorage.removeItem('surabaya_cached_user_avatars');
       }
     });

    const chatEnabledRef = ref(db, 'chat_enabled');
    const unsubscribeChatEnabled = onValue(chatEnabledRef, (snapshot) => {
      const val = snapshot.val();
      const isEnabled = val !== false;
      setIsChatEnabled(isEnabled); // default to true if null/undefined
      localStorage.setItem('surabaya_cached_chat_enabled', isEnabled.toString());
    });

    return () => {
      unsubscribeFilter();
      unsubscribeChatEnabled();
      unsubscribeConfig();
    };
  }, [isAdminLoggedIn]);

  // Toggle filter handler
  const toggleFilter = async () => {
    const newValue = !isFilterEnabled;
    setIsFilterEnabled(newValue);
    try {
      await set(ref(db, 'chat_filter_enabled'), newValue);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'chat_filter_enabled');
    }
  };

  // Toggle chat enabled handler
  const toggleChatEnabled = async () => {
    const newValue = !isChatEnabled;
    setIsChatEnabled(newValue);
    try {
      await set(ref(db, 'chat_enabled'), newValue);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'chat_enabled');
    }
  };

  // Update Chat Config
  const handleUpdateTitle = async () => {
    try {
      await set(ref(db, 'chat_config/title'), draftTitle);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'chat_config/title');
    }
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Tolong unggah file gambar (PNG/JPG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar terlalu besar. Maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      try {
        await set(ref(db, 'chat_config/icon'), base64String);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, 'chat_config/icon');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUserAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Tolong unggah file gambar (PNG/JPG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar terlalu besar. Maksimal 2MB.');
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 512;
        const MAX_HEIGHT = 512;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/png');
        
        try {
          const newAvatarRef = push(ref(db, 'chat_config/userAvatars'));
          await set(newAvatarRef, compressedBase64);
        } catch (error) {
          console.error('Error uploading:', error);
          alert('Gagal mengupload avatar.');
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (e) => {
      console.error('FileReader error:', e);
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  
  const handleDeleteUserAvatar = (id: string) => {
    setShowDeleteAvatarConfirm(id);
  };

  const confirmDeleteAvatar = async () => {
    if (showDeleteAvatarConfirm) {
      const id = showDeleteAvatarConfirm;
      setShowDeleteAvatarConfirm(null);
      try {
        await set(ref(db, `chat_config/userAvatars/${id}`), null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const cancelDeleteAvatar = () => {
    setShowDeleteAvatarConfirm(null);
  };

  // Handle Login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsVerifying(true);
    if (password === 'pemkot2026') {
      localStorage.setItem('surabaya_admin_session', password);
      setIsAdminLoggedIn(true);
    } else {
      alert("Sandi Moderasi Salah! Hanya admin Surabaya Community yang memiliki akses.");
    }
    setIsVerifying(false);
  };

  // Handle Logout submission
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setIsVerifying(true);
    localStorage.removeItem('surabaya_admin_session');
    setIsAdminLoggedIn(false);
    setPassword('');
    setShowLogoutConfirm(false);
    setIsVerifying(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Delete message handler
  const handleDeleteMessage = (msgId: string) => {
    setShowDeleteConfirm(msgId);
  };

  const confirmDeleteMessage = async () => {
    if (showDeleteConfirm) {
      const msgId = showDeleteConfirm;
      setShowDeleteConfirm(null);
      try {
        await remove(ref(db, `global_messages/${msgId}`));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `global_messages/${msgId}`);
      }
    }
  };

  const cancelDeleteMessage = () => {
    setShowDeleteConfirm(null);
  };

  // Delete all messages handlers
  const handleDeleteAllMessages = () => {
    setShowDeleteAllConfirm(true);
  };

  const confirmDeleteAllMessages = async () => {
    setShowDeleteAllConfirm(false);
    try {
      await remove(ref(db, 'global_messages'));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'global_messages');
    }
  };

  const cancelDeleteAllMessages = () => {
    setShowDeleteAllConfirm(false);
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
      {/* Downloading Data Loader Overlay */}
      <AnimatePresence>
        {isAssetDownloading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white font-sans overflow-hidden"
          >
            {/* Background neon grid pattern */}
            <div className="absolute inset-0 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center space-y-6">
              {/* Animated Icon Container */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10 relative"
              >
                <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400/20 animate-ping opacity-30" />
                <Settings size={28} className="stroke-[1.75]" />
              </motion.div>

              {/* Text Title */}
              <div className="text-center space-y-1.5">
                <h2 className="text-lg font-black tracking-widest text-indigo-300 uppercase">
                  SURABAYA PANEL
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Sinkronisasi Aset & Konfigurasi...
                </p>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full space-y-2">
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono font-semibold tracking-wider text-slate-500">
                  <span className="animate-pulse">{downloadStatus}</span>
                  <span className="text-indigo-400">{downloadProgress}%</span>
                </div>
              </div>

              {/* Footer info */}
              <div className="text-[10px] font-medium text-slate-600 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Keamanan aset terverifikasi & dicache lokal</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Radial Glow Layer */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="w-full">
        {isVerifying ? (
          /* INITIAL LOADING STATE */
          <div key="loading" className="flex-1 flex flex-col items-center justify-center space-y-4 min-h-screen">
            <div className="w-10 h-10 rounded-full border-3 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <p className="text-sm text-gray-600 tracking-wider font-semibold">Mengamankan koneksi panel...</p>
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
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-1.5 justify-center">
                    Admin Gate
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Silakan masukkan sandi otorisasi moderasi
                  </p>
                </div>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-gray-600 block ml-1">
                      Kata Sandi Admin
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      required
                      placeholder="Masukkan sandi..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all duration-200"
                  >
                    Verifikasi Sandi
                  </button>
                </form>

                <div className="pt-3 border-t border-gray-200 w-full flex items-center justify-between text-xs text-gray-500">
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
            <aside className="w-full md:w-[320px] bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col h-[280px] md:h-screen shrink-0">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-amber-500" />
                  <span className="font-bold tracking-wider text-sm uppercase text-amber-500">Surabaya Mod</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Keluar Admin"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors duration-200"
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
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-left">
                      <span className="text-[10px] text-gray-500 block font-semibold uppercase">Total Chat</span>
                      <span className="text-xl font-bold text-gray-900 mt-1 block">{userStats.total}</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-left">
                      <span className="text-[10px] text-gray-500 block font-semibold uppercase">Pengguna</span>
                      <span className="text-xl font-bold text-emerald-600 mt-1 block">{userStats.users}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Settings size={14} className="text-indigo-400" /> Konfigurasi Admin
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-semibold block">Nama Display Admin</span>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        maxLength={30}
                        placeholder="Nama Display Admin"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors duration-150"
                      />
                    </div>

                    
                    
                    {/* Chat Title Edit */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-semibold block">Teks UI Live Chat</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          maxLength={50}
                          placeholder="Surabaya Community Live Chat"
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors duration-150"
                        />
                        <button
                          onClick={handleUpdateTitle}
                          disabled={draftTitle.trim() === '' || draftTitle === chatTitle}
                          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-300 text-white rounded-lg text-xs font-semibold transition-colors duration-200"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>

                    {/* Chat Icon Upload */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-500 font-semibold block">Icon Custom (PNG/JPG)</span>
                      <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                          {chatIcon ? (
                            <img src={chatIcon} alt="Chat Icon" className="w-full h-full object-cover" />
                          ) : (
                            <MessageSquare size={16} className="text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={handleIconUpload}
                          className="text-[10px] text-gray-600 w-full file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                    </div>

                    
                    
                    {/* Navigation Views */}
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                      <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">Navigasi Admin</span>
                      <button
                        onClick={() => setAdminView('chat')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                          adminView === 'chat' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <MessageSquare size={16} />
                        Buka Live Chat
                      </button>
                      <button
                        onClick={() => setAdminView('avatars')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                          adminView === 'avatars' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Users size={16} />
                        Kelola Avatar User
                      </button>
                    </div>
                    {/* Chat Enabled Toggle Switch */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-gray-800">Obrolan Pengguna</span>
                        <span className="text-[10px] text-gray-500 leading-tight">Izinkan user mengirim pesan</span>
                      </div>
                      <button
                        onClick={toggleChatEnabled}
                        type="button"
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isChatEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isChatEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Filter Chat Toggle Switch */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-gray-800">Filter Chat Aktif</span>
                        <span className="text-[10px] text-gray-500 leading-tight">Sensor kata kasar otomatis</span>
                      </div>
                      <button
                        onClick={toggleFilter}
                        type="button"
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isFilterEnabled ? 'bg-amber-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isFilterEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setShowVideotronPreview(true)}
                        className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 text-indigo-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        <Tv size={14} />
                        Preview Videotron
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`border rounded-xl p-4 flex items-start gap-3 transition-colors duration-200 ${
                  isFilterEnabled 
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                    : 'bg-rose-50/70 border-rose-200 text-rose-900'
                }`}>
                  {isFilterEnabled ? (
                    <>
                      <ShieldCheck size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed text-left">
                        <span className="font-bold block text-amber-700 mb-0.5">Filter Chat Aktif</span>
                        Setiap pesan kotor/makian yang dikirim oleh pengguna akan disaring dan disensor secara otomatis demi keamanan forum publik.
                      </div>
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={18} className="text-rose-500 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed text-left">
                        <span className="font-bold block text-rose-700 mb-0.5">Filter Chat Nonaktif</span>
                        Sensor otomatis dimatikan! Semua pesan kasar akan lolos apa adanya tanpa disaring. Harap pantau obrolan secara manual!
                      </div>
                    </>
                  )}
                </div>

                {/* DANGER ZONE - DELETE ALL CHATS */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3 flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-red-400" /> Area Bahaya
                  </h3>
                  <button
                    onClick={handleDeleteAllMessages}
                    className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 active:bg-red-200 border border-red-200 text-red-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer font-bold"
                  >
                    <Trash2 size={14} />
                    Hapus Semua Chat
                  </button>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200 text-center text-[10px] text-gray-500 bg-gray-50">
                <Link href="/" className="font-semibold text-indigo-400 hover:underline inline-flex items-center gap-1">
                  Kembali ke Chat Publik &rarr;
                </Link>
              </div>
            </aside>

            {/* COLUMN 2: RIGHT CHAT AREA (MODERATION CHAT WINDOW) */}
            {adminView === 'avatars' ? (
              <section className="flex-1 flex flex-col h-[calc(100vh-280px)] md:h-screen bg-gray-50/50 overflow-y-auto">
                <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
                      <Users size={18} />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 tracking-wide text-sm md:text-base">
                        Kelola Avatar User
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Tambahkan opsi avatar untuk dipilih pengguna saat masuk.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleUserAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <button 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition-colors pointer-events-none"
                    >
                      {isUploadingAvatar ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      ) : (
                        <Users size={16} />
                      )}
                      Upload Avatar Baru
                    </button>
                  </div>
                </header>
                
                <div className="p-6">
                  {userAvatars.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                      <Users size={32} className="mx-auto text-gray-400 mb-3" />
                      <h3 className="text-sm font-semibold text-gray-900">Belum ada avatar</h3>
                      <p className="text-xs text-gray-500 mt-1">Upload avatar berformat PNG/JPG (Maks 2MB).</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                      {userAvatars.map(avatar => (
                        <div key={avatar.id} className="relative group bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center aspect-square shadow-sm">
                          <img src={avatar.url} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                          <button
                            onClick={() => handleDeleteUserAvatar(avatar.id)}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                            title="Hapus avatar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="flex-1 flex flex-col h-[calc(100vh-280px)] md:h-screen bg-gray-50/50">
              {/* Chat Area Header */}
              <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-bold text-gray-900 tracking-wide text-sm md:text-base">
                        Shared Live Chat Room
                      </h2>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-red-100 text-red-600 border border-red-200 uppercase tracking-wider">
                        Moderator View
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
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
                        <div className="flex items-center gap-2 mb-1 ml-1 text-xs font-semibold text-gray-600">
                          <span>{msg.username}</span>
                          {isAdminMsg && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-700 border border-amber-300 uppercase tracking-wider">
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
                                ? 'bg-amber-100 text-amber-900 border border-amber-200 rounded-xl'
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
                            className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 rounded-lg transition-all duration-200 shadow-sm shrink-0"
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
              <footer className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendAdminMessage} className="flex gap-2.5">
                  <input
                    type="text"
                    required
                    maxLength={1000}
                    placeholder={`Kirim pengumuman resmi sebagai ${adminName}...`}
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
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
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -15 }}
              className="w-full max-w-sm bg-white p-6 rounded-2xl relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-xl border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                <LogOut size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Keluar Panel Admin?</h3>
                <p className="text-sm text-gray-500 mt-1">Sesi moderasi Anda akan diakhiri. Apakah Anda yakin?</p>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={cancelLogout}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md shadow-red-600/20 transition-colors text-sm"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -15 }}
              className="w-full max-w-sm bg-white p-6 rounded-2xl relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-xl border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Hapus Pesan?</h3>
                <p className="text-sm text-gray-500 mt-1">Hapus pesan ini dari room publik? Tindakan ini tidak bisa dibatalkan.</p>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={cancelDeleteMessage}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteMessage}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md shadow-red-600/20 transition-colors text-sm"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteAllConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -15 }}
              className="w-full max-w-sm bg-white p-6 rounded-2xl relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-xl border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2 animate-bounce">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 text-red-600">Hapus Semua Chat?</h3>
                <p className="text-sm text-gray-500 mt-1">Tindakan ini akan menghapus **seluruh** riwayat pesan obrolan secara permanen dari server. Tindakan ini tidak dapat dibatalkan!</p>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={cancelDeleteAllMessages}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteAllMessages}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md shadow-red-600/20 transition-colors text-sm cursor-pointer animate-pulse font-bold"
                >
                  Ya, Hapus Semua
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteAvatarConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -15 }}
              className="w-full max-w-sm bg-white p-6 rounded-2xl relative overflow-hidden flex flex-col items-center text-center space-y-4 shadow-xl border border-gray-200"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Hapus Avatar Ini?</h3>
                <p className="text-sm text-gray-500 mt-1">Avatar ini tidak akan bisa dipilih lagi oleh pengguna baru. Apakah Anda yakin?</p>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={cancelDeleteAvatar}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteAvatar}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md shadow-red-600/20 transition-colors text-sm cursor-pointer font-bold"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      
        {showVideotronPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden min-h-screen transition-colors duration-300 ${
              videotronTheme === 'light' ? 'bg-slate-50' : 'bg-slate-950'
            }`}
          >
            {/* Cyber Grid Background */}
            <div className={`absolute inset-0 bg-[size:4rem_4rem] pointer-events-none transition-all duration-300 ${
              videotronTheme === 'light'
                ? 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#fff_70%,transparent_100%)] opacity-70'
                : 'bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40'
            }`} />

            <header className={`px-6 py-4 border-b flex items-center justify-between relative z-10 shadow-lg transition-all duration-300 ${
              videotronTheme === 'light' 
                ? 'border-slate-200 bg-white/95 shadow-slate-200/20' 
                : 'border-slate-800 bg-slate-900/95 shadow-slate-950/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner transition-colors duration-300 ${
                  videotronTheme === 'light'
                    ? 'bg-indigo-100 border border-indigo-200 text-indigo-600'
                    : 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300'
                }`}>
                  {chatIcon ? (
                    <img src={chatIcon} alt="Icon" className="w-full h-full object-cover" />
                  ) : (
                    <MessageSquare size={24} className="stroke-[2]" />
                  )}
                </div>
                <div>
                  <h2 className={`text-xl md:text-2xl font-black tracking-wide flex items-center gap-2 transition-colors duration-300 ${
                    videotronTheme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                    {chatTitle}
                    <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-[10px] md:text-xs font-black rounded-full uppercase tracking-widest animate-pulse">
                      LIVE
                    </span>
                  </h2>
                  <div className="flex items-center gap-2 text-sm mt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span className={`font-semibold transition-colors duration-300 ${
                      videotronTheme === 'light' ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {userStats.total > 0 ? (userStats.users + userStats.admins) : 0} Anggota Aktif Obrolan
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Theme Toggle Button */}
                <button
                  onClick={() => setVideotronTheme(prev => prev === 'light' ? 'dark' : 'light')}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-all border shadow-sm cursor-pointer ${
                    videotronTheme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/50'
                  }`}
                  title={videotronTheme === 'light' ? "Ubah ke Mode Gelap" : "Ubah ke Mode Terang"}
                >
                  {videotronTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Minimalist Icon-only Keluar Preview Button */}
                <button 
                  onClick={() => setShowVideotronPreview(false)}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-all border shadow-sm cursor-pointer ${
                    videotronTheme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/50'
                  }`}
                  title="Keluar Preview"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
            </header>

            <div className={`flex-1 overflow-y-auto p-6 md:p-10 space-y-6 relative z-10 max-w-5xl mx-auto w-full scrollbar-thin transition-colors duration-300 ${
              videotronTheme === 'light' ? 'scrollbar-thumb-slate-200' : 'scrollbar-thumb-slate-800'
            }`}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 text-center py-20">
                  <MessageSquare size={48} className={`${videotronTheme === 'light' ? 'text-slate-300' : 'text-slate-600'} stroke-[1.5] animate-bounce`} />
                  <p className={`text-lg font-bold ${videotronTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Belum Ada Pesan</p>
                  <p className={`text-sm ${videotronTheme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>Pesan dari warga Surabaya yang terkirim akan muncul di sini secara real-time.</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isAdminMsg = msg.senderType === 'admin';
                  const selectedCustomAvatar = userAvatars.find(a => a.id === msg.avatar);
                  const fallbackAvatarDef = AVATARS.find(a => a.id === msg.avatar) || AVATARS[0];
                  const AvatarIcon = fallbackAvatarDef.icon;

                  // Get our dynamic premium colorful theme for this bubble
                  const isLight = videotronTheme === 'light';
                  const t = getThemeForMsg(msg, isLight);

                  return (
                    <div 
                      key={msg.id || idx} 
                      className={`flex gap-4 md:gap-5 items-start backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-xl transition-all duration-300 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-500 border ${t.bg}`}
                      style={{ borderLeft: `6px solid ${t.borderLeft}` }}
                    >
                      {/* Glow Overlay Effect on Hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity pointer-events-none duration-300"
                        style={{ backgroundColor: t.borderLeft }}
                      />

                      {/* Large User Avatar Container */}
                      <div className="shrink-0">
                        {isAdminMsg ? (
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-white shadow-xl border-3 border-amber-400 shrink-0">
                            <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 stroke-[2.5]" />
                          </div>
                        ) : selectedCustomAvatar ? (
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-3 bg-slate-950 overflow-hidden shadow-xl shrink-0 transition-colors duration-300"
                               style={{ borderColor: t.borderLeft }}>
                            <img src={selectedCustomAvatar.url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                          </div>
                        ) : (
                          <div 
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white shadow-xl border-3 shrink-0 transition-colors duration-300"
                            style={{ backgroundColor: t.borderLeft, borderColor: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)' }}
                          >
                            <AvatarIcon className="w-10 h-10 md:w-12 md:h-12 stroke-[2]" />
                          </div>
                        )}
                      </div>

                      {/* Message Content Container */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3.5 flex-wrap">
                          <span className={`text-xl md:text-2xl lg:text-3xl font-black tracking-wide transition-colors duration-300 ${t.userText}`}>
                            {msg.username}
                          </span>
                          {isAdminMsg ? (
                            <span className={`px-3.5 py-1 text-xs md:text-sm font-black rounded-full uppercase tracking-widest border ${t.badge}`}>
                              Moderator
                            </span>
                          ) : (
                            <span className={`px-3.5 py-1 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider border transition-colors duration-300 ${t.badge}`}>
                              Warga Surabaya
                            </span>
                          )}
                          <span className={`text-sm md:text-base ml-auto font-mono font-medium transition-colors duration-300 ${t.timeText}`}>
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        
                        <p className={`mt-3 text-lg md:text-xl lg:text-2xl leading-relaxed break-words whitespace-pre-wrap transition-colors duration-300 ${t.msgText}`}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={videotronEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

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
  update,
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
  Moon,
  ChevronDown,
  Minus,
  Plus,
  Upload,
  Eye,
  EyeOff,
  Image as ImageIcon
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
  const [showUnbanAllConfirm, setShowUnbanAllConfirm] = useState<boolean>(false);
  const [showDeleteAvatarConfirm, setShowDeleteAvatarConfirm] = useState<string | null>(null);
  const [showVideotronPreview, setShowVideotronPreview] = useState<boolean>(false);
  const [videotronTheme, setVideotronTheme] = useState<'dark' | 'light'>('dark');
  const [videotronScale, setVideotronScale] = useState<number>(100);
  const [videotronBg, setVideotronBg] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920');
  const [showSettingsDropdown, setShowSettingsDropdown] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>('SURABAYA COMMUNITY SHARING CONCERT');
  const [eventTitleSize, setEventTitleSize] = useState<number>(44);
  const [videotronLogoLeft, setVideotronLogoLeft] = useState<string>('');
  const [videotronLogoRight, setVideotronLogoRight] = useState<string>('');
  const [videotronLogoSize, setVideotronLogoSize] = useState<number>(80);
  const [videotronQrCodeUrl, setVideotronQrCodeUrl] = useState<string>('');
  const [videotronSupportedByText, setVideotronSupportedByText] = useState<string>('SUPPORTED BY');
  const [eventTitleColor, setEventTitleColor] = useState<string>('#ffffff');
  const [videotronSponsorTextColor, setVideotronSponsorTextColor] = useState<string>('#ffffff');
  const [videotronSponsorTextSize, setVideotronSponsorTextSize] = useState<number>(12);
  const [videotronQrTextColor, setVideotronQrTextColor] = useState<string>('#ffffff');
  const [videotronQrTextSize, setVideotronQrTextSize] = useState<number>(9);
  const [videotronChatBgMode, setVideotronChatBgMode] = useState<'blur' | 'solid'>('blur');
  const [videotronChatBgColor, setVideotronChatBgColor] = useState<string>('#0f172a');
  const [videotronChatBgOpacity, setVideotronChatBgOpacity] = useState<number>(30);
  const [videotronChatBgBlur, setVideotronChatBgBlur] = useState<number>(20);
  const [videotronChatBorderColor, setVideotronChatBorderColor] = useState<string>('#ffffff');
  const [videotronChatBorderOpacity, setVideotronChatBorderOpacity] = useState<number>(10);
  const [videotronQrSize, setVideotronQrSize] = useState<number>(130);
  const [videotronQrXOffset, setVideotronQrXOffset] = useState<number>(0);
  const [videotronQrYOffset, setVideotronQrYOffset] = useState<number>(0);
  const [videotronBgSize, setVideotronBgSize] = useState<string>('cover');
  const [videotronBlur, setVideotronBlur] = useState<number>(2);
  const [videotronLogoBgEnabled, setVideotronLogoBgEnabled] = useState<boolean>(true);
  const [videotronLogoInnerScale, setVideotronLogoInnerScale] = useState<number>(100);
  const [videotronQrBgEnabled, setVideotronQrBgEnabled] = useState<boolean>(true);
  const [videotronSponsorBgEnabled, setVideotronSponsorBgEnabled] = useState<boolean>(true);
  const [showVideotronSidebar, setShowVideotronSidebar] = useState<boolean>(true);
  const videotronEndRef = useRef<HTMLDivElement>(null);
  const lastVideotronConfigRef = useRef<any>(null);
  const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(true);
  const [isChatEnabled, setIsChatEnabled] = useState<boolean>(true);
  const [maxMessagesPerUser, setMaxMessagesPerUser] = useState<number | null>(null);
  const [draftMaxMessages, setDraftMaxMessages] = useState<string>('');
  const [chatTitle, setChatTitle] = useState<string>('Surabaya Community Live Chat');
  const [chatIcon, setChatIcon] = useState<string>('');
    const [draftTitle, setDraftTitle] = useState<string>('Surabaya Community Live Chat');
  const [adminView, setAdminView] = useState<'chat' | 'avatars' | 'users'>('chat');
  const [userAvatars, setUserAvatars] = useState<{id: string, url: string}[]>([]);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showBanUserView, setShowBanUserView] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState<{ userId: string, duration: number } | null>(null);
  const [showUnbanConfirm, setShowUnbanConfirm] = useState<{ userId: string } | null>(null);
  const [activeBanDropdown, setActiveBanDropdown] = useState<string | null>(null);
  
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
          { text: 'Membaca konfigurasi dari cache lokal...', progress: 40 },
          { text: 'Memverifikasi integritas aset gambar...', progress: 80 },
          { text: 'Selesai!', progress: 100 }
        ];

        let currentProgress = 0;
        for (const step of statuses) {
          if (!isMounted) return;
          setDownloadStatus(step.text);
          
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
          { text: 'Menghubungkan ke server Surabaya...', progress: 20 },
          { text: 'Mengunduh konfigurasi ruang obrolan...', progress: 50 },
          { text: 'Memproses & mengompresi gambar ikon...', progress: 75 },
          { text: 'Mengunduh & mengoptimalkan kustom avatar...', progress: 90 },
          { text: 'Menyimpan aset ke cache lokal...', progress: 100 }
        ];

        setDownloadStatus(statuses[0].text);
        setDownloadProgress(5);
        
        try {
          const configSnapshot = await get(ref(db, 'chat_config'));

          setDownloadStatus(statuses[1].text);
          setDownloadProgress(25);
          await new Promise(r => setTimeout(r, 10));

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

    const maxMessagesRef = ref(db, 'max_messages_per_user');
    const unsubscribeMaxMessages = onValue(maxMessagesRef, (snapshot) => {
      const val = snapshot.val();
      setMaxMessagesPerUser(val !== null ? val : null);
      if (val !== null) setDraftMaxMessages(val.toString());
      else setDraftMaxMessages('');
    });

    const usersRef = ref(db, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const usersData: any[] = [];
      snapshot.forEach((child) => {
        usersData.push({ id: child.key, ...child.val() });
      });
      setAllUsers(usersData);
    });

    return () => {
      unsubscribeFilter();
      unsubscribeChatEnabled();
      unsubscribeMaxMessages();
      unsubscribeConfig();
      unsubscribeUsers();
    };
  }, [isAdminLoggedIn]);

  // 4. Real-time Videotron Config Listener
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const configRef = ref(db, 'videotron_config');
    const unsubscribe = onValue(configRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        lastVideotronConfigRef.current = val;
        if (val.videotronTheme !== undefined) setVideotronTheme(val.videotronTheme);
        if (val.videotronScale !== undefined) setVideotronScale(val.videotronScale);
        if (val.videotronBg !== undefined) setVideotronBg(val.videotronBg);
        if (val.eventTitle !== undefined) setEventTitle(val.eventTitle);
        if (val.eventTitleSize !== undefined) setEventTitleSize(val.eventTitleSize);
        if (val.videotronLogoLeft !== undefined) setVideotronLogoLeft(val.videotronLogoLeft);
        if (val.videotronLogoRight !== undefined) setVideotronLogoRight(val.videotronLogoRight);
        if (val.videotronLogoSize !== undefined) setVideotronLogoSize(val.videotronLogoSize);
        if (val.videotronQrCodeUrl !== undefined) setVideotronQrCodeUrl(val.videotronQrCodeUrl);
        if (val.videotronSupportedByText !== undefined) setVideotronSupportedByText(val.videotronSupportedByText);
        if (val.videotronQrSize !== undefined) setVideotronQrSize(val.videotronQrSize);
        if (val.videotronQrXOffset !== undefined) setVideotronQrXOffset(val.videotronQrXOffset);
        if (val.videotronQrYOffset !== undefined) setVideotronQrYOffset(val.videotronQrYOffset);
        if (val.videotronBgSize !== undefined) setVideotronBgSize(val.videotronBgSize);
        if (val.videotronBlur !== undefined) setVideotronBlur(val.videotronBlur);
        if (val.videotronLogoBgEnabled !== undefined) setVideotronLogoBgEnabled(val.videotronLogoBgEnabled);
        if (val.videotronLogoInnerScale !== undefined) setVideotronLogoInnerScale(val.videotronLogoInnerScale);
        if (val.videotronQrBgEnabled !== undefined) setVideotronQrBgEnabled(val.videotronQrBgEnabled);
        if (val.videotronSponsorBgEnabled !== undefined) setVideotronSponsorBgEnabled(val.videotronSponsorBgEnabled);
        if (val.eventTitleColor !== undefined) setEventTitleColor(val.eventTitleColor);
        if (val.videotronSponsorTextColor !== undefined) setVideotronSponsorTextColor(val.videotronSponsorTextColor);
        if (val.videotronSponsorTextSize !== undefined) setVideotronSponsorTextSize(val.videotronSponsorTextSize);
        if (val.videotronQrTextColor !== undefined) setVideotronQrTextColor(val.videotronQrTextColor);
        if (val.videotronQrTextSize !== undefined) setVideotronQrTextSize(val.videotronQrTextSize);
        if (val.videotronChatBgMode !== undefined) setVideotronChatBgMode(val.videotronChatBgMode);
        if (val.videotronChatBgColor !== undefined) setVideotronChatBgColor(val.videotronChatBgColor);
        if (val.videotronChatBgOpacity !== undefined) setVideotronChatBgOpacity(val.videotronChatBgOpacity);
        if (val.videotronChatBgBlur !== undefined) setVideotronChatBgBlur(val.videotronChatBgBlur);
        if (val.videotronChatBorderColor !== undefined) setVideotronChatBorderColor(val.videotronChatBorderColor);
        if (val.videotronChatBorderOpacity !== undefined) setVideotronChatBorderOpacity(val.videotronChatBorderOpacity);
      }
    });

    return () => unsubscribe();
  }, [isAdminLoggedIn]);

  // 5. Sync Videotron Config to Realtime Database (with 300ms debounce)
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const currentConfig = {
      videotronTheme,
      videotronScale,
      videotronBg,
      eventTitle,
      eventTitleSize,
      videotronLogoLeft,
      videotronLogoRight,
      videotronLogoSize,
      videotronQrCodeUrl,
      videotronSupportedByText,
      videotronQrSize,
      videotronQrXOffset,
      videotronQrYOffset,
      videotronBgSize,
      videotronBlur,
      videotronLogoBgEnabled,
      videotronLogoInnerScale,
      videotronQrBgEnabled,
      videotronSponsorBgEnabled,
      eventTitleColor,
      videotronSponsorTextColor,
      videotronSponsorTextSize,
      videotronQrTextColor,
      videotronQrTextSize,
      videotronChatBgMode,
      videotronChatBgColor,
      videotronChatBgOpacity,
      videotronChatBgBlur,
      videotronChatBorderColor,
      videotronChatBorderOpacity,
    };

    const dbConfig = lastVideotronConfigRef.current;
    if (dbConfig) {
      const isDifferent = Object.keys(currentConfig).some(
        (key) => currentConfig[key as keyof typeof currentConfig] !== dbConfig[key]
      );
      if (!isDifferent) {
        return;
      }
    }

    const timer = setTimeout(async () => {
      try {
        lastVideotronConfigRef.current = currentConfig;
        await set(ref(db, 'videotron_config'), currentConfig);
      } catch (error) {
        console.error('Error saving videotron config:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    isAdminLoggedIn,
    videotronTheme,
    videotronScale,
    videotronBg,
    eventTitle,
    eventTitleSize,
    videotronLogoLeft,
    videotronLogoRight,
    videotronLogoSize,
    videotronQrCodeUrl,
    videotronSupportedByText,
    videotronQrSize,
    videotronQrXOffset,
    videotronQrYOffset,
    videotronBgSize,
    videotronBlur,
    videotronLogoBgEnabled,
    videotronLogoInnerScale,
    videotronQrBgEnabled,
    videotronSponsorBgEnabled,
    eventTitleColor,
    videotronSponsorTextColor,
    videotronSponsorTextSize,
    videotronQrTextColor,
    videotronQrTextSize,
    videotronChatBgMode,
    videotronChatBgColor,
    videotronChatBgOpacity,
    videotronChatBgBlur,
    videotronChatBorderColor,
    videotronChatBorderOpacity,
  ]);

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

  const handleUpdateMaxMessages = async () => {
    try {
      const val = draftMaxMessages.trim() === '' ? null : parseInt(draftMaxMessages, 10);
      if (val !== null && isNaN(val)) {
        alert("Masukkan angka yang valid");
        return;
      }
      await set(ref(db, 'max_messages_per_user'), val);
      alert("Pengaturan batas pesan berhasil disimpan");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'max_messages_per_user');
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

  // Ban Handlers
  const handleBanUser = async (userId: string, duration: number) => {
    try {
      const banUntil = duration === -1 ? -1 : Date.now() + duration * 60 * 60 * 1000;
      await update(ref(db, `users/${userId}`), {
        isBanned: true,
        banUntil: banUntil
      });
    } catch (error) {
      console.error("Failed to ban user", error);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await update(ref(db, `users/${userId}`), {
        isBanned: false,
        banUntil: null
      });
    } catch (error) {
      console.error("Failed to unban user", error);
    }
  };

  const handleUnbanAll = async () => {
    try {
      const updates: any = {};
      allUsers.forEach(user => {
        if (user.isBanned) {
          updates[`${user.id}/isBanned`] = false;
          updates[`${user.id}/banUntil`] = null;
        }
      });
      if (Object.keys(updates).length > 0) {
        await update(ref(db, 'users'), updates);
      }
      setShowUnbanAllConfirm(false);
    } catch (e) {
      console.error("Failed to unban all", e);
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
                        onClick={() => setAdminView('users')}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                          adminView === 'users' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <User size={16} />
                        Kelola User
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
                        <span className="text-xs font-semibold text-gray-800">Filter Kata Kasar</span>
                        <span className="text-[10px] text-gray-500 leading-tight">Sensor otomatis kata tidak pantas</span>
                      </div>
                      <button
                        onClick={toggleFilter}
                        type="button"
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isFilterEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isFilterEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {/* Max Messages Per User */}
                    <div className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-gray-800">Batas Pesan Per User</span>
                        <span className="text-[10px] text-gray-500 leading-tight">Maksimal pesan yang bisa dikirim oleh satu akun. Kosongkan untuk tanpa batas.</span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          value={draftMaxMessages}
                          onChange={(e) => setDraftMaxMessages(e.target.value)}
                          placeholder="Contoh: 1, 5, 10"
                          className="w-full border border-gray-200 rounded-lg pl-3 pr-20 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                        />
                        <button
                          onClick={handleUpdateMaxMessages}
                          className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold rounded-md transition-colors flex items-center justify-center"
                        >
                          Simpan
                        </button>
                      </div>
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
            ) : adminView === 'users' ? (
              <section className="flex-1 flex flex-col h-[calc(100vh-280px)] md:h-screen bg-gray-50/50 overflow-y-auto">
                <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
                      <User size={18} />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 tracking-wide text-sm md:text-base">
                        Kelola User {showBanUserView ? 'Banned' : 'Aktif'}
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {showBanUserView ? 'Mengelola user yang sedang diblokir.' : 'Mengelola user yang sudah mendaftar dan online.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowBanUserView(!showBanUserView)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors"
                    >
                      {showBanUserView ? 'Lihat Semua User' : 'Lihat Banned User'}
                    </button>
                    {showBanUserView && (
                      <button
                        onClick={() => setShowUnbanAllConfirm(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm transition-colors"
                      >
                        Unbanned All
                      </button>
                    )}
                  </div>
                </header>
                
                <div className="p-6">
                  <div className="mb-4">
                    <input 
                      type="text" 
                      placeholder="Cari user..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500">
                        <tr>
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allUsers
                          .filter(u => showBanUserView ? u.isBanned : !u.isBanned)
                          .filter(u => (u.username || '').toLowerCase().includes(userSearch.toLowerCase()))
                          .sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0))
                          .map(user => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={userAvatars.find(a => a.id === user.avatar)?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt="Avatar" className="w-8 h-8 rounded-full bg-gray-100 object-cover" />
                                <div>
                                  <div className="font-semibold text-gray-900">{user.username}</div>
                                  <div className="text-xs text-gray-500 font-mono mt-0.5">{user.phone || '-'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {user.isBanned ? (
                                <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold border border-red-200">Banned</span>
                              ) : user.isOnline ? (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-xs font-semibold border border-emerald-200">Online</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold border border-gray-200">Offline</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {user.isBanned ? (
                                <button
                                  onClick={() => handleUnbanUser(user.id)}
                                  className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs border border-emerald-200 px-3 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100"
                                >
                                  Unban
                                </button>
                              ) : (
                                <div className="relative inline-block">
                                  <button 
                                    onClick={() => setActiveBanDropdown(activeBanDropdown === user.id ? null : user.id)} 
                                    className="text-red-600 hover:text-red-700 font-semibold text-xs border border-red-200 px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 flex items-center gap-1"
                                  >
                                    Ban User
                                    <ChevronDown size={14} className={`transition-transform ${activeBanDropdown === user.id ? 'rotate-180' : ''}`} />
                                  </button>
                                  {activeBanDropdown === user.id && (
                                    <div className="absolute left-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 flex flex-col py-1">
                                      <button onClick={() => { handleBanUser(user.id, 10/60); setActiveBanDropdown(null); }} className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium">10 Menit</button>
                                      <button onClick={() => { handleBanUser(user.id, 1); setActiveBanDropdown(null); }} className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium">1 Jam</button>
                                      <button onClick={() => { handleBanUser(user.id, 2); setActiveBanDropdown(null); }} className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium">2 Jam</button>
                                      <button onClick={() => { handleBanUser(user.id, 6); setActiveBanDropdown(null); }} className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium">6 Jam</button>
                                      <button onClick={() => { handleBanUser(user.id, 24); setActiveBanDropdown(null); }} className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium">1 Hari</button>
                                      <button onClick={() => { handleBanUser(user.id, -1); setActiveBanDropdown(null); }} className="px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 font-bold border-t border-gray-100">Permanen</button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {allUsers.filter(u => showBanUserView ? u.isBanned : !u.isBanned).length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                              Tidak ada user ditemukan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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

        {showUnbanAllConfirm && (
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
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 text-emerald-600">Unban Semua User?</h3>
                <p className="text-sm text-gray-500 mt-1">Tindakan ini akan mengembalikan akses obrolan untuk seluruh user yang sedang diblokir.</p>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setShowUnbanAllConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleUnbanAll}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 transition-colors text-sm cursor-pointer font-bold"
                >
                  Ya, Unban Semua
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
            className="fixed inset-0 z-[100] flex font-sans overflow-hidden min-h-screen bg-slate-950 text-white transition-all duration-300"
          >
            {/* REAL-TIME CONTROLLER SIDEBAR PANEL */}
            <AnimatePresence>
              {showVideotronSidebar && (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="w-80 md:w-96 shrink-0 h-screen bg-slate-900/95 border-r border-white/10 backdrop-blur-xl p-5 overflow-y-auto flex flex-col justify-between z-[110] shadow-2xl relative"
                >
                  {/* Scrollable controls */}
                  <div className="space-y-6 pb-12">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-black text-sm tracking-widest uppercase text-slate-100 flex items-center gap-2">
                        <span>⚙️ SETUP VIDEOTRON</span>
                      </h3>
                      <button
                        onClick={() => setShowVideotronSidebar(false)}
                        className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all"
                        title="Sembunyikan Menu"
                      >
                        <EyeOff size={18} />
                      </button>
                    </div>

                    {/* Event Title Section */}
                    <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black tracking-wider text-indigo-400 block uppercase">Header Event</span>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Nama Judul Event</label>
                        <textarea
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="Ketik nama event..."
                          rows={2}
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-xs font-bold text-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Ukuran Font Judul ({eventTitleSize}px)</label>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          value={eventTitleSize}
                          onChange={(e) => setEventTitleSize(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Warna Font Judul</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={eventTitleColor}
                            onChange={(e) => setEventTitleColor(e.target.value)}
                            className="w-8 h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={eventTitleColor}
                            onChange={(e) => setEventTitleColor(e.target.value)}
                            className="flex-1 px-2 py-1 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded-lg text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Left & Right Logos Section */}
                    <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black tracking-wider text-indigo-400 block uppercase">Logo Header</span>
                      
                      {/* Left Logo */}
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Logo Kiri (Upload / URL)</label>
                        <div className="flex items-center gap-2 mb-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            id="videotron-logo-left-file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setVideotronLogoLeft(reader.result);
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                          />
                          <label
                            htmlFor="videotron-logo-left-file"
                            className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Upload size={12} />
                            <span>Upload</span>
                          </label>
                          {videotronLogoLeft && (
                            <button
                              onClick={() => setVideotronLogoLeft('')}
                              className="px-2 py-1.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold transition-colors"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={videotronLogoLeft}
                          onChange={(e) => setVideotronLogoLeft(e.target.value)}
                          placeholder="Atau tempel URL logo..."
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white"
                        />
                      </div>

                      {/* Right Logo */}
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Logo Kanan (Upload / URL)</label>
                        <div className="flex items-center gap-2 mb-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            id="videotron-logo-right-file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setVideotronLogoRight(reader.result);
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                          />
                          <label
                            htmlFor="videotron-logo-right-file"
                            className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Upload size={12} />
                            <span>Upload</span>
                          </label>
                          {videotronLogoRight && (
                            <button
                              onClick={() => setVideotronLogoRight('')}
                              className="px-2 py-1.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold transition-colors"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={videotronLogoRight}
                          onChange={(e) => setVideotronLogoRight(e.target.value)}
                          placeholder="Atau tempel URL logo..."
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white"
                        />
                      </div>

                      {/* Logo Size */}
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Ukuran Logo ({videotronLogoSize}px)</label>
                        <input
                          type="range"
                          min="40"
                          max="160"
                          value={videotronLogoSize}
                          onChange={(e) => setVideotronLogoSize(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Logo Container Background Toggle */}
                      <div className="flex items-center justify-between bg-slate-950/40 p-2 rounded-xl border border-white/5">
                        <span className="text-[10px] text-white/70 font-bold">Background Container Logo</span>
                        <button
                          onClick={() => setVideotronLogoBgEnabled(prev => !prev)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all border ${
                            videotronLogoBgEnabled 
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                              : 'bg-slate-950 border-white/10 text-white/40'
                          }`}
                        >
                          {videotronLogoBgEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      {/* Logo Inside Container Scale */}
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Skala Logo di Dalam Container ({videotronLogoInnerScale}%)</label>
                        <input
                          type="range"
                          min="20"
                          max="150"
                          value={videotronLogoInnerScale}
                          onChange={(e) => setVideotronLogoInnerScale(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black tracking-wider text-indigo-400 block uppercase">QR Code</span>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Upload QR Code (Upload / URL)</label>
                        <div className="flex items-center gap-2 mb-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            id="videotron-qr-file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setVideotronQrCodeUrl(reader.result);
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                          />
                          <label
                            htmlFor="videotron-qr-file"
                            className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Upload size={12} />
                            <span>Upload QR</span>
                          </label>
                          {videotronQrCodeUrl && (
                            <button
                              onClick={() => setVideotronQrCodeUrl('')}
                              className="px-2 py-1.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold transition-colors"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={videotronQrCodeUrl}
                          onChange={(e) => setVideotronQrCodeUrl(e.target.value)}
                          placeholder="Atau tempel URL QR Code..."
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Ukuran QR Code ({videotronQrSize}px)</label>
                        <input
                          type="range"
                          min="60"
                          max="250"
                          value={videotronQrSize}
                          onChange={(e) => setVideotronQrSize(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* SCAN QR Text Settings */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Size Teks SCAN QR ({videotronQrTextSize}px)</label>
                          <input
                            type="range"
                            min="6"
                            max="24"
                            value={videotronQrTextSize}
                            onChange={(e) => setVideotronQrTextSize(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Color Teks SCAN QR</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={videotronQrTextColor}
                              onChange={(e) => setVideotronQrTextColor(e.target.value)}
                              className="w-6 h-6 rounded bg-transparent border border-white/20 cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={videotronQrTextColor}
                              onChange={(e) => setVideotronQrTextColor(e.target.value)}
                              className="w-full px-1 py-0.5 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded text-[9px] font-mono text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* QR Code Container Background Toggle */}
                      <div className="flex items-center justify-between bg-slate-950/40 p-2 rounded-xl border border-white/5">
                        <span className="text-[10px] text-white/70 font-bold">Background Container QR</span>
                        <button
                          onClick={() => setVideotronQrBgEnabled(prev => !prev)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all border ${
                            videotronQrBgEnabled 
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                              : 'bg-slate-950 border-white/10 text-white/40'
                          }`}
                        >
                          {videotronQrBgEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Posisi X Offset ({videotronQrXOffset}px)</label>
                          <input
                            type="range"
                            min="-150"
                            max="150"
                            value={videotronQrXOffset}
                            onChange={(e) => setVideotronQrXOffset(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Posisi Y Offset ({videotronQrYOffset}px)</label>
                          <input
                            type="range"
                            min="-150"
                            max="150"
                            value={videotronQrYOffset}
                            onChange={(e) => setVideotronQrYOffset(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Custom Supported By text */}
                    <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black tracking-wider text-indigo-400 block uppercase">Supported By</span>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Teks Supported By</label>
                        <input
                          type="text"
                          value={videotronSupportedByText}
                          onChange={(e) => setVideotronSupportedByText(e.target.value)}
                          placeholder="SUPPORTED BY"
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white"
                        />
                      </div>

                      {/* Supported By Text Settings */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Ukuran Font ({videotronSponsorTextSize}px)</label>
                          <input
                            type="range"
                            min="8"
                            max="36"
                            value={videotronSponsorTextSize}
                            onChange={(e) => setVideotronSponsorTextSize(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Warna Font</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={videotronSponsorTextColor}
                              onChange={(e) => setVideotronSponsorTextColor(e.target.value)}
                              className="w-6 h-6 rounded bg-transparent border border-white/20 cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={videotronSponsorTextColor}
                              onChange={(e) => setVideotronSponsorTextColor(e.target.value)}
                              className="w-full px-1 py-0.5 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded text-[9px] font-mono text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sponsor Container Background Toggle */}
                      <div className="flex items-center justify-between bg-slate-950/40 p-2 rounded-xl border border-white/5">
                        <span className="text-[10px] text-white/70 font-bold">Background Container Sponsor</span>
                        <button
                          onClick={() => setVideotronSponsorBgEnabled(prev => !prev)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all border ${
                            videotronSponsorBgEnabled 
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' 
                              : 'bg-slate-950 border-white/10 text-white/40'
                          }`}
                        >
                          {videotronSponsorBgEnabled ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>

                    {/* Custom Background Section */}
                    <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black tracking-wider text-indigo-400 block uppercase">Background</span>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Ganti Background (Upload / URL)</label>
                        <div className="flex items-center gap-2 mb-1.5">
                          <input
                            type="file"
                            accept="image/*"
                            id="videotron-bg-file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setVideotronBg(reader.result);
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                          />
                          <label
                            htmlFor="videotron-bg-file"
                            className="cursor-pointer px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Upload size={12} />
                            <span>Upload Bg</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          value={videotronBg}
                          onChange={(e) => setVideotronBg(e.target.value)}
                          placeholder="Ketik URL background..."
                          className="w-full px-3 py-2 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Background Size</label>
                        <div className="flex gap-2">
                          {['cover', 'contain', 'auto'].map((size) => (
                            <button
                              key={size}
                              onClick={() => setVideotronBgSize(size)}
                              className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                                videotronBgSize === size
                                  ? 'bg-indigo-600 border-indigo-500 text-white'
                                  : 'bg-slate-950 border-white/10 text-white/60 hover:text-white'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Background Blur Intensity */}
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Intensitas Background Blur ({videotronBlur}px)</label>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={videotronBlur}
                          onChange={(e) => setVideotronBlur(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* General Scale and Bubble Theme Options */}
                    <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black tracking-wider text-indigo-400 block uppercase">Pengaturan Tampilan</span>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Skala Zoom Videotron ({videotronScale}%)</label>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          step="5"
                          value={videotronScale}
                          onChange={(e) => setVideotronScale(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Tema Bubble Pesan</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setVideotronTheme('dark')}
                            className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${
                              videotronTheme === 'dark'
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-950 border-white/10 text-white/60 hover:text-white'
                            }`}
                          >
                            Mode Gelap
                          </button>
                          <button
                            onClick={() => setVideotronTheme('light')}
                            className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${
                              videotronTheme === 'light'
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-950 border-white/10 text-white/60 hover:text-white'
                            }`}
                          >
                            Mode Terang
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Real-time Chat Container Styling Section */}
                    <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black tracking-wider text-indigo-400 block uppercase">Desain Wadah Chat (Container)</span>
                      
                      {/* BG Mode */}
                      <div>
                        <label className="text-[10px] text-white/55 block mb-1">Mode Latar Belakang</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setVideotronChatBgMode('blur')}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              videotronChatBgMode === 'blur'
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-950 border-white/10 text-white/60 hover:text-white'
                            }`}
                          >
                            Blur (Kaca)
                          </button>
                          <button
                            onClick={() => setVideotronChatBgMode('solid')}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              videotronChatBgMode === 'solid'
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-slate-950 border-white/10 text-white/60 hover:text-white'
                            }`}
                          >
                            Solid (Pekat)
                          </button>
                        </div>
                      </div>

                      {/* BG Color & Opacity */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Warna Wadah</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="color"
                              value={videotronChatBgColor}
                              onChange={(e) => setVideotronChatBgColor(e.target.value)}
                              className="w-6 h-6 rounded bg-transparent border border-white/20 cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={videotronChatBgColor}
                              onChange={(e) => setVideotronChatBgColor(e.target.value)}
                              className="w-full px-1 py-0.5 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded text-[9px] font-mono text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Opasitas Wadah ({videotronChatBgOpacity}%)</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={videotronChatBgOpacity}
                            onChange={(e) => setVideotronChatBgOpacity(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Blur Intensity */}
                      {videotronChatBgMode === 'blur' && (
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Intensitas Blur Wadah ({videotronChatBgBlur}px)</label>
                          <input
                            type="range"
                            min="0"
                            max="60"
                            value={videotronChatBgBlur}
                            onChange={(e) => setVideotronChatBgBlur(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Border Color & Opacity */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Warna Stroke/Border</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="color"
                              value={videotronChatBorderColor}
                              onChange={(e) => setVideotronChatBorderColor(e.target.value)}
                              className="w-6 h-6 rounded bg-transparent border border-white/20 cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={videotronChatBorderColor}
                              onChange={(e) => setVideotronChatBorderColor(e.target.value)}
                              className="w-full px-1 py-0.5 bg-slate-950 border border-white/10 focus:border-indigo-500 focus:outline-none rounded text-[9px] font-mono text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-white/55 block mb-1">Opasitas Stroke ({videotronChatBorderOpacity}%)</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={videotronChatBorderOpacity}
                            onChange={(e) => setVideotronChatBorderOpacity(Number(e.target.value))}
                            className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar bottom action */}
                  <div className="border-t border-white/10 pt-4 mt-auto">
                    <button
                      onClick={() => {
                        setShowVideotronPreview(false);
                      }}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/10 cursor-pointer transition-colors"
                    >
                      <ArrowLeft size={14} />
                      <span>Keluar Preview</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ambient viewport that scales and contains the videotron screen layout */}
            <div 
              className="flex-1 flex flex-col justify-between p-6 md:p-8 lg:p-10 relative overflow-y-auto scrollbar-none transition-all duration-300"
              style={{
                backgroundImage: `url(${videotronBg})`,
                backgroundSize: videotronBgSize,
                backgroundPosition: 'center',
              }}
            >
              {/* Ambient Dark Overlay for elegant contrast & readability */}
              <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" style={{ backdropFilter: `blur(${videotronBlur}px)` }} />

              {/* Real-time scalable view area */}
              <div 
                className="flex-1 flex flex-col justify-between relative z-10 w-full max-w-7xl mx-auto h-full"
                style={{ zoom: videotronScale / 100 }}
              >
                {/* HEADER LAYOUT: LOGO - EVENT TITLE - LOGO */}
                <div className="flex items-center justify-between gap-6 mb-6 w-full">
                  {/* Left LOGO card */}
                  <div 
                    className={videotronLogoBgEnabled ? "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center p-2 overflow-hidden shrink-0 shadow-lg" : "flex items-center justify-center overflow-hidden shrink-0"}
                    style={{ width: `${videotronLogoSize}px`, height: `${videotronLogoSize}px` }}
                  >
                    {videotronLogoLeft ? (
                      <img src={videotronLogoLeft} alt="Logo Kiri" className="w-full h-full object-contain" style={{ transform: `scale(${videotronLogoInnerScale / 100})`, transformOrigin: 'center' }} />
                    ) : chatIcon ? (
                      <img src={chatIcon} alt="Logo" className="w-full h-full object-contain" style={{ transform: `scale(${videotronLogoInnerScale / 100})`, transformOrigin: 'center' }} />
                    ) : (
                      <span className="text-xs font-black text-white/70 tracking-widest">LOGO</span>
                    )}
                  </div>

                  {/* Center "NAMA EVENT" display */}
                  <div className="flex-1 text-center px-4">
                    <h1 
                      className="font-black tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-sans uppercase"
                      style={{ fontSize: `${eventTitleSize}px`, lineHeight: 1.1, color: eventTitleColor }}
                    >
                      {eventTitle}
                    </h1>
                  </div>

                  {/* Right LOGO card (for perfect symmetry) */}
                  <div 
                    className={videotronLogoBgEnabled ? "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center p-2 overflow-hidden shrink-0 shadow-lg" : "flex items-center justify-center overflow-hidden shrink-0"}
                    style={{ width: `${videotronLogoSize}px`, height: `${videotronLogoSize}px` }}
                  >
                    {videotronLogoRight ? (
                      <img src={videotronLogoRight} alt="Logo Kanan" className="w-full h-full object-contain" style={{ transform: `scale(${videotronLogoInnerScale / 100})`, transformOrigin: 'center' }} />
                    ) : chatIcon ? (
                      <img src={chatIcon} alt="Logo" className="w-full h-full object-contain" style={{ transform: `scale(${videotronLogoInnerScale / 100})`, transformOrigin: 'center' }} />
                    ) : (
                      <span className="text-xs font-black text-white/70 tracking-widest">LOGO</span>
                    )}
                  </div>
                </div>

                {/* ELEGANT GLASS CONTAINER WITH MESSAGE LIST */}
                <div 
                  className="flex-1 rounded-[32px] md:rounded-[40px] relative overflow-hidden flex flex-col w-full p-6 md:p-8 min-h-[350px] mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border"
                  style={{
                    borderColor: `color-mix(in srgb, ${videotronChatBorderColor} ${videotronChatBorderOpacity}%, transparent)`,
                  }}
                >
                  {/* Custom Background element with custom opacity & blur */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundColor: videotronChatBgColor,
                      opacity: videotronChatBgOpacity / 100,
                      backdropFilter: videotronChatBgMode === 'blur' ? `blur(${videotronChatBgBlur}px)` : 'none',
                      WebkitBackdropFilter: videotronChatBgMode === 'blur' ? `blur(${videotronChatBgBlur}px)` : 'none',
                    }}
                  />
                  {/* Scrolling message list */}
                  <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pb-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-3 text-center py-20">
                        <MessageSquare size={48} className="text-white/20 stroke-[1.5] animate-bounce" />
                        <p className="text-lg font-bold text-white/60">Belum Ada Pesan</p>
                        <p className="text-sm text-white/40">Pesan dari warga Surabaya yang terkirim akan muncul di sini secara real-time.</p>
                      </div>
                    ) : (
                      messages.map((msg, idx) => {
                        const isAdminMsg = msg.senderType === 'admin';
                        const selectedCustomAvatar = userAvatars.find(a => a.id === msg.avatar);
                        const fallbackAvatarDef = AVATARS.find(a => a.id === msg.avatar) || AVATARS[0];
                        const AvatarIcon = fallbackAvatarDef.icon;

                        const isDarkTheme = videotronTheme === 'dark';

                        return (
                          <div 
                            key={msg.id || idx} 
                            className={`flex gap-4 md:gap-5 items-start group animate-in fade-in slide-in-from-bottom-4 duration-300 p-4 rounded-3xl border transition-all ${
                              isDarkTheme 
                                ? 'bg-slate-950/50 backdrop-blur-md border-white/10 text-white' 
                                : 'bg-white/85 backdrop-blur-md border-white/50 text-slate-900'
                            }`}
                          >
                            {/* Round Avatar Left with Grey/Slate Circle Background */}
                            <div className="shrink-0">
                              {isAdminMsg ? (
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md border border-white/20 shrink-0">
                                  <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 stroke-[2]" />
                                </div>
                              ) : selectedCustomAvatar ? (
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 bg-slate-900/20 overflow-hidden shadow-md shrink-0">
                                  <img src={selectedCustomAvatar.url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-slate-300 bg-slate-800/40 border border-white/10 shadow-md shrink-0">
                                  <AvatarIcon className="w-6 h-6 md:w-8 md:h-8 stroke-[2]" />
                                </div>
                              )}
                            </div>

                            {/* Right Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1.5 text-left">
                              {/* USERNAME & TYPE capsule */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className={`px-3 py-1 rounded-full text-white font-black text-xs uppercase tracking-wider shadow-sm ${
                                  isAdminMsg ? 'bg-amber-500' : (msg.color || 'bg-indigo-600')
                                }`}>
                                  {msg.username}
                                </div>
                                <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                                  isDarkTheme 
                                    ? 'border-white/10 text-white/50 bg-white/5' 
                                    : 'border-slate-200 text-slate-500 bg-slate-50'
                                }`}>
                                  {isAdminMsg ? 'Moderator' : 'Warga Surabaya'}
                                </span>
                                <span className={`text-[10px] font-mono font-medium ml-auto ${
                                  isDarkTheme ? 'text-white/30' : 'text-slate-400'
                                }`}>
                                  {formatTime(msg.timestamp)}
                                </span>
                              </div>
                              
                              {/* Message text bubble (integrated cleanly for elegance) */}
                              <p className={`text-base md:text-lg font-medium leading-relaxed break-words whitespace-pre-wrap ${
                                isDarkTheme ? 'text-white/90' : 'text-slate-800'
                              }`}>
                                {msg.message}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={videotronEndRef} />
                  </div>
                </div>

                {/* FOOTER ROW: SPONSORS (LEFT) & QR CODE (RIGHT) PLACED HORIZONTALLY */}
                <div className="w-full flex flex-col md:flex-row items-stretch gap-4">
                  {/* Sponsor Box */}
                  <div className={`flex-1 flex flex-col items-start gap-1.5 p-4 rounded-[24px] transition-all duration-300 ${
                    videotronSponsorBgEnabled 
                      ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg' 
                      : ''
                  }`}>
                    {/* Positioned on the top-left of the sponsor container */}
                    <div 
                      className="font-black tracking-widest uppercase transition-all duration-300"
                      style={{ 
                        color: videotronSponsorTextColor, 
                        fontSize: `${videotronSponsorTextSize}px` 
                      }}
                    >
                      {videotronSupportedByText}
                    </div>
                    
                    {/* Horizontal logo/partner banner spans full-width for max clarity */}
                    <div className={`w-full rounded-[16px] px-4 py-2.5 flex flex-wrap items-center justify-around gap-4 md:gap-6 overflow-hidden transition-all duration-300 ${
                      videotronSponsorBgEnabled ? 'bg-white/10 backdrop-blur-md border border-white/5' : 'bg-white/5 backdrop-blur-sm border border-white/5'
                    }`}>
                      <span className="text-white text-[10px] md:text-xs font-black tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" /> DAYAPROMO
                      </span>
                      <span className="text-white text-[10px] md:text-xs font-black tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" /> KADIN JATIM
                      </span>
                      <span className="text-white text-[10px] md:text-xs font-black tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> ASPERAPI
                      </span>
                      <span className="text-white text-[10px] md:text-xs font-black tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> BANGGA SURABAYA
                      </span>
                      <span className="text-white text-[10px] md:text-xs font-black tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" /> SAPAWARGA
                      </span>
                      <span className="text-white text-[10px] md:text-xs font-black tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-yellow-500 inline-block" /> SURABAYA HEBAT
                      </span>
                    </div>
                  </div>

                  {/* QR Code Container beside sponsor container */}
                  <div 
                    className={`flex flex-col items-center justify-center shrink-0 relative transition-all duration-200 ${
                      videotronQrBgEnabled 
                        ? 'bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-[24px] shadow-lg' 
                        : 'p-1'
                    }`}
                    style={{
                      width: `${videotronQrSize}px`,
                      height: `${videotronQrSize}px`,
                      transform: `translate(${videotronQrXOffset}px, ${videotronQrYOffset}px)`,
                    }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      {videotronQrCodeUrl ? (
                        <img src={videotronQrCodeUrl} alt="QR Code" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <div className="w-full h-full bg-white p-1.5 rounded-lg flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900" fill="currentColor">
                            <rect width="100" height="100" fill="#ffffff" />
                            {/* Top Left corner finder */}
                            <path d="M5,5 h30 v30 h-30 z M11,11 h18 v18 h-18 z" />
                            {/* Top Right corner finder */}
                            <path d="M65,5 h30 v30 h-30 z M71,11 h18 v18 h-18 z" />
                            {/* Bottom Left corner finder */}
                            <path d="M5,65 h30 v30 h-30 z M11,71 h18 v18 h-18 z" />
                            {/* Dynamic center dots and small mock QR code noise */}
                            <rect x="42" y="42" width="16" height="16" />
                            <path d="M45,5 h5 v10 h-5 z M55,15 h10 v5 h-10 z" />
                            <path d="M5,42 h10 v8 h-10 z M15,50 h12 v10 h-12 z" />
                            <path d="M42,75 h15 v5 h-15 z M50,85 h15 v10 h-15 z" />
                            <path d="M75,42 h20 v10 h-20 z M82,55 h10 v20 h-10 z" />
                            <rect x="75" y="80" width="8" height="8" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {videotronQrSize > 90 && (
                      <span 
                        className="font-black tracking-widest uppercase mt-1 text-center"
                        style={{
                          color: videotronQrTextColor,
                          fontSize: `${videotronQrTextSize}px`
                        }}
                      >
                        SCAN QR
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Toggle menu floating badge - Icon Only Settings, Pojok Kiri Bawah Kecil */}
            <button
              onClick={() => setShowVideotronSidebar(prev => !prev)}
              className="fixed bottom-4 left-4 z-[120] w-9 h-9 flex items-center justify-center bg-slate-900/60 hover:bg-indigo-600 hover:text-white text-white/70 rounded-xl border border-white/10 backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer"
              title={showVideotronSidebar ? "Sembunyikan Menu" : "Tampilkan Menu"}
            >
              <Settings size={18} className={`${showVideotronSidebar ? 'rotate-90' : ''} transition-transform duration-300`} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ref, 
  query, 
  orderByChild, 
  limitToLast, 
  onValue, 
  push, 
  serverTimestamp,
  get,
  set,
  update,
  onDisconnect,
  equalTo
} from 'firebase/database';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { filterChatMessage } from '@/lib/chatFilter';
import { getOptimizedAvatarUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  MessageSquare, 
  ShieldAlert, 
  ShieldCheck,
  Users, 
  ArrowRight, 
  MessageCircle, 
  LogOut,
  Smile,
  Cat,
  Dog,
  Bird,
  Rabbit,
  Ghost,
  Bot,
  Tv,
  ArrowLeft,
  Lock,
  Phone
, Edit2, Check, X } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  senderType: 'user' | 'admin';
  username: string;
  message: string;
  timestamp: any;
  isEdited?: boolean;
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

const COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-fuchsia-600',
  'bg-pink-600',
  'bg-rose-600',
  'bg-orange-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-cyan-700'
];

export default function HomePage() {

  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [banInfo, setBanInfo] = useState<{ isBanned: boolean; banUntil: number | null }>({ isBanned: false, banUntil: null });
  const [userAvatar, setUserAvatar] = useState<string>('smile');
  const [userColor, setUserColor] = useState<string>('');
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [isCheckingPhone, setIsCheckingPhone] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  
  const [loginStep, setLoginStep] = useState<number>(1);
  
  const [selectedAvatar, setSelectedAvatar] = useState<string>('smile');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const [messageInput, setMessageInput] = useState<string>('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [activeUsersCount, setActiveUsersCount] = useState<number>(0);
  const [isVideotronMode, setIsVideotronMode] = useState<boolean>(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsVideotronMode(new URLSearchParams(window.location.search).get('videotron') === 'true');
    }
  }, []);

  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(true);
  const [isChatEnabled, setIsChatEnabled] = useState<boolean>(true);
  const [maxMessagesPerUser, setMaxMessagesPerUser] = useState<number | null>(null);
  const [userMessageCount, setUserMessageCount] = useState<number>(0);
  const [chatTitle, setChatTitle] = useState<string>('Surabaya Community Live Chat');
  const [chatIcon, setChatIcon] = useState<string>('');
  const [userAvatars, setUserAvatars] = useState<{id: string, url: string}[]>([]);
  const [userAvatarIcon, setUserAvatarIcon] = useState<string>('');
  
  const [isAssetDownloading, setIsAssetDownloading] = useState<boolean>(true);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<string>('Menyiapkan koneksi aman...');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [viewportStyle, setViewportStyle] = useState({ height: '100dvh', top: '0px' });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleViewportChange = () => {
      if (window.innerWidth < 768) {
        setViewportStyle({
          height: `${window.visualViewport!.height}px`,
          top: `${window.visualViewport!.offsetTop}px`
        });
        window.scrollTo(0, 0);
        // Ensure the chat stays scrolled to the bottom when the keyboard opens
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
        }
      } else {
        setViewportStyle({ height: '100dvh', top: '0px' });
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);
    window.visualViewport.addEventListener('scroll', handleViewportChange);
    handleViewportChange();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
    };
  }, []);
  
  // Videotron Auto-scrolling controller
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingUpRef = useRef<boolean>(false);
  const lastMsgCountRef = useRef<number>(0);

  useEffect(() => {
    if (!isVideotronMode) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Helper to start scrolling up smoothly
    const startUpwardScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isScrollingUpRef.current = true;

      // Track precise scroll position as a float for buttery smoothness
      let currentScrollTop = scrollContainer.scrollTop;

      const scrollStep = () => {
        if (!isScrollingUpRef.current || !scrollContainer) return;

        // Only scroll if container is actually scrollable
        if (scrollContainer.scrollHeight > scrollContainer.clientHeight) {
          // Speed of 0.8 pixels per frame (approx. 48px/sec at 60Hz), very readable
          currentScrollTop -= 0.8;
          scrollContainer.scrollTop = currentScrollTop;

          // If reached the top, reset to bottom to loop
          if (scrollContainer.scrollTop <= 1) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
            currentScrollTop = scrollContainer.scrollTop;
          }
        }
        animationFrameRef.current = requestAnimationFrame(scrollStep);
      };

      animationFrameRef.current = requestAnimationFrame(scrollStep);
    };

    // Helper to reset the 10-second idle timer
    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      isScrollingUpRef.current = false;

      // Start 10 seconds timer
      idleTimeoutRef.current = setTimeout(() => {
        startUpwardScroll();
      }, 10000);
    };

    // Helper to scroll to bottom smoothly and quickly
    const scrollToBottomFast = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      isScrollingUpRef.current = false;

      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    };

    const currentCount = messages.length;
    const previousCount = lastMsgCountRef.current;

    if (currentCount > 0) {
      if (previousCount === 0) {
        // Initial messages loading
        lastMsgCountRef.current = currentCount;
        // Scroll to bottom immediately on start
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          resetIdleTimer();
        }, 300);
      } else if (currentCount > previousCount) {
        // New messages arrived! Priority is scrolling to bottom and restarting timer
        lastMsgCountRef.current = currentCount;
        scrollToBottomFast();
        resetIdleTimer();
      } else if (currentCount < previousCount) {
        // Handle message deletion
        lastMsgCountRef.current = currentCount;
      }
    }

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [messages.length, isVideotronMode]);

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

  
  // Hydrate username after mount
  useEffect(() => {
    let savedId = localStorage.getItem('surabaya_chat_user_id');
    if (!savedId) {
      savedId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      localStorage.setItem('surabaya_chat_user_id', savedId);
    }
    setUserId(savedId);

    const savedName = localStorage.getItem('surabaya_chat_username');
    const savedAvatar = localStorage.getItem('surabaya_chat_avatar') || 'smile';
    const savedColor = localStorage.getItem('surabaya_chat_color') || COLORS[Math.floor(Math.random() * COLORS.length)];
    if (savedName) {
      setUsername(savedName);
      setUserAvatar(savedAvatar);
      setUserColor(savedColor);
      setIsNameSet(true);
    } else {
      setSelectedColor(savedColor);
    }
  }, []);

  // Listen to ban status
  useEffect(() => {
    if (!userId) return;
    const banRef = ref(db, `users/${userId}`);
    const unsubscribeBan = onValue(banRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.isBanned) {
          setBanInfo({ isBanned: true, banUntil: data.banUntil });
        } else {
          setBanInfo({ isBanned: false, banUntil: null });
        }
        setUserMessageCount(data.messageCount || 0);
      }
    });

    return () => unsubscribeBan();
  }, [userId]);

  // Update presence
  useEffect(() => {
    if (!isNameSet || !userId || !username) return;

    const userRef = ref(db, `users/${userId}`);
    const updatePresence = async () => {
      try {
        await update(userRef, {
          id: userId,
          phone: phoneInput,
          username,
          avatar: userAvatar,
          color: userColor,
          isOnline: true,
          lastActive: serverTimestamp()
        });
        await onDisconnect(userRef).update({
          isOnline: false,
          lastActive: serverTimestamp()
        });
      } catch (e) {
        console.error("Failed to update presence:", e);
      }
    };
    updatePresence();
  }, [isNameSet, userId, username, userAvatar, userColor]);



  // 3. Real-time Messages Subscription
  useEffect(() => {
    const q = query(
      ref(db, 'global_messages'), 
      orderByChild('timestamp'), 
      limitToLast(150)
    );

    const unsubscribe = onValue(
      q, 
      (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          msgs.push({
            id: childSnapshot.key as string,
            senderType: data.senderType || 'user',
            username: data.username || 'Anonymous',
            message: data.message || '',
            timestamp: data.timestamp,
            isEdited: data.isEdited,
            avatar: data.avatar,
            color: data.color,
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
  }, []);

  // Scroll to bottom whenever messages list changes or visual viewport changes (keyboard toggle)
  useEffect(() => {
    if (isVideotronMode) return;
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isVideotronMode]);

  // 4. Real-time Chat & Filter Enabled State Subscription
  useEffect(() => {
    const filterRef = ref(db, 'chat_filter_enabled');
    const unsubscribeFilter = onValue(filterRef, (snapshot) => {
      const val = snapshot.val();
      const isEnabled = val !== false; // default to true if null/undefined
      setIsFilterEnabled(isEnabled);
      localStorage.setItem('surabaya_cached_chat_filter_enabled', isEnabled.toString());
    });

    const configRef = ref(db, 'chat_config');
    const unsubscribeConfig = onValue(configRef, async (snapshot) => {
      const val = snapshot.val();
      if (val) {
        if (val.title) {
          setChatTitle(val.title);
          localStorage.setItem('surabaya_cached_chat_title', val.title);
        }
        if (val.icon) {
          const optimizedIcon = await getOptimizedAvatarUrl(val.icon);
          setChatIcon(optimizedIcon);
          localStorage.setItem('surabaya_cached_chat_icon', val.icon);
        }
        if (val.userAvatar) setUserAvatarIcon(val.userAvatar);
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
          
          const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem('surabaya_chat_avatar') : null;
          const isStandard = !savedAvatar || ['smile', 'cat', 'dog', 'bird', 'rabbit', 'bot', 'ghost', 'user'].includes(savedAvatar);
          if (avatarsArr.length > 0 && isStandard) {
            setUserAvatar(avatarsArr[0].id);
          }
        } else {
          setUserAvatars([]);
          localStorage.removeItem('surabaya_cached_user_avatars');
        }
      }
    });

    const chatEnabledRef = ref(db, 'chat_enabled');
    const unsubscribeChatEnabled = onValue(chatEnabledRef, (snapshot) => {
      const val = snapshot.val();
      const isEnabled = val !== false; // default to true if null/undefined
      setIsChatEnabled(isEnabled);
      localStorage.setItem('surabaya_cached_chat_enabled', isEnabled.toString());
    });

    const maxMsgsRef = ref(db, 'max_messages_per_user');
    const unsubscribeMaxMsgs = onValue(maxMsgsRef, (snapshot) => {
      const val = snapshot.val();
      setMaxMessagesPerUser(val !== null ? val : null);
    });

    return () => {
      unsubscribeFilter();
      unsubscribeChatEnabled();
      unsubscribeMaxMsgs();
      unsubscribeConfig();
    };
  }, []);

  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginStep === 1) {
      const trimmedPhone = phoneInput.trim();
      if (!trimmedPhone) return;
      if (!/^[0-9+]{9,15}$/.test(trimmedPhone)) {
        alert("Format nomor telepon tidak valid");
        return;
      }
      setIsCheckingPhone(true);
      try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        
        let existingUserKey = null;
        let existingUserData = null;
        
        if (snapshot.exists()) {
          const allUsersData = snapshot.val();
          for (const key of Object.keys(allUsersData)) {
            if (allUsersData[key] && allUsersData[key].phone === trimmedPhone) {
              existingUserKey = key;
              existingUserData = allUsersData[key];
              break;
            }
          }
        }
        
        if (existingUserKey && existingUserData) {
          // User already exists, log them in directly
          setUserId(existingUserKey);
          setUsername(existingUserData.username);
          setUserAvatar(existingUserData.avatar);
          setUserColor(existingUserData.color || selectedColor);
          setIsNameSet(true);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('surabaya_chat_user_id', existingUserKey);
            localStorage.setItem('surabaya_chat_username', existingUserData.username);
            localStorage.setItem('surabaya_chat_avatar', existingUserData.avatar);
            localStorage.setItem('surabaya_chat_color', existingUserData.color || selectedColor);
            localStorage.setItem('surabaya_chat_phone', trimmedPhone);
          }
        } else {
          // New user, move to next step
          setLoginStep(2);
        }
      } catch (error) {
        console.error("Failed to check phone number", error);
        alert("Gagal mengecek nomor telepon, coba lagi.");
      } finally {
        setIsCheckingPhone(false);
      }
    } else if (loginStep === 2) {
      if (!nameInput.trim()) return;
      if (nameInput.trim().length > 30) {
        alert("Nama terlalu panjang (maksimum 30 karakter)");
        return;
      }
      setLoginStep(3);
    } else if (loginStep === 3) {
      handleJoinChat();
    }
  };


  const handleJoinChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    if (trimmedName.length > 30) {
      alert("Nama terlalu panjang (maksimum 30 karakter)");
      return;
    }

    setUsername(trimmedName);
    setUserAvatar(userAvatar);
    setUserColor(selectedColor);
    setIsNameSet(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('surabaya_chat_username', trimmedName);
      localStorage.setItem('surabaya_chat_avatar', userAvatar);
      localStorage.setItem('surabaya_chat_color', selectedColor);
      localStorage.setItem('surabaya_chat_phone', phoneInput);
    }

    // Save to Firebase Realtime Database for new accounts
    const userRef = ref(db, `users/${userId}`);
    set(userRef, {
      username: trimmedName,
      phone: phoneInput.trim(),
      avatar: userAvatar,
      color: selectedColor,
      isBanned: false,
      banUntil: null,
      messageCount: 0,
      createdAt: Date.now()
    }).catch(err => {
      console.error("Gagal menyimpan data pengguna ke database:", err);
    });
  };



  const startEditing = (msg: Message) => {
    if (!msg.timestamp || (Date.now() - msg.timestamp) > 30000) {
      alert("Waktu edit pesan (30 detik) telah habis.");
      return;
    }
    setEditingMessageId(msg.id);
    setEditingMessageContent(msg.message);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingMessageContent('');
  };

  const handleSaveEdit = async (msgId: string) => {
    const trimmed = editingMessageContent.trim();
    if (!trimmed) return;
    if (trimmed.length > 1000) {
      alert("Pesan terlalu panjang (maksimum 1000 karakter)");
      return;
    }

    try {
      const filteredMsg = isFilterEnabled ? filterChatMessage(trimmed) : trimmed;
      await update(ref(db, `global_messages/${msgId}`), {
        message: filteredMsg,
        isEdited: true
      });
      setEditingMessageId(null);
      setEditingMessageContent('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'global_messages');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage || !isChatEnabled) return;

    if (maxMessagesPerUser !== null && userMessageCount >= maxMessagesPerUser) {
      alert(`Anda telah mencapai batas maksimum pengiriman pesan (${maxMessagesPerUser} pesan).`);
      return;
    }

    if (trimmedMessage.length > 1000) {
      alert("Pesan terlalu panjang (maksimum 1000 karakter)");
      return;
    }

    setMessageInput('');

    try {
      // Saring pesan terlebih dahulu sebelum dikirim ke database jika filter aktif
      const filteredMsg = isFilterEnabled ? filterChatMessage(trimmedMessage) : trimmedMessage;
      
      await push(ref(db, 'global_messages'), {
        senderType: 'user',
        username: username,
        message: filteredMsg,
        avatar: userAvatar,
        color: userColor,
        timestamp: serverTimestamp(),
      });
      
      if (userId) {
        await update(ref(db, `users/${userId}`), {
          messageCount: userMessageCount + 1
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'global_messages');
    }
  };

  const handleExitChat = () => {
    setShowExitConfirm(true);
  };

  
  const confirmExitChat = () => {
    setUsername('');
    setPhoneInput('');
    setIsNameSet(false);
    setLoginStep(1);
    setShowExitConfirm(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('surabaya_chat_username');
      localStorage.removeItem('surabaya_chat_avatar');
      localStorage.removeItem('surabaya_chat_color');
      localStorage.removeItem('surabaya_chat_phone');
      localStorage.removeItem('surabaya_chat_user_id');
    }
  };


  const cancelExitChat = () => {
    setShowExitConfirm(false);
  };

  // Format message timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Sambil mengirim...';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentlyBanned = banInfo.isBanned && (banInfo.banUntil === -1 || (banInfo.banUntil !== null && banInfo.banUntil > Date.now()));

  if (isCurrentlyBanned) {
    let banDurationText = "selamanya";
    if (banInfo.banUntil !== -1 && banInfo.banUntil !== null) {
      banDurationText = "sampai " + new Date(banInfo.banUntil).toLocaleString();
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 font-sans text-white p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
            <span className="text-3xl text-red-500">⚠</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-red-400">Akses Diblokir</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Web anda di ban oleh admin {banDurationText}. Anda tidak dapat mengakses ruang obrolan, mengirim pesan, atau melakukan aktivitas apa pun.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <main 
      style={isMobile ? viewportStyle : {}}
      className={`z-10 flex flex-col items-center justify-center p-0 md:p-6 overflow-hidden w-full bg-slate-50 md:bg-transparent ${
        isMobile ? 'fixed inset-x-0' : 'relative min-h-screen'
      }`}
    >
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
                <MessageSquare size={28} className="stroke-[1.75]" />
              </motion.div>

              {/* Text Title */}
              <div className="text-center space-y-1.5">
                <h2 className="text-lg font-black tracking-widest text-indigo-300 uppercase">
                  SURABAYA COMMUNITY
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
            className="w-full max-w-md h-full md:h-auto glass-panel p-6 md:p-8 relative overflow-y-auto max-h-full rounded-none md:rounded-[32px] flex flex-col justify-center"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner overflow-hidden shrink-0">
                {chatIcon ? (
                  <img src={chatIcon} alt="Icon" className="w-full h-full object-cover" />
                ) : (
                  <MessageCircle size={32} className="stroke-[1.75]" />
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {chatTitle}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Bergabung ke Shared Chat Room
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
                
                <div className="flex justify-between items-center mb-6">
                  {loginStep > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setLoginStep(loginStep - 1)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div className="flex gap-2 flex-1 justify-center">
                    {[1, 2, 3].map((step) => (
                      <div 
                        key={step} 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          loginStep === step ? 'w-8 bg-indigo-600' : 
                          loginStep > step ? 'w-4 bg-indigo-300' : 'w-4 bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {loginStep > 1 && <div className="w-9" />} {/* Spacer to balance the back button */}
                </div>

                <AnimatePresence mode="wait">
                  {loginStep === 1 && (
                    <motion.div
                      key="step1_phone"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5 text-left min-h-[160px]"
                    >
                      <label htmlFor="phone-input" className="text-xs font-semibold uppercase tracking-wider text-gray-600 block ml-1">
                        Nomor Telepon
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Phone size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          id="phone-input"
                          type="tel"
                          placeholder="Contoh: 08123456789"
                          required
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          
                          maxLength={15}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-base md:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 ml-1 leading-tight">
                        Nomor telepon digunakan untuk menyimpan dan menghubungkan kembali akun Anda.
                      </p>
                    </motion.div>
                  )}

                  {loginStep === 2 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5 text-left min-h-[160px]"
                    >
                      <label htmlFor="name-input" className="text-xs font-semibold uppercase tracking-wider text-gray-600 block ml-1">
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
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-base md:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                        />
                      </div>
                    </motion.div>
                  )}

                  {loginStep === 3 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5 text-left min-h-[160px]"
                    >
                      <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block ml-1">
                        Pilih Avatar Anda
                      </label>
                      <div className="flex flex-wrap gap-2 justify-center pb-2 max-h-[150px] overflow-y-auto p-1 scrollbar-thin">
                        {userAvatars.length > 0 ? (
                          userAvatars.map((avatar) => {
                            const isSelected = userAvatar === avatar.id;
                            return (
                              <button
                                key={avatar.id}
                                type="button"
                                onClick={() => setUserAvatar(avatar.id)}
                                className={`w-14 h-14 p-0.5 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 ${
                                  isSelected
                                    ? 'bg-indigo-600 border-indigo-600 shadow-md scale-110'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                <img src={avatar.url} alt="Custom Avatar" className="w-full h-full object-cover rounded-lg" />
                              </button>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500 text-center w-full py-4">Belum ada avatar dari admin. Lanjutkan saja.</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <button type="submit" disabled={isCheckingPhone}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all duration-200 group mt-4"
                >
                  {loginStep === 3 ? 'Masuk ke Obrolan' : (isCheckingPhone ? 'Memeriksa...' : 'Lanjut')}
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </form>

              <div className="pt-2 border-t border-gray-200 w-full flex items-center justify-center gap-1.5 text-xs text-gray-500">
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
            className={`w-full flex flex-col overflow-hidden relative transition-all duration-300 ${
              isVideotronMode 
                ? 'fixed inset-0 w-screen h-screen z-40 bg-slate-950 text-white rounded-none border-none' 
                : 'max-w-2xl h-full md:h-[85vh] glass-panel rounded-none md:rounded-[32px]'
            }`}
          >
            {/* Main Header */}
            <header className={`px-6 py-4 border-b flex items-center justify-between transition-colors duration-200 ${
              isVideotronMode 
                ? 'border-slate-800 bg-slate-900/95 text-white' 
                : 'border-gray-200 bg-gray-50/50 text-gray-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${
                  isVideotronMode 
                    ? 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300' 
                    : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                }`}>
                  {chatIcon ? (
                    <img src={chatIcon} alt="Icon" className="w-full h-full object-cover" />
                  ) : (
                    <MessageSquare size={20} className="stroke-[2]" />
                  )}
                </div>
                <div>
                  <h2 className={`font-bold tracking-wide ${
                    'text-sm md:text-base'
                  }`}>
                    {chatTitle}
                  </h2>
                  <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs mt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-indicator inline-block" />
                      <span className={'text-gray-500 font-medium'}>
                        {activeUsersCount} Anggota Aktif
                      </span>
                    </div>
                    <span className={'text-gray-300'}>•</span>
                    {isFilterEnabled ? (
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        isVideotronMode 
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' 
                          : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      }`}>
                        <ShieldCheck size={10} className="stroke-[2.5]" />
                        Filter Aktif
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        isVideotronMode 
                          ? 'bg-rose-950/40 border-rose-800 text-rose-400' 
                          : 'bg-rose-50 border-rose-100 text-rose-700'
                      }`}>
                        <ShieldAlert size={10} className="stroke-[2.5]" />
                        Sensor Off
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">

                <button
                  onClick={handleExitChat}
                  title="Keluar dari Obrolan"
                  className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs cursor-pointer ${
                    isVideotronMode 
                      ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                  }`}
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            </header>

            {/* Chat Messages Area */}
            <div 
              ref={scrollContainerRef}
              className={`flex-1 overflow-y-auto transition-colors duration-300 ${
                isVideotronMode 
                  ? 'p-8 space-y-6 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800' 
                  : 'p-6 space-y-4 bg-transparent'
              }`}
            >
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <p className="text-xs text-gray-500 tracking-wider">Memuat pesan real-time...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-2 text-center max-w-xs mx-auto">
                  <MessageCircle size={36} className="text-gray-600 stroke-[1.5]" />
                  <p className="text-sm font-semibold text-gray-400">Belum ada obrolan</p>
                  <p className="text-xs text-gray-500">Mulai kirimkan pesan pertama Anda ke forum!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.username === username && msg.senderType === 'user';
                  const isAdminMsg = msg.senderType === 'admin';
                  
                  const selectedCustomAvatar = userAvatars.find(a => a.id === msg.avatar);
                  const fallbackAvatarDef = AVATARS.find(a => a.id === msg.avatar) || AVATARS[0];
                  const AvatarIcon = fallbackAvatarDef.icon;
                  
                  let bubbleColor = msg.color || 'bg-indigo-600';
                  // Boost contrast from -500 to -600/700
                  if (bubbleColor.endsWith('-500')) {
                    bubbleColor = bubbleColor.replace('-500', '-600');
                  }
                  
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 ${isMe ? 'flex-row-reverse items-end' : 'flex-row items-end'} ${
                        ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className={`rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                        isVideotronMode 
                          ? 'w-12 h-12 border border-slate-800' 
                          : 'w-10 h-10'
                      } ${
                        isAdminMsg 
                          ? 'bg-amber-500 text-white' 
                          : selectedCustomAvatar 
                            ? 'bg-transparent border-none' 
                            : `${bubbleColor} text-white`
                      }`}>
                        {isAdminMsg ? (
                          <ShieldAlert size={18} />
                        ) : selectedCustomAvatar ? (
                          <img src={selectedCustomAvatar.url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <AvatarIcon size={18} />
                        )}
                      </div>

                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                        {/* Name Label */}
                        {!isMe && (
                          <div className={`font-semibold mb-1.5 ml-1 flex flex-wrap items-center gap-2 ${
                            isVideotronMode 
                              ? 'text-sm md:text-base text-slate-300' 
                              : 'text-xs text-gray-600'
                          }`}>
                            <span>{msg.username}</span>
                            {isAdminMsg && (
                              <span className={`rounded-full uppercase tracking-wider ${
                                isVideotronMode 
                                  ? 'px-3 py-1 text-xs md:text-sm font-black bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/25' 
                                  : 'px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-700 border border-amber-300'
                              }`}>
                                ADMIN
                              </span>
                            )}
                          </div>
                        )}
                        
                        {isMe && (
                          <div className={`mb-1.5 mr-1 flex items-center gap-2 ${
                            isVideotronMode 
                              ? 'text-sm md:text-base text-slate-400' 
                              : 'text-[10px] text-gray-500'
                          }`}>
                            <span>Anda</span>
                          </div>
                        )}

                        {/* Chat Bubble */}
                        <div className="relative group w-full">
                          {editingMessageId === msg.id ? (
                            <div className="bg-white rounded-xl border-2 border-indigo-500 shadow-lg p-2.5 flex flex-col gap-2">
                              <textarea
                                value={editingMessageContent}
                                onChange={(e) => setEditingMessageContent(e.target.value)}
                                
                                className="w-full text-base md:text-sm text-gray-900 border-none focus:outline-none focus:ring-0 resize-none rounded-lg bg-gray-50 p-2"
                                rows={3}
                                maxLength={1000}
                                autoFocus
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center"
                                >
                                  <X size={14} className="mr-1" /> Batal
                                </button>
                                <button
                                  onClick={() => handleSaveEdit(msg.id)}
                                  disabled={!editingMessageContent.trim()}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
                                >
                                  <Check size={14} className="mr-1" /> Simpan
                                </button>
                              </div>
                            </div>
                          ) : (
                          <>
                          <div
                            className={`transition-all duration-200 shadow-sm relative ${
                              isAdminMsg
                                ? isVideotronMode
                                  ? 'bg-amber-950/80 text-amber-200 border border-amber-800 rounded-2xl px-8 py-5 text-xl md:text-2xl lg:text-3xl font-extrabold shadow-lg'
                                  : 'bg-amber-100 text-amber-950 border border-amber-200 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-inner'
                                : `text-white ${bubbleColor} ${
                                    isMe 
                                      ? 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm' 
                                      : 'rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm'
                                  } ${
                                    isVideotronMode 
                                      ? 'px-8 py-5 text-xl md:text-2xl lg:text-3xl font-bold tracking-normal leading-relaxed border border-white/5 shadow-lg' 
                                      : 'px-4 py-2.5 text-sm'
                                  }`
                            }`}
                          >
                            <p className="break-words whitespace-pre-wrap leading-relaxed">
                              {msg.message}
                            </p>
                            <div 
                              className={`select-none text-right ${
                                isVideotronMode 
                                  ? 'text-xs text-white/60 font-mono mt-2' 
                                  : isAdminMsg
                                    ? 'text-[10px] text-amber-800 font-bold mt-1'
                                    : 'text-[9px] text-white/70 mt-1'
                              }`}
                            >
                              {msg.isEdited && <span className="mr-1 italic opacity-75">(diedit)</span>}
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                          
                          {/* Edit Button */}
                          {isMe && msg.timestamp && (currentTime - msg.timestamp) <= 30000 && !isVideotronMode && (
                            <button
                              onClick={() => startEditing(msg)}
                              className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 bg-white text-gray-500 rounded-full shadow hover:text-indigo-600 hover:bg-gray-50 transition-all z-10"
                              title="Edit Pesan"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <footer className={`p-4 border-t transition-colors duration-300 ${
              isVideotronMode 
                ? 'border-slate-800 bg-slate-900/95' 
                : 'border-gray-200 bg-white'
            }`}>
              {isChatEnabled ? (
                maxMessagesPerUser !== null && userMessageCount >= maxMessagesPerUser ? (
                  <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${
                    isVideotronMode 
                      ? 'bg-red-950/40 border-red-900/50 text-red-400' 
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    <ShieldAlert size={16} />
                    <span className="text-sm font-medium text-center">
                      Anda telah mencapai batas maksimum pesan harian ({maxMessagesPerUser} pesan).
                    </span>
                  </div>
                ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2.5">
                  <input
                    type="text"
                    required
                    maxLength={1000}
                    placeholder={(maxMessagesPerUser !== null && userMessageCount >= maxMessagesPerUser) ? `Batas pesan harian tercapai` : `Menulis sebagai ${username}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    
                    className={`flex-1 rounded-xl transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${
                      isVideotronMode 
                        ? 'px-6 py-3.5 bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-base' 
                        : 'px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-base md:text-sm'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={(!messageInput.trim() || !isChatEnabled || (maxMessagesPerUser !== null && userMessageCount >= maxMessagesPerUser))}
                    className={`bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl shadow-md transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer ${
                      'p-3'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </form>
                )
              ) : (
                <div className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border ${
                  isVideotronMode 
                    ? 'bg-slate-900/50 border-slate-800 text-slate-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}>
                  <Lock size={18} className={isVideotronMode ? 'text-slate-500' : 'text-gray-400'} />
                  <span className={`text-sm font-medium ${isVideotronMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    Obrolan ditutup. Hanya admin yang dapat mengirim pesan.
                  </span>
                </div>
              )}
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExitConfirm && (
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
              className="w-full max-w-sm glass-panel p-6 relative overflow-hidden flex flex-col items-center text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                <LogOut size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Keluar dari Obrolan?</h3>
                <p className="text-sm text-gray-500 mt-1">Anda akan meninggalkan ruang obrolan saat ini. Apakah Anda yakin?</p>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={cancelExitChat}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={confirmExitChat}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md shadow-red-600/20 transition-colors text-sm"
                >
                  Ya, Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

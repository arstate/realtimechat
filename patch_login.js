const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

const handleLoginSubmit = `
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
        const q = query(usersRef, orderByChild('phone'), equalTo(trimmedPhone));
        const snapshot = await get(q);
        
        if (snapshot.exists()) {
          // User already exists, log them in directly
          const data = snapshot.val();
          const userIdKey = Object.keys(data)[0];
          const userData = data[userIdKey];
          
          setUserId(userIdKey);
          setUsername(userData.username);
          setUserAvatar(userData.avatar);
          setUserColor(userData.color);
          setUserDomicile(userData.domicile);
          setIsNameSet(true);
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('surabaya_chat_user_id', userIdKey);
            localStorage.setItem('surabaya_chat_username', userData.username);
            localStorage.setItem('surabaya_chat_avatar', userData.avatar);
            localStorage.setItem('surabaya_chat_color', userData.color);
            localStorage.setItem('surabaya_chat_domicile', userData.domicile);
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
      setLoginStep(4);
    } else if (loginStep === 4) {
      handleJoinChat();
    }
  };
`;

code = code.replace('  return (', handleLoginSubmit + '\n  return (');
fs.writeFileSync('app/chat-app.tsx', code);

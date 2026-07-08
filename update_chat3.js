const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

// Update onValue
code = code.replace(
  "timestamp: data.timestamp,\n          });",
  "timestamp: data.timestamp,\n            avatar: data.avatar,\n            color: data.color,\n          });"
);

// Update handleJoinChat
const newJoin = `
  const handleJoinChat = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) return;

    if (trimmedName.length > 30) {
      alert("Nama terlalu panjang (maksimum 30 karakter)");
      return;
    }

    setUsername(trimmedName);
    setUserAvatar(selectedAvatar);
    setUserColor(selectedColor);
    setIsNameSet(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('surabaya_chat_username', trimmedName);
      localStorage.setItem('surabaya_chat_avatar', selectedAvatar);
      localStorage.setItem('surabaya_chat_color', selectedColor);
    }
  };
`;
code = code.replace(
  /const handleJoinChat =[\s\S]*?localStorage\.setItem\('surabaya_chat_username', trimmedName\);\n    }\n  };/,
  newJoin
);

// Update handleSendMessage
const newSend = `
      await push(ref(db, 'global_messages'), {
        senderType: 'user',
        username: username,
        message: trimmedMessage,
        avatar: userAvatar,
        color: userColor,
        timestamp: serverTimestamp(),
      });
`;
code = code.replace(
  /await push\(ref\(db, 'global_messages'\), \{\n        senderType: 'user',\n        username: username,\n        message: trimmedMessage,\n        timestamp: serverTimestamp\(\),\n      \}\);/,
  newSend
);

// Update confirmExitChat
const newExit = `
  const confirmExitChat = () => {
    setUsername('');
    setIsNameSet(false);
    setShowExitConfirm(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('surabaya_chat_username');
      localStorage.removeItem('surabaya_chat_avatar');
      localStorage.removeItem('surabaya_chat_color');
    }
  };
`;
code = code.replace(
  /const confirmExitChat = \(\) => \{\n    setUsername\(''\);\n    setIsNameSet\(false\);\n    setShowExitConfirm\(false\);\n    if \(typeof window !== 'undefined'\) \{\n      localStorage\.removeItem\('surabaya_chat_username'\);\n    \}\n  \};/,
  newExit
);

fs.writeFileSync('app/chat-app.tsx', code);

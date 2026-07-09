const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

const sendFunction = `  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage || !isChatEnabled) return;

    if (maxMessagesPerUser !== null && userMessageCount >= maxMessagesPerUser) {
      alert(\`Anda telah mencapai batas maksimum pengiriman pesan (\${maxMessagesPerUser} pesan).\`);
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
        domicile: userDomicile,
        timestamp: serverTimestamp(),
      });
      
      if (userId) {
        await update(ref(db, \`users/\${userId}\`), {
          messageCount: userMessageCount + 1
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'global_messages');
    }
  };`;

code = code.replace(/  const handleSendMessage = async \(e: React\.FormEvent\) => \{[\s\S]*?  \};\n\n  const handleExitChat = \(\) => \{/, sendFunction + "\n\n  const handleExitChat = () => {");

// We should also disable the input and button if limit is reached
const disableCondition = `(!messageInput.trim() || !isChatEnabled || (maxMessagesPerUser !== null && userMessageCount >= maxMessagesPerUser))`;
code = code.replace("disabled={!messageInput.trim() || !isChatEnabled}", "disabled={" + disableCondition + "}");

const placeholder = `placeholder={\`Menulis sebagai \${username}...\`}`;
const newPlaceholder = `placeholder={(maxMessagesPerUser !== null && userMessageCount >= maxMessagesPerUser) ? \`Batas pesan harian tercapai\` : \`Menulis sebagai \${username}...\`}`;
code = code.replace(placeholder, newPlaceholder);
code = code.replace("disabled={!messageInput.trim() || !isChatEnabled}", "disabled={" + disableCondition + "}");

fs.writeFileSync('app/chat-app.tsx', code);

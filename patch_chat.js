const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

// Add states
const newStates = `  const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(true);
  const [isChatEnabled, setIsChatEnabled] = useState<boolean>(true);
  const [maxMessagesPerUser, setMaxMessagesPerUser] = useState<number | null>(null);
  const [userMessageCount, setUserMessageCount] = useState<number>(0);`;
code = code.replace("  const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(true);\n  const [isChatEnabled, setIsChatEnabled] = useState<boolean>(true);", newStates);

// Update ban listener to also fetch messageCount
const banListener = `    const unsubscribeBan = onValue(banRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.isBanned) {
          setBanInfo({ isBanned: true, banUntil: data.banUntil });
        } else {
          setBanInfo({ isBanned: false, banUntil: null });
        }
        setUserMessageCount(data.messageCount || 0);
      }
    });`;
code = code.replace(/    const unsubscribeBan = onValue\(banRef, \(snapshot\) => \{[\s\S]*?    \}\);/, banListener);

// Update initialization to set message count to 0 in new users
const newUserSetup = `      domicile: userDomicile,
      isBanned: false,
      banUntil: null,
      messageCount: 0,
      createdAt: Date.now()`;
code = code.replace(/      domicile: userDomicile,\n      isBanned: false,\n      banUntil: null,\n      createdAt: Date.now\(\)/, newUserSetup);


// Add global listener for max_messages_per_user
const globalListener = `    const chatEnabledRef = ref(db, 'chat_enabled');
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
    });`;
code = code.replace(/    const chatEnabledRef = ref\(db, 'chat_enabled'\);\n    const unsubscribeChatEnabled = onValue\(chatEnabledRef, \(snapshot\) => \{[\s\S]*?    \}\);/, globalListener);

const cleanup = `      unsubscribeChatEnabled();
      unsubscribeMaxMsgs();`;
code = code.replace("      unsubscribeChatEnabled();", cleanup);

fs.writeFileSync('app/chat-app.tsx', code);

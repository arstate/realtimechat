const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

code = code.replace(
  "const [userColor, setUserColor] = useState<string>('bg-indigo-500');",
  "const [userColor, setUserColor] = useState<string>('');"
);
code = code.replace(
  "const [selectedColor, setSelectedColor] = useState<string>('bg-indigo-500');",
  "const [selectedColor, setSelectedColor] = useState<string>('');"
);

// We need to initialize selectedColor properly on load
const hydrateReplace = `
  // Hydrate username after mount
  useEffect(() => {
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
`;

code = code.replace(
  /\/\/ Hydrate username after mount[\s\S]*?\}, \[\]\);/,
  hydrateReplace
);

fs.writeFileSync('app/chat-app.tsx', code);

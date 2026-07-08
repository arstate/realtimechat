const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

const newStates = `
  const [username, setUsername] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string>('smile');
  const [userColor, setUserColor] = useState<string>('bg-indigo-500');
  const [isNameSet, setIsNameSet] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('smile');
  const [selectedColor, setSelectedColor] = useState<string>('bg-indigo-500');
`;

code = code.replace(
  "  const [username, setUsername] = useState<string>('');\n  const [isNameSet, setIsNameSet] = useState<boolean>(false);\n  const [nameInput, setNameInput] = useState<string>('');",
  newStates
);

const newHydrate = `
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
      setSelectedColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
  }, []);
`;

code = code.replace(
  "  // Hydrate username after mount\n  useEffect(() => {\n    const savedName = localStorage.getItem('surabaya_chat_username');\n    if (savedName) {\n      setUsername(savedName);\n      setIsNameSet(true);\n    }\n  }, []);",
  newHydrate
);

fs.writeFileSync('app/chat-app.tsx', code);

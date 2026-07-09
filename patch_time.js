const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

const timeEffect = `
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);
`;

code = code.replace(
  "  const [isLoading, setIsLoading] = useState<boolean>(true);",
  "  const [isLoading, setIsLoading] = useState<boolean>(true);" + timeEffect
);

code = code.replace(
  "className=\"absolute -left-10 top-1/2 -translate-y-1/2 p-2 bg-white text-gray-500 rounded-full shadow hover:text-indigo-600 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 z-10\"",
  "className=\"absolute -left-10 top-1/2 -translate-y-1/2 p-2 bg-white text-gray-500 rounded-full shadow hover:text-indigo-600 hover:bg-gray-50 transition-all z-10\""
);

code = code.replace(
  "{isMe && msg.timestamp && (Date.now() - msg.timestamp) <= 30000 && !isVideotronMode && (",
  "{isMe && msg.timestamp && (currentTime - msg.timestamp) <= 30000 && !isVideotronMode && ("
);

fs.writeFileSync('app/chat-app.tsx', code);

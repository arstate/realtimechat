const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "LogOut } from 'lucide-react';",
  "LogOut,\n  Smile,\n  Cat,\n  Dog,\n  Bird,\n  Rabbit,\n  Ghost,\n  Bot\n} from 'lucide-react';"
);

// 2. Add interface properties
code = code.replace(
  "timestamp: any;\n}",
  "timestamp: any;\n  avatar?: string;\n  color?: string;\n}"
);

// 3. Add constants before component
const constants = `
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
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500'
];

export default function HomePage() {
`;
code = code.replace("export default function HomePage() {", constants);

fs.writeFileSync('app/chat-app.tsx', code);

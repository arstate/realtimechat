const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

const stateVars = `  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState<string>('');`;

code = code.replace(
  "const [messageInput, setMessageInput] = useState<string>('');",
  "const [messageInput, setMessageInput] = useState<string>('');\n" + stateVars
);

fs.writeFileSync('app/chat-app.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

code = code.replace(
  "const bubbleColor = isMe ? (userColor || 'bg-indigo-600') : (msg.color || 'bg-gray-500');",
  "const bubbleColor = msg.color || 'bg-indigo-500';"
);

fs.writeFileSync('app/chat-app.tsx', code);

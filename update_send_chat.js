const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

// Add import for filter
code = code.replace(
  "import { db, handleFirestoreError, OperationType } from '@/lib/firebase';",
  "import { db, handleFirestoreError, OperationType } from '@/lib/firebase';\nimport { filterChatMessage } from '@/lib/chatFilter';"
);

// Apply filter before sending
const sendFunc = `
    setMessageInput('');

    try {
      // Apply chat filter here
      const filteredMessage = filterChatMessage(trimmedMessage);

      await push(ref(db, 'global_messages'), {
        senderType: 'user',
        username: username,
        message: filteredMessage,
        avatar: userAvatar,
`;

code = code.replace(
  /setMessageInput\(''\);\n\n    try \{\n      await push\(ref\(db, 'global_messages'\), \{\n        senderType: 'user',\n        username: username,\n        message: trimmedMessage,\n        avatar: userAvatar,/,
  sendFunc
);

fs.writeFileSync('app/chat-app.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

code = code.replace(
  "LogOut } from 'lucide-react';",
  "LogOut, Smile, Cat, Dog, Bird, Rabbit, Ghost, Bot } from 'lucide-react';"
);

fs.writeFileSync('app/chat-app.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

code = code.replace(
  "LogOut \n} from 'lucide-react';",
  "LogOut,\n  Smile,\n  Cat,\n  Dog,\n  Bird,\n  Rabbit,\n  Ghost,\n  Bot\n} from 'lucide-react';"
);

fs.writeFileSync('app/chat-app.tsx', code);

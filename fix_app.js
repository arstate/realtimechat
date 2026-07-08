const fs = require('fs');
let content = fs.readFileSync('app/chat-app.tsx', 'utf8');
if (content.includes('next/document')) {
  console.log("Found in chat-app.tsx!");
} else {
  console.log("Not found in chat-app.tsx");
}

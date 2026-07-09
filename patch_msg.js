const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

code = code.replace(
  "timestamp: any;\n  avatar?: string;",
  "timestamp: any;\n  isEdited?: boolean;\n  avatar?: string;"
);

// find where msgs.push happens:
code = code.replace(
  "timestamp: data.timestamp,\n            avatar: data.avatar,",
  "timestamp: data.timestamp,\n            isEdited: data.isEdited,\n            avatar: data.avatar,"
);

fs.writeFileSync('app/chat-app.tsx', code);

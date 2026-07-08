const fs = require('fs');

try {
  const content = fs.readFileSync('app/page.tsx', 'utf8');
  console.log("page.tsx:");
  console.log(content);
} catch (e) { console.log(e); }

try {
  const content = fs.readFileSync('app/layout.tsx', 'utf8');
  console.log("\nlayout.tsx:");
  console.log(content);
} catch (e) { console.log(e); }

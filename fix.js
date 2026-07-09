const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

const regex = /  const handleLoginSubmit = async \[\s\S\]*?};\n  return \(\) => {/m;
// I will just use string replacement because regex can be tricky.

const extract = code.substring(code.indexOf('  const handleLoginSubmit = async'), code.indexOf('  return () => {', code.indexOf('  const handleLoginSubmit = async')));
code = code.replace(extract, '');
// Now find the real place to put it: above `const handleJoinChat = `
code = code.replace('  const handleJoinChat =', extract + '\n  const handleJoinChat =');

fs.writeFileSync('app/chat-app.tsx', code);

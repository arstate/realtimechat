// Wait, I see error says `.next/server/chunks/611.js:6:1351`
// Let's examine `.next/server/chunks/611.js` to see what file it originated from.
const fs = require('fs');
if (fs.existsSync('.next/server/chunks/611.js')) {
    const lines = fs.readFileSync('.next/server/chunks/611.js', 'utf8').split('\n');
    console.log(lines.slice(0, 5).join('\n'));
} else {
    console.log("Chunk not found");
}

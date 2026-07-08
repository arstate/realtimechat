const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

// The error message is coming from next core during prerendering.
// This often happens if we have a file in the wrong directory or something named weirdly.
// Wait! Let's check `pages` directory again.

try {
  const p = fs.readdirSync('pages');
  console.log("Pages directory: ", p);
} catch (e) {}

try {
  const p = fs.readdirSync('src/pages');
  console.log("src/Pages directory: ", p);
} catch (e) {}


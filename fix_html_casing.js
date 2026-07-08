const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');
if (layout.includes('<HTML')) {
   layout = layout.replace(/<HTML/g, '<html');
   layout = layout.replace(/<\/HTML>/g, '</html>');
   fs.writeFileSync('app/layout.tsx', layout);
}

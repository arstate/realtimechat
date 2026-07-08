const fs = require('fs');

// Check all files for ANY import that might be bringing in Html
function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        scan(`${dir}/${file}`);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let code = fs.readFileSync(`${dir}/${file}`, 'utf8');
      if (code.includes('Html')) {
        console.log(`Found Html in ${dir}/${file}`);
      }
    }
  }
}

scan('.');

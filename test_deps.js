const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Delete everything related to node_modules and Next internals, then do a clean install
console.log("Deps:", pkg.dependencies);
console.log("Dev Deps:", pkg.devDependencies);

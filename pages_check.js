const fs = require('fs');
if (fs.existsSync('pages')) {
  console.log("Pages directory exists!");
  const files = fs.readdirSync('pages');
  console.log(files);
} else {
  console.log("No pages directory.");
}

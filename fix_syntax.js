const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

code = code.replace(
  "                          ) : (\n                          <div\n                            className={`transition-all",
  "                          ) : (\n                          <>\n                          <div\n                            className={`transition-all"
);

code = code.replace(
  "                            </button>\n                          )}\n                          )}\n                        </div>",
  "                            </button>\n                          )}\n                          </>\n                          )}\n                        </div>"
);

fs.writeFileSync('app/chat-app.tsx', code);

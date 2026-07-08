const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

const oldIcon = `<div className={\`w-10 h-10 rounded-xl flex items-center justify-center \${
                  isVideotronMode 
                    ? 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300' 
                    : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                }\`}>
                  <MessageSquare size={20} className="stroke-[2]" />
                </div>`;

const newIcon = `<div className={\`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 \${
                  isVideotronMode 
                    ? 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300' 
                    : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                }\`}>
                  {chatIcon ? (
                    <img src={chatIcon} alt="Icon" className="w-full h-full object-cover" />
                  ) : (
                    <MessageSquare size={20} className="stroke-[2]" />
                  )}
                </div>`;

code = code.replace(oldIcon, newIcon);

fs.writeFileSync('app/chat-app.tsx', code);

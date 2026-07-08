const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

const oldIcon = `<div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <MessageCircle size={32} className="stroke-[1.75]" />
              </div>`;

const newIcon = `<div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner overflow-hidden shrink-0">
                {chatIcon ? (
                  <img src={chatIcon} alt="Icon" className="w-full h-full object-cover" />
                ) : (
                  <MessageCircle size={32} className="stroke-[1.75]" />
                )}
              </div>`;

code = code.replace(oldIcon, newIcon);

fs.writeFileSync('app/chat-app.tsx', code);

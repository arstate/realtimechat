const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

const oldInputStart = `              {isChatEnabled ? (
                <form onSubmit={handleSendMessage} className="flex gap-2.5">`;

const newInputStart = `              {isChatEnabled ? (
                maxMessagesPerUser !== null && userMessageCount >= maxMessagesPerUser ? (
                  <div className={\`flex items-center justify-center gap-2 p-3 rounded-xl border \${
                    isVideotronMode 
                      ? 'bg-red-950/40 border-red-900/50 text-red-400' 
                      : 'bg-red-50 border-red-200 text-red-600'
                  }\`}>
                    <ShieldAlert size={16} />
                    <span className="text-sm font-medium text-center">
                      Anda telah mencapai batas maksimum pesan harian ({maxMessagesPerUser} pesan).
                    </span>
                  </div>
                ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2.5">`;

if (code.includes(oldInputStart)) {
  code = code.replace(oldInputStart, newInputStart);
} else {
  console.log("Could not find oldInputStart");
}

const oldInputEnd = `                  </button>
                </form>
              ) : (
                <div className={\`flex items-center gap-3 p-3 md:p-4 rounded-xl border \${`;

const newInputEnd = `                  </button>
                </form>
                )
              ) : (
                <div className={\`flex items-center gap-3 p-3 md:p-4 rounded-xl border \${`;

if (code.includes(oldInputEnd)) {
  code = code.replace(oldInputEnd, newInputEnd);
} else {
  console.log("Could not find oldInputEnd");
}

fs.writeFileSync('app/chat-app.tsx', code);

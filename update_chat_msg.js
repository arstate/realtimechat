const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

const newRender = `
                messages.map((msg, index) => {
                  const isMe = msg.username === username && msg.senderType === 'user';
                  const isAdminMsg = msg.senderType === 'admin';
                  
                  const avatarDef = AVATARS.find(a => a.id === msg.avatar) || AVATARS[0];
                  const AvatarIcon = avatarDef.icon;
                  const bubbleColor = isMe ? (userColor || 'bg-indigo-600') : (msg.color || 'bg-gray-500');
                  
                  return (
                    <div
                      key={msg.id || index}
                      className={\`flex gap-2.5 \${isMe ? 'flex-row-reverse items-end' : 'flex-row items-end'}\`}
                    >
                      {/* Avatar */}
                      <div className={\`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white shadow-sm \${isAdminMsg ? 'bg-amber-500' : bubbleColor}\`}>
                        {isAdminMsg ? <ShieldAlert size={16} /> : <AvatarIcon size={16} />}
                      </div>

                      <div className={\`flex flex-col \${isMe ? 'items-end' : 'items-start'} max-w-[80%]\`}>
                        {/* Name Label */}
                        {!isMe && (
                          <span className="text-xs font-semibold text-gray-600 mb-1 ml-1 flex items-center gap-1">
                            {msg.username}
                            {isAdminMsg && (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-700 border border-amber-300 uppercase tracking-wider">
                                ADMIN
                              </span>
                            )}
                          </span>
                        )}
                        
                        {isMe && (
                          <span className="text-[10px] text-gray-500 mb-1 mr-1">
                            Anda
                          </span>
                        )}

                        {/* Chat Bubble */}
                        <div className="relative group">
                          <div
                            className={\`px-4 py-2.5 text-sm text-white \${
                              isAdminMsg
                                ? 'bg-amber-100 text-amber-900 border border-amber-200 rounded-xl'
                                : \`\${bubbleColor} \${isMe ? 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm' : 'rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm'} shadow-sm\`
                            }\`}
                          >
                            <p className="break-words whitespace-pre-wrap leading-relaxed">
                              {msg.message}
                            </p>
                            <div 
                              className={\`text-[9px] mt-1 text-right select-none \${
                                isAdminMsg ? 'text-amber-700/60' : 'text-white/70'
                              }\`}
                            >
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
`;

code = code.replace(/messages\.map\(\(msg, index\) => \{[\s\S]*?\}\)[\s\n]*\)\}[\s\n]*<div ref=\{messagesEndRef\} \/>/, newRender + '              )}\n              <div ref={messagesEndRef} />');

fs.writeFileSync('app/chat-app.tsx', code);

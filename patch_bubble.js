const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

const startEditFunction = `  const startEditing = (msg: Message) => {
    if (!msg.timestamp || (Date.now() - msg.timestamp) > 30000) {
      alert("Waktu edit pesan (30 detik) telah habis.");
      return;
    }
    setEditingMessageId(msg.id);
    setEditingMessageContent(msg.message);
  };`;
code = code.replace(/  const startEditing = \(msg: Message\) => \{[\s\S]*?  \};/, startEditFunction);

const oldBubbleStart = `{/* Chat Bubble */}
                        <div className="relative group w-full">
                          <div
                            className={\`transition-all duration-200 shadow-sm \${`;

const newBubbleStart = `{/* Chat Bubble */}
                        <div className="relative group w-full">
                          {editingMessageId === msg.id ? (
                            <div className="bg-white rounded-xl border-2 border-indigo-500 shadow-lg p-2.5 flex flex-col gap-2">
                              <textarea
                                value={editingMessageContent}
                                onChange={(e) => setEditingMessageContent(e.target.value)}
                                className="w-full text-sm text-gray-900 border-none focus:outline-none focus:ring-0 resize-none rounded-lg bg-gray-50 p-2"
                                rows={3}
                                maxLength={1000}
                                autoFocus
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center"
                                >
                                  <X size={14} className="mr-1" /> Batal
                                </button>
                                <button
                                  onClick={() => handleSaveEdit(msg.id)}
                                  disabled={!editingMessageContent.trim()}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center"
                                >
                                  <Check size={14} className="mr-1" /> Simpan
                                </button>
                              </div>
                            </div>
                          ) : (
                          <div
                            className={\`transition-all duration-200 shadow-sm relative \${`;

if (code.includes(oldBubbleStart)) {
  code = code.replace(oldBubbleStart, newBubbleStart);
} else {
  console.log("Could not find oldBubbleStart");
}

const oldBubbleEnd = `                            <div 
                              className={\`select-none text-right \${
                                isVideotronMode 
                                  ? 'text-xs text-white/60 font-mono mt-2' 
                                  : isAdminMsg
                                    ? 'text-[10px] text-amber-800 font-bold mt-1'
                                    : 'text-[9px] text-white/70 mt-1'
                              }\`}
                            >
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>`;

const newBubbleEnd = `                            <div 
                              className={\`select-none text-right \${
                                isVideotronMode 
                                  ? 'text-xs text-white/60 font-mono mt-2' 
                                  : isAdminMsg
                                    ? 'text-[10px] text-amber-800 font-bold mt-1'
                                    : 'text-[9px] text-white/70 mt-1'
                              }\`}
                            >
                              {msg.isEdited && <span className="mr-1 italic opacity-75">(diedit)</span>}
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                          
                          {/* Edit Button */}
                          {isMe && msg.timestamp && (Date.now() - msg.timestamp) <= 30000 && !isVideotronMode && (
                            <button
                              onClick={() => startEditing(msg)}
                              className="absolute -left-10 top-1/2 -translate-y-1/2 p-2 bg-white text-gray-500 rounded-full shadow hover:text-indigo-600 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 z-10"
                              title="Edit Pesan"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          )}
                        </div>`;

if (code.includes(oldBubbleEnd)) {
  code = code.replace(oldBubbleEnd, newBubbleEnd);
} else {
  console.log("Could not find oldBubbleEnd");
}

fs.writeFileSync('app/chat-app.tsx', code);

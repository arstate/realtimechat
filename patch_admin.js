const fs = require('fs');
let code = fs.readFileSync('app/admin/admin-panel.tsx', 'utf-8');

const stateVar = `  const [isChatEnabled, setIsChatEnabled] = useState<boolean>(true);
  const [maxMessagesPerUser, setMaxMessagesPerUser] = useState<number | null>(null);
  const [draftMaxMessages, setDraftMaxMessages] = useState<string>('');`;

code = code.replace("  const [isChatEnabled, setIsChatEnabled] = useState<boolean>(true);", stateVar);

const dbSub = `    const unsubscribeChatEnabled = onValue(chatEnabledRef, (snapshot) => {
      const val = snapshot.val();
      const isEnabled = val !== false;
      setIsChatEnabled(isEnabled); // default to true if null/undefined
      localStorage.setItem('surabaya_cached_chat_enabled', isEnabled.toString());
    });

    const maxMessagesRef = ref(db, 'max_messages_per_user');
    const unsubscribeMaxMessages = onValue(maxMessagesRef, (snapshot) => {
      const val = snapshot.val();
      setMaxMessagesPerUser(val !== null ? val : null);
      if (val !== null) setDraftMaxMessages(val.toString());
      else setDraftMaxMessages('');
    });`;

code = code.replace(/    const unsubscribeChatEnabled = onValue\(chatEnabledRef, \(snapshot\) => \{[\s\S]*?\}\);/, dbSub);

const unsubCleanup = `unsubscribeChatEnabled();\n      unsubscribeMaxMessages();`;
code = code.replace("unsubscribeChatEnabled();", unsubCleanup);

const updateHandler = `  // Toggle chat enabled handler
  const toggleChatEnabled = async () => {
    const newValue = !isChatEnabled;
    setIsChatEnabled(newValue);
    try {
      await set(ref(db, 'chat_enabled'), newValue);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'chat_enabled');
    }
  };

  const handleUpdateMaxMessages = async () => {
    try {
      const val = draftMaxMessages.trim() === '' ? null : parseInt(draftMaxMessages, 10);
      if (val !== null && isNaN(val)) {
        alert("Masukkan angka yang valid");
        return;
      }
      await set(ref(db, 'max_messages_per_user'), val);
      alert("Pengaturan batas pesan berhasil disimpan");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'max_messages_per_user');
    }
  };`;

code = code.replace(/  \/\/ Toggle chat enabled handler[\s\S]*?  \};/, updateHandler);

const uiHtml = `                    {/* Filter Chat Toggle Switch */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-gray-800">Filter Kata Kasar</span>
                        <span className="text-[10px] text-gray-500 leading-tight">Sensor otomatis kata tidak pantas</span>
                      </div>
                      <button
                        onClick={toggleFilterEnabled}
                        type="button"
                        className={\`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none \${
                          isFilterEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                        }\`}
                      >
                        <span
                          className={\`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out \${
                            isFilterEnabled ? 'translate-x-5' : 'translate-x-0'
                          }\`}
                        />
                      </button>
                    </div>
                    
                    {/* Max Messages Per User */}
                    <div className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-200 gap-2">
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-gray-800">Batas Pesan Per User</span>
                        <span className="text-[10px] text-gray-500 leading-tight">Maksimal pesan yang bisa dikirim oleh satu akun. Kosongkan untuk tanpa batas.</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={draftMaxMessages}
                          onChange={(e) => setDraftMaxMessages(e.target.value)}
                          placeholder="Contoh: 1, 5, 10"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          onClick={handleUpdateMaxMessages}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>`;

code = code.replace(/                    \{\/\* Filter Chat Toggle Switch \*\/\}[\s\S]*?<\/button>\n                    <\/div>/, uiHtml);

fs.writeFileSync('app/admin/admin-panel.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('app/admin/admin-panel.tsx', 'utf-8');

const oldHtml = `<div className="flex gap-2">
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
                      </div>`;

const newHtml = `<div className="relative flex items-center">
                        <input
                          type="number"
                          value={draftMaxMessages}
                          onChange={(e) => setDraftMaxMessages(e.target.value)}
                          placeholder="Contoh: 1, 5, 10"
                          className="w-full border border-gray-200 rounded-lg pl-3 pr-20 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                        />
                        <button
                          onClick={handleUpdateMaxMessages}
                          className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold rounded-md transition-colors flex items-center justify-center"
                        >
                          Simpan
                        </button>
                      </div>`;

if (code.includes(oldHtml)) {
  code = code.replace(oldHtml, newHtml);
  fs.writeFileSync('app/admin/admin-panel.tsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find target HTML");
}

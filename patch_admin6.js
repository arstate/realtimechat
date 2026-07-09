const fs = require('fs');
let code = fs.readFileSync('./app/admin/admin-panel.tsx', 'utf8');

const replacement = `
                    <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                      <button
                        onClick={() => setAdminView('videotron')}
                        className={\`w-full py-2.5 px-3 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer \${
                          adminView === 'videotron'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 text-indigo-700 shadow-sm'
                        }\`}
                      >
                        <Tv size={14} />
                        Videotron Manager
                      </button>
                    </div>
`;

code = code.replace(
  /<div className="p-3 bg-indigo-50\/50 rounded-2xl border border-indigo-100">[\s\S]*?<\/div>/,
  replacement
);

fs.writeFileSync('./app/admin/admin-panel.tsx', code);

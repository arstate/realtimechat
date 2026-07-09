const fs = require('fs');
let code = fs.readFileSync('./app/admin/admin-panel.tsx', 'utf8');

const replacement = `
              </section>
            ) : adminView === 'videotron' ? (
              <section className="flex-1 flex flex-col h-[calc(100vh-280px)] md:h-screen bg-gray-50/50 overflow-y-auto">
                <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                      <Tv size={18} />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900 tracking-wide text-sm md:text-base">
                        Videotron Views Manager
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Kelola berbagai tampilan untuk monitor/videotron yang berbeda
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateViewModal(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} /> Create New View
                  </button>
                </header>

                <div className="p-6">
                  {videotronViews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                      <Tv size={32} className="mx-auto text-gray-400 mb-3" />
                      <h3 className="text-sm font-semibold text-gray-900">Belum ada view khusus</h3>
                      <p className="text-xs text-gray-500 mt-1">Buat view baru untuk mengatur layout terpisah.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videotronViews.map((view) => (
                        <div key={view.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col shadow-sm">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{view.name}</h3>
                          <p className="text-xs text-gray-500 font-mono mb-4 break-all bg-gray-50 p-2 rounded">
                            {typeof window !== 'undefined' ? \`\${window.location.origin}/admin/preview-\${view.id}\` : \`/admin/preview-\${view.id}\`}
                          </p>
                          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setActiveVideotronViewId(view.id);
                                setShowVideotronPreview(true);
                              }}
                              className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                            >
                              Edit Layout
                            </button>
                            <button
                              onClick={async () => {
                                const newId = \`view_\${Date.now()}\`;
                                await set(ref(db, \`videotron_views/\${newId}\`), {
                                  name: \`\${view.name} (Copy)\`,
                                  config: view.config || {}
                                });
                              }}
                              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition-colors"
                              title="Duplikat View"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Hapus view ini?')) {
                                  await remove(ref(db, \`videotron_views/\${view.id}\`));
                                }
                              }}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                              title="Hapus View"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Default Videotron View */}
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Default View</h3>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row items-center justify-between shadow-sm">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">Global Default</h3>
                        <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded inline-block">
                          {typeof window !== 'undefined' ? \`\${window.location.origin}/?videotron=true\` : \`/?videotron=true\`}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveVideotronViewId(null);
                          setShowVideotronPreview(true);
                        }}
                        className="mt-4 sm:mt-0 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                      >
                        Edit Default Layout
                      </button>
                    </div>
                  </div>
                </div>

                {/* Create View Modal */}
                <AnimatePresence>
                  {showCreateViewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Create New View</h3>
                        <p className="text-sm text-gray-500 mb-4">Buat profil layout videotron baru dengan link preview terpisah.</p>
                        
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama View</label>
                        <input
                          type="text"
                          value={newViewName}
                          onChange={(e) => setNewViewName(e.target.value)}
                          placeholder="Misal: Main Stage Left"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none mb-6 text-gray-900"
                          autoFocus
                        />
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setShowCreateViewModal(false);
                              setNewViewName('');
                            }}
                            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                          >
                            Batal
                          </button>
                          <button
                            onClick={async () => {
                              if (!newViewName.trim()) return;
                              const newId = \`view_\${Date.now()}\`;
                              
                              // Create view with current default config as starting point
                              let initialConfig = {};
                              if (lastVideotronConfigRef.current) {
                                initialConfig = { ...lastVideotronConfigRef.current };
                              }
                              
                              await set(ref(db, \`videotron_views/\${newId}\`), {
                                name: newViewName.trim(),
                                config: initialConfig
                              });
                              
                              setNewViewName('');
                              setShowCreateViewModal(false);
                            }}
                            className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors"
                          >
                            Create View
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </section>
            ) : (
`;

code = code.replace(
  "              </section>\n            ) : (\n              <section className=\"flex-1 flex flex-col h-[calc(100vh-280px)] md:h-screen bg-gray-50/50\">",
  replacement
);

fs.writeFileSync('./app/admin/admin-panel.tsx', code);

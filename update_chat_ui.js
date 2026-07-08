const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

const newUI = `
                <div className="space-y-1.5 text-left pt-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block ml-1">
                    Pilih Avatar Anda
                  </label>
                  <div className="flex flex-wrap gap-2 justify-center pb-2">
                    {AVATARS.map((avatar) => {
                      const Icon = avatar.icon;
                      return (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar.id)}
                          className={\`p-2.5 rounded-xl border transition-all duration-200 \${
                            selectedAvatar === avatar.id
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-600 shadow-sm scale-110'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }\`}
                        >
                          <Icon size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block ml-1">
                    Warna Tema Anda
                  </label>
                  <div className="flex flex-wrap gap-2 justify-center pb-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={\`w-6 h-6 rounded-full \${color} transition-all duration-200 \${
                          selectedColor === color
                            ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                            : 'opacity-80 hover:opacity-100 hover:scale-110'
                        }\`}
                      />
                    ))}
                  </div>
                </div>

                <button
`;

code = code.replace("                <button", newUI);

fs.writeFileSync('app/chat-app.tsx', code);

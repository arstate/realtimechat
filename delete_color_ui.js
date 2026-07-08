const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

const target = `
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
`;

code = code.replace(target, '');
fs.writeFileSync('app/chat-app.tsx', code);

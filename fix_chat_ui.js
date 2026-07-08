const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf8');

const target = `                <button
                  type="submit"`;

const replacement = `{userAvatars.length > 0 && (
                  <div className="space-y-1.5 text-left pt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 block ml-1">
                      Pilih Avatar Anda
                    </label>
                    <div className="flex flex-wrap gap-2 justify-center pb-2">
                      {userAvatars.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => setUserAvatar(avatar.id)}
                          className={\`w-12 h-12 p-1 rounded-xl border transition-all duration-200 flex items-center justify-center \${
                            userAvatar === avatar.id
                              ? 'bg-indigo-50 border-indigo-500 shadow-sm scale-110'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }\`}
                        >
                          <img src={avatar.url} alt="Avatar Option" className="w-full h-full object-cover rounded-lg" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"`;

code = code.replace(target, replacement);

fs.writeFileSync('app/chat-app.tsx', code);

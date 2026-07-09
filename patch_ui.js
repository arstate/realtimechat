const fs = require('fs');
let code = fs.readFileSync('app/chat-app.tsx', 'utf-8');

// Replace onSubmit
code = code.replace(/<form onSubmit={\(e\) => {[\s\S]*?className="w-full space-y-4">/, '<form onSubmit={handleLoginSubmit} className="w-full space-y-4">');

// Update step dots
code = code.replace(/\{\[1, 2, 3\]\.map\(\(step\) => \(/, '{[1, 2, 3, 4].map((step) => (');

// We need to shift steps from 1,2,3 to 2,3,4.
// Step 1: name -> Step 2
// Step 2: avatar -> Step 3
// Step 3: domicile -> Step 4

code = code.replace('{loginStep === 3 && (', '{loginStep === 4 && (');
code = code.replace('{loginStep === 2 && (', '{loginStep === 3 && (');
code = code.replace('{loginStep === 1 && (', '{loginStep === 2 && (');

// Add the new Step 1
const step1_content = `
                  {loginStep === 1 && (
                    <motion.div
                      key="step1_phone"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5 text-left min-h-[160px]"
                    >
                      <label htmlFor="phone-input" className="text-xs font-semibold uppercase tracking-wider text-gray-600 block ml-1">
                        Nomor Telepon
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                          id="phone-input"
                          type="tel"
                          placeholder="Contoh: 08123456789"
                          required
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          maxLength={15}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 ml-1 leading-tight">
                        Nomor telepon digunakan untuk menyimpan dan menghubungkan kembali akun Anda.
                      </p>
                    </motion.div>
                  )}
`;

code = code.replace('<AnimatePresence mode="wait">', '<AnimatePresence mode="wait">' + step1_content);

// Update button text logic
code = code.replace("{loginStep === 3 ? 'Masuk ke Obrolan' : 'Lanjut'}", "{loginStep === 4 ? 'Masuk ke Obrolan' : (isCheckingPhone ? 'Memeriksa...' : 'Lanjut')}");
code = code.replace(/<button\s*type="submit"/, '<button type="submit" disabled={isCheckingPhone}');

fs.writeFileSync('app/chat-app.tsx', code);

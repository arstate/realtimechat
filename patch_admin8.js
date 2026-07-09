const fs = require('fs');
let code = fs.readFileSync('./app/admin/admin-panel.tsx', 'utf8');

code = code.replace(
  "              </section>\n            ) : (\n              {/* Chat Area Header */}",
  "              </section>\n            ) : (\n              <section className=\"flex-1 flex flex-col h-[calc(100vh-280px)] md:h-screen bg-gray-50/50\">\n              {/* Chat Area Header */}"
);

fs.writeFileSync('./app/admin/admin-panel.tsx', code);

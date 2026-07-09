const fs = require('fs');
let code = fs.readFileSync('./app/admin/admin-panel.tsx', 'utf8');

code = code.replace(
  "onClick={() => setShowVideotronPreview(true)}",
  "onClick={() => setAdminView('videotron')}"
);

fs.writeFileSync('./app/admin/admin-panel.tsx', code);

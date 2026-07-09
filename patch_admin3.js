const fs = require('fs');
let code = fs.readFileSync('./app/admin/admin-panel.tsx', 'utf8');

code = code.replace(
  "await set(ref(db, 'videotron_config'), currentConfig);",
  "await set(ref(db, activeVideotronViewId ? `videotron_views/${activeVideotronViewId}/config` : 'videotron_config'), currentConfig);"
);

fs.writeFileSync('./app/admin/admin-panel.tsx', code);

const fs = require('fs');

let c1 = fs.readFileSync('app/chat-app.tsx', 'utf8');
c1 = c1.replace(/from 'motion'/g, "from 'framer-motion'");
c1 = c1.replace(/from "motion"/g, "from 'framer-motion'");
fs.writeFileSync('app/chat-app.tsx', c1);

let c2 = fs.readFileSync('app/admin/admin-panel.tsx', 'utf8');
c2 = c2.replace(/from 'motion'/g, "from 'framer-motion'");
c2 = c2.replace(/from "motion"/g, "from 'framer-motion'");
fs.writeFileSync('app/admin/admin-panel.tsx', c2);


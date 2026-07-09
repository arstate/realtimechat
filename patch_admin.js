const fs = require('fs');
let code = fs.readFileSync('./app/admin/admin-panel.tsx', 'utf8');

// Insert initial preview check
const insertPos = code.indexOf('// 2. Real-time Messages Listener (Only for logged-in admins)');
if (insertPos !== -1) {
    const snippet = `
  // 1b. Auto-open preview if initialPreviewId is set
  useEffect(() => {
    if (isAdminLoggedIn && initialPreviewId) {
      setShowVideotronPreview(true);
    }
  }, [isAdminLoggedIn, initialPreviewId]);
  
`;
    code = code.slice(0, insertPos) + snippet + code.slice(insertPos);
}

fs.writeFileSync('./app/admin/admin-panel.tsx', code);

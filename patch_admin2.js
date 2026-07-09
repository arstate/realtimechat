const fs = require('fs');
let code = fs.readFileSync('./app/admin/admin-panel.tsx', 'utf8');

code = code.replace(
  "const configRef = ref(db, 'videotron_config');",
  "const configRef = ref(db, activeVideotronViewId ? `videotron_views/${activeVideotronViewId}/config` : 'videotron_config');"
);
code = code.replace(
  "// 4. Real-time Videotron Config Listener\n  useEffect(() => {",
  "// 4. Real-time Videotron Config Listener\n  useEffect(() => {\n    if (!isAdminLoggedIn) return;"
);
// Make sure activeVideotronViewId is in the dependency array
code = code.replace(
  "}, []); // Fetch videotron config once",
  "}, [isAdminLoggedIn, activeVideotronViewId]); // Fetch videotron config when view changes"
);
// Also need to fetch videotronViews
const viewsHook = `
  // Fetch Videotron Views
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const viewsRef = ref(db, 'videotron_views');
    const unsubscribe = onValue(viewsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const viewsList = Object.keys(val).map(key => ({
          id: key,
          name: val[key].name || 'Unnamed View',
          config: val[key].config
        }));
        setVideotronViews(viewsList);
      } else {
        setVideotronViews([]);
      }
    });
    return () => unsubscribe();
  }, [isAdminLoggedIn]);
`;
const insertPos2 = code.indexOf('// 4. Real-time Videotron Config Listener');
if (insertPos2 !== -1) {
  code = code.slice(0, insertPos2) + viewsHook + code.slice(insertPos2);
}

fs.writeFileSync('./app/admin/admin-panel.tsx', code);

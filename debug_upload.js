const fs = require('fs');
let code = fs.readFileSync('app/admin/admin-panel.tsx', 'utf8');

const target = `const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      try {
        const newAvatarRef = push(ref(db, 'chat_config/userAvatars'));
        await set(newAvatarRef, base64String);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, 'chat_config/userAvatars');
      } finally {
        setIsUploadingAvatar(false);
      }
    };`;

const newTarget = `const reader = new FileReader();
    reader.onload = async (event) => {
      console.log('Reader loaded.');
      const base64String = event.target?.result as string;
      try {
        console.log('Pushing to RTDB...');
        const newAvatarRef = push(ref(db, 'chat_config/userAvatars'));
        await set(newAvatarRef, base64String);
        console.log('Push successful!', newAvatarRef.key);
      } catch (error) {
        console.error('Error uploading:', error);
        handleFirestoreError(error, OperationType.UPDATE, 'chat_config/userAvatars');
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    reader.onerror = (e) => {
      console.error('FileReader error:', e);
      setIsUploadingAvatar(false);
    };`;

code = code.replace(target, newTarget);
fs.writeFileSync('app/admin/admin-panel.tsx', code);

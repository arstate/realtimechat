const fs = require('fs');
let code = fs.readFileSync('app/admin/admin-panel.tsx', 'utf8');

const target = `const reader = new FileReader();
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
    };
    reader.readAsDataURL(file);
    // clear input
    e.target.value = '';`;

const newTarget = `const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        
        try {
          const newAvatarRef = push(ref(db, 'chat_config/userAvatars'));
          await set(newAvatarRef, compressedBase64);
        } catch (error) {
          console.error('Error uploading:', error);
          alert('Gagal mengupload avatar.');
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (e) => {
      console.error('FileReader error:', e);
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';`;

code = code.replace(target, newTarget);
fs.writeFileSync('app/admin/admin-panel.tsx', code);

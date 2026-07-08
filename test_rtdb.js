const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, set } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyCpP2BC6sirSyLenHOxDlfsnbw5P9811v0",
  authDomain: "livechat-2bbb5.firebaseapp.com",
  databaseURL: "https://livechat-2bbb5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "livechat-2bbb5",
  storageBucket: "livechat-2bbb5.firebasestorage.app",
  messagingSenderId: "33456186528",
  appId: "1:33456186528:web:95d1d6bda34582792bd5c5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function run() {
  try {
    const newRef = push(ref(db, 'chat_config/userAvatars'));
    await set(newRef, "test_base64");
    console.log("Success");
  } catch (e) {
    console.error("Error", e);
  }
  process.exit(0);
}
run();

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

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
export const db = getDatabase(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firebase Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

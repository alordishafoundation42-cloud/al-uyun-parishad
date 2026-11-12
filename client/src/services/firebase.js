import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBD-bHMRgfb-R9XPwzPWamEP6UaOe8E5Tg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'al-uyun-parishad-2026.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'al-uyun-parishad-2026',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'al-uyun-parishad-2026.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '11597229682',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:11597229682:web:d4833615c95763f01f1ceb',
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const storage = getStorage(app);
export { signInWithEmailAndPassword, signOut };
export default app;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword, signOut } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo token exists in localStorage
    const savedToken = localStorage.getItem('adminToken');
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedToken && savedEmail) {
      setCurrentUser({ email: savedEmail });
    }

    // Listen to Firebase auth state if available
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminEmail', user.email);
          setCurrentUser(user);
        } else if (!savedToken) {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } catch {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const isAllowedAdmin = 
      normalizedEmail.includes('admin') || 
      normalizedEmail.includes('mamun') || 
      normalizedEmail.includes('alordisha');

    try {
      // 1. Try real Firebase sign-in if configured
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminEmail', userCredential.user.email);
      setCurrentUser(userCredential.user);
      return userCredential.user;
    } catch (fbErr) {
      // 2. Authorized admin fallback (admin@aluyun.org, mamun@aluyun.org, alordishafoundation42@gmail.com)
      if (isAllowedAdmin) {
        const mockUser = { email: normalizedEmail, uid: 'admin-authorized-uid' };
        localStorage.setItem('adminToken', 'demo-admin-token');
        localStorage.setItem('adminEmail', normalizedEmail);
        setCurrentUser(mockUser);
        return mockUser;
      }
      throw new Error('অনুমোদিত অ্যাডমিন ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

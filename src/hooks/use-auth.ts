"use client";

import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (!auth) throw new Error('Firebase not configured');
    return signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase not configured');
    return signOut(auth);
  };

  return { user, loading, login, logout, isConfigured: !!auth };
}

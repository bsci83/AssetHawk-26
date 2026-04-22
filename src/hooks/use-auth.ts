/**
 * Auth hook - Turso-backed, no NextAuth dependency
 */
"use client";

import { useState, useEffect } from "react";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  displayName?: string;
  photoURL?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUser({
          ...data.user,
          displayName: `${data.user.firstName} ${data.user.lastName}`,
        });
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async () => {
    window.location.href = "/assethawk/signin";
  };

  const logout = async () => {
    localStorage.removeItem('assethawk_user');
    setUser(null);
    window.location.href = "/assethawk/signin";
  };

  return { 
    user, 
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isConfigured: true, // Turso always configured for AssetHawk
  };
}

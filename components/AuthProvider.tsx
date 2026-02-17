'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authClient } from '@/lib/jwt-client';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  signIn: (formData: any) => Promise<any>;
  signOut: () => Promise<any>;
  signUp: (formData: any) => Promise<any>;
  useSession: () => any;
  session: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(() => {
    const currentSession = authClient.getSession();
    setSession(currentSession);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const signIn = async (formData: any) => {
    const result = await authClient.signIn(formData);
    if (result && !result.error) {
      refreshSession();
    }
    return result;
  };

  const signUp = async (formData: any) => {
    return await authClient.signUp(formData);
  };

  const signOut = async () => {
    const result = await authClient.signOut();
    setSession(null);
    return result;
  };

  // Set up automatic token refresh and security checks
  useEffect(() => {
    const interval = setInterval(async () => {
      if (session?.data) {
        const now = Date.now() / 1000;
        const expiryThreshold = 300; // 5 minutes before expiry

        if (session.data.expiresAt && (session.data.expiresAt - now) < expiryThreshold) {
          try {
            await authClient.refreshToken();
            refreshSession();
          } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, force logout
            signOut();
            toast.error('Session expired. Please sign in again.');
          }
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [session, refreshSession, signOut]);

  // Security: Listen for storage changes to detect if token was changed in another tab
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        refreshSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshSession]);

  const value = {
    signIn,
    signOut,
    signUp,
    useSession: () => session, // Provides the reactive session state
    session,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
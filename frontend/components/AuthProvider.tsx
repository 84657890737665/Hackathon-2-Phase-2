'use client';

import { createContext, useContext, useEffect } from 'react';
import { authClient } from '@/lib/jwt-client';

interface AuthContextType {
  signIn: typeof authClient.signIn;
  signOut: typeof authClient.signOut;
  useSession: typeof authClient.useSession;
  signUp: typeof authClient.signUp;
  refreshToken: typeof authClient.refreshToken;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Set up automatic token refresh
  useEffect(() => {
    const interval = setInterval(async () => {
      const session = authClient.useSession();

      // If session exists but is expired (or close to expiry), refresh it
      if (session?.data) {
        const now = Date.now() / 1000; // Current time in seconds
        const expiryThreshold = 300; // 5 minutes before expiry

        if (session.data.expiresAt && (session.data.expiresAt - now) < expiryThreshold) {
          await authClient.refreshToken();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={authClient}>
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
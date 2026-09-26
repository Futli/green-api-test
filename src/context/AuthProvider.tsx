import { useState, useCallback, type ReactNode } from 'react';
import { AuthContext } from './authContext.ts';
import type { Credentials } from '../types/greenApi.ts';

const STORAGE_KEY = 'green-api-credentials';

function loadCredentials(): Credentials | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Credentials) : null;
  } catch {
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [credentials, setCredentials] = useState<Credentials | null>(loadCredentials);

  const login = useCallback((creds: Credentials) => {
    const trimmed: Credentials = {
      idInstance: creds.idInstance.trim(),
      apiTokenInstance: creds.apiTokenInstance.trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    setCredentials(trimmed);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCredentials(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        credentials,
        isAuthenticated: Boolean(credentials),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
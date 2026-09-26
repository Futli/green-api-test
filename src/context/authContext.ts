import { createContext } from 'react';
import type { Credentials } from 'types/greenApi.ts';

export interface AuthContextValue {
  credentials: Credentials | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '../context/authContext.ts';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return ctx;
}
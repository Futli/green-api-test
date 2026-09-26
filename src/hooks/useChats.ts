import { useContext } from 'react';
import { ChatsContext, type ChatsContextValue } from '../context/chatsContext.ts';

export function useChats(): ChatsContextValue {
  const ctx = useContext(ChatsContext);
  if (!ctx) throw new Error('useChats должен использоваться внутри ChatsProvider');
  return ctx;
}
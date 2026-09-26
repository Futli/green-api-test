import { createContext } from 'react';
import type { Chat, Message } from 'types/chat.ts';

export interface ChatsContextValue {
  chats: Record<string, Chat>;
  activeChatId: string | null;
  setActiveChatId: (chatId: string) => void;
  upsertChat: (chatId: string, title: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  receiveIncomingMessage: (params: { chatId: string; text: string; title?: string }) => void;
}

export const ChatsContext = createContext<ChatsContextValue | null>(null);
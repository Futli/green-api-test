import { useState, useCallback, type ReactNode } from 'react';
import { ChatsContext } from './chatsContext';
import type { Chat, Message } from 'types/chat.ts';

interface ChatsProviderProps {
  children: ReactNode;
}

export function ChatsProvider({ children }: ChatsProviderProps) {
  const [chats, setChats] = useState<Record<string, Chat>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const upsertChat = useCallback((chatId: string, title: string) => {
    setChats((prev) => {
      if (prev[chatId]) return prev;
      return { ...prev, [chatId]: { chatId, title: title || chatId, messages: [] } };
    });
  }, []);

  const addMessage = useCallback((chatId: string, message: Message) => {
    setChats((prev) => {
      const chat = prev[chatId] ?? { chatId, title: chatId, messages: [] };
      return { ...prev, [chatId]: { ...chat, messages: [...chat.messages, message] } };
    });
  }, []);

  const receiveIncomingMessage = useCallback(
    ({ chatId, text, title }: { chatId: string; text: string; title?: string }) => {
      setChats((prev) => {
        const chat = prev[chatId] ?? { chatId, title: title ?? chatId, messages: [] };
        const incoming: Message = {
          id: `${Date.now()}-in`,
          text,
          fromMe: false,
          timestamp: Date.now(),
        };
        return {
          ...prev,
          [chatId]: {
            ...chat,
            title: chat.title || title || chatId,
            messages: [...chat.messages, incoming],
          },
        };
      });
    },
    [],
  );

  return (
    <ChatsContext.Provider
      value={{ chats, activeChatId, setActiveChatId, upsertChat, addMessage, receiveIncomingMessage }}
    >
      {children}
    </ChatsContext.Provider>
  );
}
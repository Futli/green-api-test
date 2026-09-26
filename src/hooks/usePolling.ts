import { useEffect, useRef } from 'react';
import { receiveNotification, deleteNotification } from 'api/greenApi.ts';
import type { Credentials, IncomingTextMessageBody } from 'types/greenApi.ts';

type IncomingMessageHandler = (params: { chatId: string; text: string; title?: string }) => void;

function isIncomingTextMessage(body: unknown): body is IncomingTextMessageBody {
  const candidate = body as IncomingTextMessageBody;
  return (
    candidate?.typeWebhook === 'incomingMessageReceived' &&
    candidate?.messageData?.typeMessage === 'textMessage'
  );
}

export function usePolling(credentials: Credentials | null, onIncomingMessage: IncomingMessageHandler): void {
  const callbackRef = useRef(onIncomingMessage);

  useEffect(() => {
    callbackRef.current = onIncomingMessage;
  }, [onIncomingMessage]);

  useEffect(() => {
    if (!credentials) return;
    const creds = credentials;

    let cancelled = false;

    async function loop() {
      while (!cancelled) {
        try {
          const notification = await receiveNotification(creds, 20);

          if (cancelled) break; // эффект успел размонтироваться, пока ждали ответ
          if (!notification) continue; //нет новых уведомлений

          const { receiptId, body } = notification;

          if (isIncomingTextMessage(body)) {
            const chatId = body.senderData.chatId;
            const text = body.messageData.textMessageData?.textMessage;
            const title = body.senderData.chatName ?? body.senderData.senderName;

            if (chatId && text) {
              callbackRef.current({ chatId, text, title });
            }
          }

          await deleteNotification(creds, receiptId);
        } catch (err) {
          console.error('Ошибка получения уведомлений:', err);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }

    loop();

    return () => {
      cancelled = true;
    };
  }, [credentials]);
}
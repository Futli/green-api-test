import { useState, type FormEvent } from 'react';
import { useAuth, useChats } from '../hooks';
import { sendMessage } from 'api/greenApi.ts';

interface MessageInputProps {
  chatId: string;
}

export default function MessageInput({ chatId }: MessageInputProps) {
  const { credentials } = useAuth();
  const { addMessage } = useChats();

  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending || !credentials) return;

    setSending(true);
    setError('');

    try {
      await sendMessage(credentials, chatId, trimmed);
      addMessage(chatId, { id: `${Date.now()}-out`, text: trimmed, fromMe: true, timestamp: Date.now() });
      setText('');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Не удалось отправить сообщение';
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="message-input-wrap" onSubmit={handleSubmit}>
      {error && <div className="message-input-error">{error}</div>}
      <div className="message-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать сообщение..."
          disabled={sending}
        />
        <button type="submit" disabled={sending || !text.trim()}>Отправить</button>
      </div>
    </form>
  );
}
import { useState, type FormEvent } from 'react';
import { useAuth, useChats } from '../hooks';
import { checkAccount, sanitizePhoneInput } from 'api/greenApi.ts';

interface NewChatModalProps {
  onClose: () => void;
}

export default function NewChatModal({ onClose }: NewChatModalProps) {
  const { credentials } = useAuth();
  const { upsertChat, setActiveChatId } = useChats();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!credentials) return;

    let digits: string;
    try {
      digits = sanitizePhoneInput(phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Некорректный номер');
      return;
    }

    setLoading(true);

    try {
      const result = await checkAccount(credentials, digits);

      if (!result.exist || !result.chatId) {
        setError('На этом номере нет аккаунта Telegram');
        return;
      }

      upsertChat(result.chatId, result.username || `+${digits}`);
      setActiveChatId(result.chatId);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Не удалось проверить номер');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Новый чат</h2>
        <input
          type="text"
          placeholder="+7 999 123-45-67"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
          autoFocus
        />
        {error && <div className="auth-error">{error}</div>}
        <div className="modal-actions">
          <button type="button" onClick={onClose} disabled={loading}>Отмена</button>
          <button type="submit" disabled={loading}>{loading ? 'Проверка...' : 'Создать'}</button>
        </div>
      </form>
    </div>
  );
}
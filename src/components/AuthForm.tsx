import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { getAccountSettings, setSettings } from '../api/greenApi.ts';

export default function AuthForm() {
  const { login } = useAuth();

  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const trimmedId = idInstance.trim();
    const trimmedToken = apiTokenInstance.trim();

    if (!trimmedId || !trimmedToken) {
      setError('Заполните оба поля');
      return;
    }

    setLoading(true);

    try {
      const data = await getAccountSettings({
        idInstance: trimmedId,
        apiTokenInstance: trimmedToken,
      });

      if (data.stateInstance !== 'authorized') {
        setError(
          `Инстанс не авторизован (статус: ${data.stateInstance}). Отсканируйте QR-код в личном кабинете GREEN-API.`,
        );
        return;
      }

      await setSettings({ idInstance: trimmedId, apiTokenInstance: trimmedToken });

      login({ idInstance: trimmedId, apiTokenInstance: trimmedToken });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Не удалось подключиться';
      setError(message || 'Не удалось подключиться. Проверьте idInstance / apiTokenInstance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Вход</h1>
        <p className="auth-hint">Введите данные вашего инстанса GREEN-API</p>

       
          <input
            type="text"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="idInstance"
            disabled={loading}
          />

          
          <input
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            placeholder="apiTokenInstance"
            disabled={loading}
          />

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Проверка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
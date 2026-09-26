import type {
  Credentials,
  AccountSettingsResponse,
  CheckAccountResponse,
  SendMessageResponse,
  ReceiveNotificationResponse,
  DeleteNotificationResponse,
} from '../types/greenApi.ts';

const API_URL = 'https://4100.api.green-api.com';

function buildBase({ idInstance }: Pick<Credentials, 'idInstance'>): string {
  return `${API_URL}/waInstance${idInstance}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T & { message?: string; error?: string }) : (null as T);

  if (!res.ok) {
    const message = (data as { message?: string; error?: string })?.message
      ?? (data as { message?: string; error?: string })?.error
      ?? `GREEN-API вернул ошибку ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function getAccountSettings(credentials: Credentials): Promise<AccountSettingsResponse> {
  const url = `${buildBase(credentials)}/getAccountSettings/${credentials.apiTokenInstance}`;
  const res = await fetch(url);
  return handleResponse<AccountSettingsResponse>(res);
}

export async function setSettings(credentials: Credentials): Promise<unknown> {
  const url = `${buildBase(credentials)}/setSettings/${credentials.apiTokenInstance}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      webhookUrl: '',
      outgoingWebhook: 'yes',
      stateWebhook: 'yes',
      incomingWebhook: 'yes',
    }),
  });
  return handleResponse<unknown>(res);
}

export async function checkAccount(
  credentials: Credentials,
  phoneDigits: string,
): Promise<CheckAccountResponse> {
  const url = `${buildBase(credentials)}/checkAccount/${credentials.apiTokenInstance}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber: Number(phoneDigits) }),
  });
  return handleResponse<CheckAccountResponse>(res);
}

export async function sendMessage(
  credentials: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const url = `${buildBase(credentials)}/sendMessage/${credentials.apiTokenInstance}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  });
  return handleResponse<SendMessageResponse>(res);
}

export async function receiveNotification(
  credentials: Credentials,
  receiveTimeout = 20,
): Promise<ReceiveNotificationResponse | null> {
  const url = `${buildBase(credentials)}/receiveNotification/${credentials.apiTokenInstance}?receiveTimeout=${receiveTimeout}`;
  const res = await fetch(url);

  if (res.status === 408) {
    return null; // нет новых уведомлений
  }

  return handleResponse<ReceiveNotificationResponse | null>(res);
}

export async function deleteNotification(
  credentials: Credentials,
  receiptId: number,
): Promise<DeleteNotificationResponse> {
  const url = `${buildBase(credentials)}/deleteNotification/${credentials.apiTokenInstance}/${receiptId}`;
  const res = await fetch(url, { method: 'DELETE' });
  return handleResponse<DeleteNotificationResponse>(res);
}

export function sanitizePhoneInput(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) {
    throw new Error('Введите номер телефона');
  }
  return digits;
}
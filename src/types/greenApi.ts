export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export type StateInstance =
  | 'notAuthorized'
  | 'authorized'
  | 'blocked'
  | 'suspended'
  | 'starting'
  | 'pendingPassword';

export interface AccountSettingsResponse {
  stateInstance: StateInstance;
  suspendedUntil?: number; 
  [key: string]: unknown;
}

export interface CheckAccountResponse {
  exist: boolean;
  chatId?: string;
  username?: string;
  phoneNumber?: number;
  fromCache?: boolean;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface DeleteNotificationResponse {
  result: boolean;
}

export interface IncomingTextMessageBody {
  typeWebhook: 'incomingMessageReceived';
  senderData: {
    chatId: string;
    chatName?: string;
    senderName?: string;
  };
  messageData: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
  };
}

export interface OtherNotificationBody {
  typeWebhook: string;
  [key: string]: unknown;
}

export type NotificationBody = IncomingTextMessageBody | OtherNotificationBody;

export interface ReceiveNotificationResponse {
  receiptId: number;
  body: NotificationBody;
}
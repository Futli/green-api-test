import { useAuth, useChats } from '../hooks';
import MessageList from './MessageList.tsx';
import MessageInput from './MessageInput.tsx';

export default function ChatWindow() {
  const { logout } = useAuth();
  const { chats, activeChatId } = useChats();
  const chat = activeChatId ? chats[activeChatId] : null;

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <span>{chat ? chat.title : 'Выберите чат'}</span>
        <button className="logout-button" onClick={logout}>Выйти</button>
      </div>

      {chat ? (
        <>
          <MessageList messages={chat.messages} />
          <MessageInput chatId={chat.chatId} />
        </>
      ) : (
        <div className="chat-window-empty">
          <p>Выберите чат или создайте новый</p>
        </div>
      )}
    </div>
  );
}
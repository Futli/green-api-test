import { useChats } from "../hooks";

interface SidebarProps {
  onNewChat: () => void;
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  const { chats, activeChatId, setActiveChatId } = useChats();

  const chatList = Object.values(chats).sort((a, b) => {
    const lastA = a.messages.at(-1)?.timestamp ?? 0;
    const lastB = b.messages.at(-1)?.timestamp ?? 0;
    return lastB - lastA;
  });

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>Чаты</span>
        <button onClick={onNewChat}>+ Новый чат</button>
      </div>

      <div className="chat-list">
        {chatList.length === 0 && <div className="chat-list-empty">Пока нет чатов</div>}

        {chatList.map((chat) => {
          const lastMessage = chat.messages.at(-1);
          return (
            <button
              key={chat.chatId}
              className={`chat-list-item ${chat.chatId === activeChatId ? 'active' : ''}`}
              onClick={() => setActiveChatId(chat.chatId)}
            >
              <div className="chat-avatar">{chat.title[0]?.toUpperCase() ?? '?'}</div>
              <div className="chat-list-item-info">
                <div className="chat-list-item-title">{chat.title}</div>
                <div className="chat-list-item-preview">{lastMessage?.text ?? 'Нет сообщений'}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
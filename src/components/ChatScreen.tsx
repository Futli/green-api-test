import { useState } from 'react';
import Sidebar from './Sidebar.tsx';
import ChatWindow from './ChatWindow.tsx';
import NewChatModal from './NewChatModal.tsx';

export default function ChatScreen() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="chat-screen">
      <Sidebar onNewChat={() => setModalOpen(true)} />
      <ChatWindow />
      {isModalOpen && <NewChatModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
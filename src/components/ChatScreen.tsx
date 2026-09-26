import { useState } from 'react';
import { useAuth, useChats, usePolling } from 'hooks';
import Sidebar from './Sidebar.tsx';
import ChatWindow from './ChatWindow.tsx';
import NewChatModal from './NewChatModal.tsx';

export default function ChatScreen() {
  const { credentials } = useAuth();
  const { receiveIncomingMessage } = useChats();
  const [isModalOpen, setModalOpen] = useState(false);

  usePolling(credentials, receiveIncomingMessage);

  return (
    <div className="chat-screen">
      <Sidebar onNewChat={() => setModalOpen(true)} />
      <ChatWindow />
      {isModalOpen && <NewChatModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
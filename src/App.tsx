import { useAuth } from './hooks';
import AuthForm from './components/AuthForm.tsx';
import { ChatsProvider } from './context/ChatsProvider.tsx';
import ChatScreen from './components/ChatScreen.tsx';

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <ChatsProvider>
      <ChatScreen />
    </ChatsProvider>
  );
}

export default App;
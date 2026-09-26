import { useAuth } from './hooks/useAuth.ts';
import AuthForm from './components/AuthForm.jsx';

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="app">
      <p>Чат</p>
    </div>
  );
}

export default App;
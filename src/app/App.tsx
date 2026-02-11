import { AppRouter } from './router';
import { AuthProvider } from '../shared/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
import { AppRouter } from './router';
import { ThemeProvider } from '../shared/contexts/ThemeContext.tsx';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
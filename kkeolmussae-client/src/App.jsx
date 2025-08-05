import { AppProvider } from './context/AppContext.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <HomeScreen />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

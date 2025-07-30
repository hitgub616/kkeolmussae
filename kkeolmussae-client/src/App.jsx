import { useContext } from 'react';
import { AppContext, AppProvider } from './context/AppContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';

function AppContent() {
  const { page } = useContext(AppContext);
  if (page === 'home') return <HomeScreen />;
  if (page === 'loading') return <LoadingScreen />;
  if (page === 'result') return <ResultScreen />;
  return <div>Invalid page</div>;
}

function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}

export default App;

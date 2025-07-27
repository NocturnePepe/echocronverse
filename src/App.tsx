import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { NavigationProvider } from './stores/navigationStore';
import { CronoXaiMemoryProvider } from './hooks/useCronoXaiMemory';
import { Web3Provider } from './context/Web3Context';
import Nav from './components/Nav';
import { initAnalytics, logPageView } from './utils/analytics';

// Lazy-loaded pages for code-splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const EchoDexPage = lazy(() => import('./pages/EchoDexPage'));
const CronoXaiPage = lazy(() => import('./pages/CronoXaiPage'));
const WalletPage = lazy(() => import('./pages/WalletPage'));
const CultLorePage = lazy(() => import('./pages/CultLorePage'));

function AppContent() {
  const location = useLocation();
  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);
  return (
    <div className="App bg-black min-h-screen">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/echodex" element={<EchoDexPage />} />
          <Route path="/cronoxai" element={<CronoXaiPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/lore" element={<CultLorePage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return (
    <Web3Provider>
      <CronoXaiMemoryProvider>
        <NavigationProvider>
          <Router>
            <ErrorBoundary>
              <Suspense fallback={<div className="text-center text-white p-6">Loading...</div>}>
                <AppContent />
              </Suspense>
            </ErrorBoundary>
          </Router>
        </NavigationProvider>
      </CronoXaiMemoryProvider>
    </Web3Provider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './stores/navigationStore';
import { CronoXaiMemoryProvider } from './hooks/useCronoXaiMemory';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import EchoDexPage from './pages/EchoDexPage';
import CronoXaiPage from './pages/CronoXaiPage';
import WalletPage from './pages/WalletPage';
import CultLorePage from './pages/CultLorePage';
import EnhancedLorePage from './pages/EnhancedLorePage';

function App() {
  return (
    <CronoXaiMemoryProvider>
      <NavigationProvider>
        <Router>
          <div className="App bg-black min-h-screen">
            <Nav />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/echodex" element={<EchoDexPage />} />
                <Route path="/cronoxai" element={<CronoXaiPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/lore" element={<CultLorePage />} />
                <Route path="/enhanced" element={<EnhancedLorePage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </NavigationProvider>
    </CronoXaiMemoryProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './stores/navigationStore';
import Nav from './components/Nav';
import HomePage from './pages/HomePage';
import EchoDexPage from './pages/EchoDexPage';
import CronoXaiPage from './pages/CronoXaiPage';
import WalletPage from './pages/WalletPage';

function App() {
  return (
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
            </Routes>
          </main>
        </div>
      </Router>
    </NavigationProvider>
  );
}

export default App;

import Nav from './components/Nav';
import Hero from './components/Hero';
import LoreBlock from './components/LoreBlock';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App bg-black min-h-screen">
      <Nav />
      <main>
        <Hero />
        <LoreBlock />
      </main>
      <Footer />
    </div>
  );
}

export default App;

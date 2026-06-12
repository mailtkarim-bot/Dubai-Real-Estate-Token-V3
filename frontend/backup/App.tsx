import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Investor from './pages/Investor';
import Admin from './pages/Admin';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-dark-900 text-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/investor" element={<Investor />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;

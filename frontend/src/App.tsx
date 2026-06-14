import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Investor from './pages/Investor';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  return (
    <HashRouter>
      <ErrorBoundary>
        <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col">
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/investor" element={<Investor />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </ErrorBoundary>
    </HashRouter>
  );
}

export default App;

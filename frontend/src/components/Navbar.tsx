import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Home, UserCircle, Shield, Menu, X, Sun, Moon } from 'lucide-react';
import ConnectButton from './ConnectButton';
import { motion } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/investor', label: 'Investor', icon: UserCircle },
  { path: '/admin', label: 'Admin', icon: Shield },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="text-gold-400" size={28} />
            <span className="text-xl font-bold text-gold-300 tracking-wide">DREIT</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gold-500/10 text-gold-300'
                        : 'text-gray-400 hover:text-gold-300 hover:bg-dark-700'
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-dark-700 hover:bg-dark-600 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={20} className="text-gold-400" /> : <Moon size={20} className="text-gold-400" />}
            </button>

            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gold-300">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <ConnectButton />
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 space-y-2"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-500/10 text-gold-300'
                      : 'text-gray-400 hover:text-gold-300 hover:bg-dark-700'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </nav>
  );
}

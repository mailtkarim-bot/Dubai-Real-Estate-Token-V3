import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Home, UserCircle, Shield, Menu, X } from 'lucide-react';
import ConnectButton from './ConnectButton';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/investor', label: 'Investor', icon: UserCircle },
  { path: '/admin', label: 'Admin', icon: Shield },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-dark-800/80 border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="text-gold-400" size={28} />
            <span className="text-xl font-bold text-gold-300 tracking-wide">DREIT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
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
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-[9px] left-4 right-4 h-[2px] bg-gold-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right side: Sepolia badge + ConnectButton + Mobile menu */}
          <div className="flex items-center gap-4">
            {/* Sepolia network badge */}
            <div className="hidden md:flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-medium text-green-400">Sepolia</span>
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gold-300 p-2 rounded-lg hover:bg-dark-700 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* ConnectButton - hidden on very small screens */}
            <div className="hidden sm:block">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-dark-800/95 backdrop-blur-md border-b border-dark-600"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Sepolia badge mobile */}
              <div className="flex items-center gap-2 px-4 py-2 md:hidden">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-xs font-medium text-green-400">Sepolia</span>
              </div>

              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gold-500/10 text-gold-300'
                          : 'text-gray-400 hover:text-gold-300 hover:bg-dark-700'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={18} />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* ConnectButton for mobile */}
              <div className="sm:hidden pt-2">
                <ConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

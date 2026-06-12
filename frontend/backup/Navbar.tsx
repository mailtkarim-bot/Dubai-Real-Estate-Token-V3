import { Link, useLocation } from 'react-router-dom';
import { Building2, Home, UserCircle, Shield } from 'lucide-react';
import ConnectButton from './ConnectButton';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/investor', label: 'Investor', icon: UserCircle },
  { path: '/admin', label: 'Admin', icon: Shield },
];

export default function Navbar() {
  const location = useLocation();

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
                <Link
                  key={link.path}
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
              );
            })}
          </div>

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}

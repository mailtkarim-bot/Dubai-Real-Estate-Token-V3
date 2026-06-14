import { Link } from 'react-router-dom';
import { Building2, Home, UserCircle, Shield, FileText, Code2 } from 'lucide-react';

const quickLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/investor', label: 'Investor', icon: UserCircle },
  { path: '/admin', label: 'Admin', icon: Shield },
];

const connectLinks = [
  { label: 'Documentation', href: '#', icon: FileText },
  { label: 'GitHub', href: 'https://github.com/mailtkarim-bot/Dubai-Real-Estate-Token-V3', icon: Code2 },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-gold-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Building2 className="text-gold-400 group-hover:text-gold-300 transition-colors" size={28} />
              <span className="text-xl font-bold text-gold-300 tracking-wide">
                DREIT
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dubai Real Estate Investment Token
            </p>
            <p className="text-gray-500 text-xs">
              Tokenized real estate investment on the blockchain. Secure, transparent, and accessible.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-gold-300 font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors text-sm"
                      aria-label={`Navigate to ${link.label} page`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h3 className="text-gold-300 font-semibold mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <ul className="space-y-3">
              {connectLinks.map((link) => {
                const Icon = link.icon;
                const isExternal = link.href.startsWith('http');
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors text-sm"
                      aria-label={isExternal ? `${link.label} (opens in new tab)` : link.label}
                    >
                      <Icon size={16} />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-dark-600">
          <p className="text-center text-gray-500 text-sm">
            &copy; {currentYear} DREIT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

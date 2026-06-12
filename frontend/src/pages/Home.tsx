import { Building2, Shield, Coins, Globe, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 6000 },
  { name: 'Apr', value: 8000 },
  { name: 'May', value: 5000 },
  { name: 'Jun', value: 9000 },
];

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 badge-gold mb-4"
        >
          <Globe size={14} />
          Sepolia Testnet Demo
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold text-gold-300"
        >
          Dubai Real Estate
          <br />
          <span className="text-gold-400">Investment Token</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          ERC-3643 compliant security token with on-chain KYC, automated compliance,
          and dividend distribution — deployed and verified on Sepolia.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-4 pt-4"
        >
          <Link to="/investor" className="btn-gold">
            Investor Dashboard
          </Link>
          <Link to="/admin" className="btn-outline-gold">
            Admin Panel
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card text-center"
        >
          <div className="text-3xl font-bold text-gold-300">3</div>
          <div className="text-gray-400">Contracts Deployed</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card text-center"
        >
          <div className="text-3xl font-bold text-gold-300">224</div>
          <div className="text-gray-400">Tests Passing</div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card text-center"
        >
          <div className="text-3xl font-bold text-gold-300">96.8%</div>
          <div className="text-gray-400">Core Coverage</div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-3xl font-bold text-center text-gold-300"
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card-hover"
          >
            <Shield className="text-gold-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gold-300 mb-2">On-Chain KYC</h3>
            <p className="text-gray-400">
              Every holder must be verified in the IdentityRegistry before any token interaction.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card-hover"
          >
            <Coins className="text-gold-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gold-300 mb-2">Auto Dividends</h3>
            <p className="text-gray-400">
              Pull-model O(1) dividend distribution in USDC. Each investor claims on their own schedule.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card-hover"
          >
            <Building2 className="text-gold-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gold-300 mb-2">Compliance Engine</h3>
            <p className="text-gray-400">
              Pre-transfer validation with freeze lists, country restrictions, and regulator controls.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chart */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="chart-container"
      >
        <h2 className="text-2xl font-bold text-gold-300 mb-6 flex items-center gap-2">
          <BarChart2 size={24} />
          Token Performance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#FFD700" />
            <YAxis stroke="#FFD700" />
            <Tooltip contentStyle={{ backgroundColor: '#1A1A25', borderColor: '#FFD700' }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.section>

      {/* Contracts */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-gold-300 mb-6">Deployed Contracts</h2>
        <div className="space-y-4">
          {[
            { name: 'DubaiRealEstateToken', addr: '0x2fAD3898ccBdc4A933170B0d551bd10b8b659fc6' },
            { name: 'IdentityRegistry', addr: '0xECD85Ebd68a548705f902c6D244BfBA76f51F9Fc' },
            { name: 'ComplianceEngine', addr: '0x87b62081D607C022B2495D5B6555829fA84E33d6' },
          ].map((c) => (
            <motion.div
              key={c.addr}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between bg-dark-700 rounded-lg px-4 py-3"
            >
              <span className="font-medium text-gold-300">{c.name}</span>
              <a
                href={`https://sepolia.etherscan.io/address/${c.addr}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gold-400 hover:text-gold-300 font-mono"
              >
                {c.addr.slice(0, 6)}...{c.addr.slice(-4)} ↗
              </a>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

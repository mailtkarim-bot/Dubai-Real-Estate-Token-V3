import { useState, useEffect, useRef } from 'react';
import {
  Building2, Shield, Coins, Globe, BarChart2,
  Copy, Check, ArrowRight, TrendingUp, Lock, FileCheck, Wallet, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import useDocumentTitle from '../hooks/useDocumentTitle';

/* ────────────────────────────── Data ────────────────────────────── */

const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 5200 },
  { name: 'Mar', value: 4800 },
  { name: 'Apr', value: 7200 },
  { name: 'May', value: 6800 },
  { name: 'Jun', value: 9100 },
  { name: 'Jul', value: 8500 },
  { name: 'Aug', value: 11200 },
  { name: 'Sep', value: 10800 },
  { name: 'Oct', value: 13500 },
  { name: 'Nov', value: 12900 },
  { name: 'Dec', value: 15800 },
];

const deployedContracts = [
  { name: 'DubaiRealEstateToken', addr: '0x20BA3Dfa13295020b23758474ee831fD8E0f629B', verified: true },
  { name: 'IdentityRegistry', addr: '0xadCEa5d2d447a324C7577E48E0E2be83fBBC45e9', verified: true },
  { name: 'ComplianceEngine', addr: '0xF5b23EFD5cb4C05D87FEF1E72766e08DAe5C54af', verified: true },
];

const howItWorksSteps = [
  {
    num: '01',
    title: 'Connect Wallet',
    desc: 'Link your Web3 wallet to access the DREIT platform securely.',
    icon: Wallet,
  },
  {
    num: '02',
    title: 'Complete KYC',
    desc: 'Get verified on-chain through our IdentityRegistry before investing.',
    icon: FileCheck,
  },
  {
    num: '03',
    title: 'Receive Tokens',
    desc: 'Once approved, receive DREIT tokens representing your real estate share.',
    icon: Coins,
  },
  {
    num: '04',
    title: 'Earn Dividends',
    desc: 'Claim USDC dividends automatically distributed from property yields.',
    icon: TrendingUp,
  },
];

const trustBadges = [
  { label: 'ERC-3643 Compliant', icon: FileCheck },
  { label: 'On-Chain KYC', icon: Shield },
  { label: 'Fully Audited', icon: Lock },
  { label: 'Open Source', icon: ExternalLink },
  { label: '7 Smart Contracts', icon: FileCheck },
  { label: '282 Tests Passing', icon: Check },
];

const features = [
  {
    icon: Shield,
    title: 'On-Chain KYC',
    desc: 'Every holder must be verified in the IdentityRegistry before any token interaction.',
  },
  {
    icon: Coins,
    title: 'Auto Dividends',
    desc: 'Pull-model O(1) dividend distribution in USDC. Each investor claims on their own schedule.',
  },
  {
    icon: Building2,
    title: 'Compliance Engine',
    desc: 'Pre-transfer validation with freeze lists, country restrictions, and regulator controls.',
  },
];

/* ────────────────────── Animated Counter ────────────────────── */

function AnimatedCounter({ target, suffix = '', decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-gold-300">
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </div>
  );
}

/* ──────────────────── Custom Chart Tooltip ──────────────────── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 neon-cyan rounded-lg px-4 py-3 shadow-xl">
      <p className="text-gold-400 text-sm font-medium mb-1">{label}</p>
      <p className="text-gold-300 text-lg font-bold">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

/* ──────────────────── How It Works Card ──────────────────── */

function StepCard({ step, index }: { step: typeof howItWorksSteps[0]; index: number }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group"
    >
      <div className="card-hover relative overflow-hidden neon-violet">
        {/* Step number watermark */}
        <div className="absolute top-2 right-4 text-6xl font-bold text-gold-500/5 select-none pointer-events-none group-hover:text-gold-500/10 transition-colors">
          {step.num}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
              <Icon className="text-gold-400" size={24} />
            </div>
            <div>
              <span className="text-xs font-mono text-gold-500 uppercase tracking-wider">Step {step.num}</span>
              <h3 className="text-lg font-semibold text-gold-300">{step.title}</h3>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed pl-[4.5rem]">
            {step.desc}
          </p>
        </div>

        {/* Connector line (hidden on last item & mobile) */}
        {index < howItWorksSteps.length - 1 && (
          <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-px bg-gold-400/20" />
        )}
      </div>
    </motion.div>
  );
}

/* ──────────────────── Feature Card ──────────────────── */

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -6 }}
      className="card-hover relative overflow-hidden group neon-magenta"
    >
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gold-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gold-400/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-xl border border-gold-400/0 group-hover:border-gold-400/20 transition-all duration-500" />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-400/20 flex items-center justify-center mb-5 group-hover:bg-gold-500/20 transition-colors">
          <Icon className="text-gold-400" size={26} />
        </div>
        <h3 className="text-xl font-semibold text-gold-300 mb-3">{feature.title}</h3>
        <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  );
}

/* ──────────────────── Contract Row ──────────────────── */

function ContractRow({ contract }: { contract: typeof deployedContracts[0] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contract.addr).then(() => {
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between bg-dark-700/80 rounded-lg px-4 py-3 neon-orange transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center">
          <FileCheck size={14} className="text-gold-400" />
        </div>
        <span className="font-medium text-gold-300">{contract.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm text-gold-400 hover:text-gold-300 font-mono transition-colors px-2 py-1 rounded hover:bg-gold-400/10"
          title="Copy address"
        >
          {contract.addr.slice(0, 6)}...{contract.addr.slice(-4)}
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
        <a
          href={`https://sepolia.etherscan.io/address/${contract.addr}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-500 hover:text-gold-300 transition-colors p-1 rounded hover:bg-gold-400/10"
          title="View on Etherscan"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════ Home ═══════════════════════════ */

export default function Home() {
  useDocumentTitle('Home');

  return (
    <div className="space-y-20 py-8">
      {/* ════════════ Hero Section ════════════ */}
      <section className="relative text-center space-y-8 py-12 overflow-hidden rounded-2xl">
        {/* Radial gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 40%, transparent 70%)',
          }}
        />

        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 badge-gold mb-2"
          >
            <Globe size={14} />
            Sepolia Testnet Demo
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-gold-300 leading-tight"
          >
            Dubai Real Estate
            <br />
            <span className="text-gold-400">Investment Token</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            ERC-3643 compliant security token with on-chain KYC, automated compliance,
            and dividend distribution — deployed and verified on Sepolia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Link
              to="/investor"
              className="btn-gold flex items-center gap-2 text-lg px-8 py-4"
            >
              Investor Dashboard
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/admin"
              className="btn-outline-gold flex items-center gap-2 text-lg px-8 py-4"
            >
              Admin Panel
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════ Stats Section ════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { value: 7, label: 'Contracts Deployed', suffix: '' },
          { value: 282, label: 'Tests Passing', suffix: '' },
          { value: 96.4, label: 'Core Coverage', suffix: '%', decimals: 1 },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className={`card text-center relative overflow-hidden group ${['neon-cyan','neon-magenta','neon-violet'][i]}`}
          >
            <div className="absolute inset-0 bg-gold-400/0 group-hover:bg-gold-400/[0.02] transition-colors" />
            <div className="relative z-10 space-y-2">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
              <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* ════════════ Key Features ════════════ */}
      <section className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-gold-500 text-sm uppercase tracking-wider font-medium">Platform</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gold-300 mt-2">Key Features</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </section>

      {/* ════════════ How It Works ════════════ */}
      <section className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-gold-500 text-sm uppercase tracking-wider font-medium">Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gold-300 mt-2">How It Works</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Four simple steps to start investing in tokenized Dubai real estate.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>
      </section>

      {/* ════════════ Token Performance Chart ════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="chart-container neon-blue"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gold-300 flex items-center gap-2">
              <BarChart2 size={24} />
              Token Performance
            </h2>
            <p className="text-gray-400 text-sm mt-1">12-month projected growth trajectory</p>
          </div>
          <div className="flex items-center gap-2 text-gold-400 text-sm">
            <TrendingUp size={16} />
            <span className="font-medium">+295%</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#D4AF37" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#B8860B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222230" />
            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FFD700"
              strokeWidth={3}
              fill="url(#goldGradient)"
              dot={{ fill: '#FFD700', r: 4, stroke: '#0A0A0F', strokeWidth: 2 }}
              activeDot={{ fill: '#FFD700', r: 6, stroke: '#D4AF37', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.section>

      {/* ════════════ Trust & Security ════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="card relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top right, rgba(212,175,55,0.05) 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 text-center space-y-8">
          <div>
            <span className="text-gold-500 text-sm uppercase tracking-wider font-medium">Security</span>
            <h2 className="text-3xl font-bold text-gold-300 mt-2">Trust & Security</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-dark-700/50 neon-green hover:scale-105 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                    <Icon size={22} className="text-gold-400" />
                  </div>
                  <span className="text-gray-300 text-sm font-medium text-center">{badge.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ════════════ Deployed Contracts ════════════ */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="card neon-orange"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gold-300">Deployed Contracts</h2>
            <p className="text-gray-400 text-sm mt-1">Verified contracts on Sepolia Testnet</p>
          </div>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </div>
        </div>
        <div className="space-y-3">
          {deployedContracts.map((c) => (
            <ContractRow key={c.addr} contract={c} />
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-4 text-center">
          Click the address to copy. Click the arrow icon to view on Etherscan.
        </p>
      </motion.section>
    </div>
  );
}

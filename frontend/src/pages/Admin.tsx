import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { CONTRACTS } from '../contracts';
import { addressSchema, amountSchema } from '../utils/validation';
import {
  Shield, Coins, Pause, Play, Snowflake, Loader2, BarChart2,
  TrendingUp, Users, DollarSign, Search, AlertTriangle, X,
  Info, Check, Unlock, Lock, ExternalLink, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { SkeletonCard } from '../components/Skeleton';

/* ──────────────── Mock Data ──────────────── */

const chartData = [
  { name: 'Jan', Tokens: 10000, Holders: 12 },
  { name: 'Feb', Tokens: 15000, Holders: 18 },
  { name: 'Mar', Tokens: 12000, Holders: 15 },
  { name: 'Apr', Tokens: 22000, Holders: 24 },
  { name: 'May', Tokens: 20000, Holders: 28 },
  { name: 'Jun', Tokens: 28000, Holders: 35 },
  { name: 'Jul', Tokens: 26000, Holders: 33 },
  { name: 'Aug', Tokens: 35000, Holders: 42 },
  { name: 'Sep', Tokens: 32000, Holders: 40 },
  { name: 'Oct', Tokens: 42000, Holders: 51 },
  { name: 'Nov', Tokens: 40000, Holders: 48 },
  { name: 'Dec', Tokens: 50000, Holders: 62 },
];

const MAX_SUPPLY = 1000000; // 1M DREIT

interface FrozenAccount {
  address: string;
  reason: string;
  frozenAt: string;
  status: 'frozen' | 'pending';
}

const mockFrozenAccounts: FrozenAccount[] = [
  { address: '0x3F5...a9B2', reason: 'Regulatory compliance review', frozenAt: '2024-12-10', status: 'frozen' },
  { address: '0x7A1...c4D8', reason: 'Suspicious activity detected', frozenAt: '2024-12-05', status: 'frozen' },
  { address: '0x9E2...f0A3', reason: 'Awaiting KYC re-verification', frozenAt: '2024-11-28', status: 'pending' },
];

/* ──────────────── Custom Chart Tooltip ──────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 neon-cyan rounded-lg px-4 py-3 shadow-xl">
      <p className="text-gold-400 text-sm font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

/* ──────────────── Pagination Hook ──────────────── */
function usePagination<T>(items: T[], perPage: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const paginated = items.slice((page - 1) * perPage, page * perPage);
  useEffect(() => { setPage(1); }, [items.length]);
  return { page, setPage, totalPages, paginated };
}

/* ═══════════════════════════ Admin Panel ═══════════════════════════ */

export default function Admin() {
  useDocumentTitle('Admin Panel');

  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isConfirmError, error: confirmError } = useWaitForTransactionReceipt({ hash });

  /* ─── State ─── */
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [mintToError, setMintToError] = useState(false);
  const [mintAmountError, setMintAmountError] = useState(false);
  const [dividendAmount, setDividendAmount] = useState('');
  const [dividendError, setDividendError] = useState(false);
  const [freezeTarget, setFreezeTarget] = useState('');
  const [freezeReason, setFreezeReason] = useState('');
  const [freezeError, setFreezeError] = useState(false);
  const [frozenSearch, setFrozenSearch] = useState('');
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [pauseCountdown, setPauseCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'Tokens' | 'Holders'>('Tokens');

  /* ─── Effects ─── */
  useEffect(() => {
    const timer = setTimeout(() => setIsDataLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isError) toast.error(`Transaction failed: ${error?.message || 'Unknown error'}`);
    if (isConfirmError) toast.error(`Confirmation failed: ${confirmError?.message || 'Unknown error'}`);
  }, [isError, error, isConfirmError, confirmError]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transaction confirmed!');
      setShowPauseConfirm(false);
      setIsCountingDown(false);
    }
  }, [isConfirmed]);

  /* ─── Real-time Validation ─── */
  useEffect(() => {
    if (mintTo) { try { addressSchema.parse(mintTo); setMintToError(false); } catch { setMintToError(true); } }
    else { setMintToError(false); }
  }, [mintTo]);

  useEffect(() => {
    if (mintAmount) { try { amountSchema.parse(mintAmount); setMintAmountError(false); } catch { setMintAmountError(true); } }
    else { setMintAmountError(false); }
  }, [mintAmount]);

  useEffect(() => {
    if (dividendAmount) { try { amountSchema.parse(dividendAmount); setDividendError(false); } catch { setDividendError(true); } }
    else { setDividendError(false); }
  }, [dividendAmount]);

  useEffect(() => {
    if (freezeTarget) { try { addressSchema.parse(freezeTarget); setFreezeError(false); } catch { setFreezeError(true); } }
    else { setFreezeError(false); }
  }, [freezeTarget]);

  /* ─── Pause Countdown ─── */
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isCountingDown && pauseCountdown > 0) {
      timer = setInterval(() => setPauseCountdown(c => c - 1), 1000);
    } else if (isCountingDown && pauseCountdown === 0) {
      writeContract({ ...CONTRACTS.token, functionName: 'pause' });
      setIsCountingDown(false);
      setPauseCountdown(3);
    }
    return () => clearInterval(timer);
  }, [isCountingDown, pauseCountdown, writeContract]);

  /* ─── Contract Reads ─── */
  const { data: isPaused } = useReadContract({
    ...CONTRACTS.token,
    functionName: 'paused',
    query: { enabled: isConnected },
  }) as { data: boolean | undefined };

  const { data: totalSupply } = useReadContract({
    ...CONTRACTS.token,
    functionName: 'totalSupply',
    query: { enabled: isConnected },
  });

  /* ─── Derived ─── */
  const isLoading = isPending || isConfirming;
  const formattedSupply = totalSupply ? (Number(totalSupply) / 1e18).toLocaleString() : '—';
  const supplyPercent = totalSupply ? Math.min(100, (Number(totalSupply) / 1e18 / MAX_SUPPLY) * 100) : 0;
  const numericSupply = totalSupply ? Number(totalSupply) / 1e18 : 0;
  const holdersCount = 62; // Mock — would come from contract
  const totalDividends = '42,850.00'; // Mock — would be calculated

  const validateAndWrite = (fn: string, contract: any, args: any[], schema: any[]) => {
    try {
      schema.forEach((s, i) => s.parse(args[i]));
      writeContract({ ...contract, functionName: fn, args });
    } catch (e: any) {
      if (e instanceof Error) toast.error(`Validation error: ${e.message}`);
    }
  };

  const handlePauseClick = () => {
    setShowPauseConfirm(true);
  };

  const startPauseCountdown = () => {
    setShowPauseConfirm(false);
    setIsCountingDown(true);
    setPauseCountdown(3);
  };

  /* ─── Filtered frozen accounts ─── */
  const filteredFrozen = mockFrozenAccounts.filter(acc =>
    acc.address.toLowerCase().includes(frozenSearch.toLowerCase()) ||
    acc.reason.toLowerCase().includes(frozenSearch.toLowerCase())
  );
  const { page, setPage, totalPages, paginated } = usePagination(filteredFrozen, 3);

  /* ═══════════════════════════ Render ═══════════════════════════ */

  if (!isConnected) {
    return (
      <div className="card neon-pulse-magenta text-center py-16">
        <Shield className="mx-auto text-gold-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gold-300 mb-2">Admin Access Required</h2>
        <p className="text-gray-400">Please connect an admin wallet to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gold-300"
        >
          Admin Panel
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`badge-${isPaused ? 'red' : 'green'}`}
        >
          {isPaused ? 'Paused' : 'Active'}
        </motion.div>
      </div>

      {/* ─── Stats Cards ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isDataLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="card neon-cyan relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold-400/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <Coins className="text-gold-400" size={20} />
                </div>
                <span className="text-gray-400 text-sm">Total Supply</span>
              </div>
              <div className="text-2xl font-bold text-gold-300">{formattedSupply}</div>
              <div className="text-xs text-gray-500 mt-1">DREIT tokens</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="card neon-magenta relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="text-blue-400" size={20} />
                </div>
                <span className="text-gray-400 text-sm">Token Holders</span>
              </div>
              <div className="text-2xl font-bold text-gold-300">{holdersCount}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <TrendingUp size={12} />
                <span>+8 this month</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="card neon-violet relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="text-green-400" size={20} />
                </div>
                <span className="text-gray-400 text-sm">Dividends Distributed</span>
              </div>
              <div className="text-2xl font-bold text-gold-300">{totalDividends}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <TrendingUp size={12} />
                <span>USDC total</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="card neon-green relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Shield className="text-purple-400" size={20} />
                </div>
                <span className="text-gray-400 text-sm">Contract Status</span>
              </div>
              <div className={`text-2xl font-bold ${isPaused ? 'text-red-400' : 'text-green-400'}`}>
                {isPaused ? 'Paused' : 'Active'}
              </div>
              <div className="text-xs text-gray-500 mt-1">{isPaused ? 'All transfers halted' : 'Operating normally'}</div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ─── Token Distribution Chart ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="chart-container neon-blue"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gold-300 flex items-center gap-2">
            <BarChart2 size={20} />
            Token Distribution
          </h3>
          <div className="flex gap-2">
            {(['Tokens', 'Holders'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveChartTab(tab)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  activeChartTab === tab
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-400/30'
                    : 'text-gray-400 hover:text-gray-300 border border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="adminGoldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#B8860B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="adminBlueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222230" />
            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={activeChartTab}
              stroke={activeChartTab === 'Tokens' ? '#FFD700' : '#3B82F6'}
              strokeWidth={3}
              fill={activeChartTab === 'Tokens' ? 'url(#adminGoldGrad)' : 'url(#adminBlueGrad)'}
              dot={{ fill: activeChartTab === 'Tokens' ? '#FFD700' : '#3B82F6', r: 3, stroke: '#0A0A0F', strokeWidth: 2 }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ─── Mint Tokens ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card neon-orange"
      >
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <Coins size={20} />
          Mint Tokens
        </h3>

        {/* Supply Progress */}
        <div className="mb-6 p-4 bg-dark-700/50 rounded-xl neon-orange">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Current Supply</span>
            <span className="text-sm font-mono text-gold-300">{formattedSupply} / {MAX_SUPPLY.toLocaleString()} DREIT</span>
          </div>
          <div className="w-full h-3 bg-dark-600 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${supplyPercent}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #B8860B, #FFD700)',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{supplyPercent.toFixed(2)}% of max supply</span>
            <span className="text-xs text-gray-500">{(MAX_SUPPLY - numericSupply).toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-4 p-3 bg-blue-500/5 border border-blue-400/20 rounded-lg flex items-start gap-3">
          <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-300/80">
            Minting creates new DREIT tokens and assigns them to the specified address.
            Ensure the recipient is KYC-verified before minting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
            <input
              type="text"
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
              placeholder="0x..."
              className={`input-dark w-full ${mintToError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
              data-testid="mint-to-input"
            />
            {mintToError && <p className="text-red-400 text-xs mt-1">Invalid Ethereum address</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount (DREIT)</label>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="0.00"
              className={`input-dark w-full ${mintAmountError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
              data-testid="mint-amount-input"
            />
            {mintAmountError && <p className="text-red-400 text-xs mt-1">Must be a positive number</p>}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => validateAndWrite('mint', CONTRACTS.token, [mintTo as `0x${string}`, BigInt(Math.floor(Number(mintAmount) * 1e18))], [addressSchema, amountSchema])}
          disabled={isLoading || !mintTo || !mintAmount || mintToError || mintAmountError}
          className="mt-4 btn-gold"
          data-testid="mint-button"
        >
          {isLoading && <Loader2 className="animate-spin inline mr-2" size={18} />}
          Mint Tokens
        </motion.button>
      </motion.div>

      {/* ─── Distribute Dividends ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card neon-green"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gold-300 flex items-center gap-2">
            <Coins size={20} />
            Distribute Dividends
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Contract USDC Balance:</span>
            <span className="font-mono text-gold-300 font-semibold">12,450.00 USDC</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm text-gray-400 mb-1">Amount (USDC)</label>
            <input
              type="number"
              value={dividendAmount}
              onChange={(e) => setDividendAmount(e.target.value)}
              placeholder="0.00"
              className={`input-dark w-full text-lg py-4 ${dividendError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
              data-testid="dividend-amount-input"
            />
            {dividendError && <p className="text-red-400 text-xs mt-1">Must be a positive number</p>}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => validateAndWrite('distributeDividends', CONTRACTS.token, [BigInt(Math.floor(Number(dividendAmount) * 1e6))], [amountSchema])}
            disabled={isLoading || !dividendAmount || dividendError}
            className="btn-gold px-8 py-4 text-lg w-full md:w-auto"
            data-testid="distribute-button"
          >
            {isLoading && <Loader2 className="animate-spin inline mr-2" size={18} />}
            Distribute
          </motion.button>
        </div>
        <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
          <Info size={14} />
          Requires USDC approval. The contract will proportionally distribute to all token holders.
        </p>
      </motion.div>

      {/* ─── Freeze / Unfreeze ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card neon-magenta"
      >
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <Snowflake size={20} />
          Freeze / Unfreeze Investor
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Investor Address</label>
            <input
              type="text"
              value={freezeTarget}
              onChange={(e) => setFreezeTarget(e.target.value)}
              placeholder="0x..."
              className={`input-dark w-full ${freezeError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
              data-testid="freeze-target-input"
            />
            {freezeError && <p className="text-red-400 text-xs mt-1">Invalid Ethereum address</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Reason</label>
            <input
              type="text"
              value={freezeReason}
              onChange={(e) => setFreezeReason(e.target.value)}
              placeholder="Regulatory freeze"
              className="input-dark w-full"
              data-testid="freeze-reason-input"
            />
          </div>
        </div>
        <div className="flex gap-4 mb-6 neon-pulse-red">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => validateAndWrite('freezeInvestor', CONTRACTS.compliance, [freezeTarget as `0x${string}`, freezeReason || 'Regulatory freeze'], [addressSchema])}
            disabled={isLoading || !freezeTarget || freezeError}
            className="btn-outline-gold border-red-400 text-red-400 hover:bg-red-400/10"
            data-testid="freeze-button"
          >
            <Lock size={16} className="inline mr-2" />
            Freeze
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => validateAndWrite('unfreezeInvestor', CONTRACTS.compliance, [freezeTarget as `0x${string}`], [addressSchema])}
            disabled={isLoading || !freezeTarget || freezeError}
            className="btn-outline-gold border-green-400 text-green-400 hover:bg-green-400/10"
            data-testid="unfreeze-button"
          >
            <Unlock size={16} className="inline mr-2" />
            Unfreeze
          </motion.button>
        </div>

        {/* Frozen Accounts Table */}
        <div className="border-t border-dark-600 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Frozen Accounts ({filteredFrozen.length})</h4>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={frozenSearch}
                onChange={(e) => setFrozenSearch(e.target.value)}
                placeholder="Search..."
                className="bg-dark-700 neon-magenta rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gold-400 w-48"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-dark-600">
                  <th className="pb-2 pr-4">Address</th>
                  <th className="pb-2 pr-4">Reason</th>
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/50">
                {paginated.map((acc, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-dark-700/30 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <span className="font-mono text-sm text-gold-300">{acc.address}</span>
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-400">{acc.reason}</td>
                    <td className="py-3 pr-4 text-sm text-gray-500">{acc.frozenAt}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        acc.status === 'frozen'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        <Lock size={10} />
                        {acc.status === 'frozen' ? 'Frozen' : 'Pending'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFrozen.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-sm">No matching accounts found.</div>
          )}

          {filteredFrozen.length > 3 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-700">
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg neon-magenta text-gray-400 hover:text-gold-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg neon-magenta text-gray-400 hover:text-gold-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── Emergency Controls ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className={`card neon-pulse-red relative overflow-hidden ${isPaused ? 'bg-red-500/[0.02]' : ''}`}
      >
        {/* Warning glow */}
        {isPaused && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, rgba(239,68,68,0.05) 0%, transparent 60%)' }} />
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gold-300 flex items-center gap-2">
              {isPaused ? <Play size={20} className="text-green-400" /> : <Pause size={20} className="text-red-400" />}
              Emergency Controls
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPaused
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              {isPaused ? 'Contract is PAUSED' : 'Contract is ACTIVE'}
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePauseClick}
              disabled={isLoading || isPaused}
              className="btn-outline-gold border-red-400 text-red-400 hover:bg-red-400/10 disabled:opacity-30"
            >
              <Pause size={16} className="inline mr-2" />
              Pause Contract
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => writeContract({ ...CONTRACTS.token, functionName: 'unpause' })}
              disabled={isLoading || !isPaused}
              className="btn-outline-gold border-green-400 text-green-400 hover:bg-green-400/10 disabled:opacity-30"
            >
              <Play size={16} className="inline mr-2" />
              Unpause Contract
            </motion.button>
          </div>

          {isCountingDown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 neon-pulse-red rounded-xl text-center"
            >
              <p className="text-red-300 font-semibold">Pausing in {pauseCountdown}...</p>
              <button
                onClick={() => { setIsCountingDown(false); setPauseCountdown(3); }}
                className="mt-2 text-sm text-gray-400 hover:text-gray-200 underline"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </div>

        {/* ─── Pause Confirmation Dialog ─── */}
        <AnimatePresence>
          {showPauseConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-dark-800 neon-pulse-red rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-300">Emergency Pause</h3>
                    <p className="text-sm text-gray-400">This will halt all token transfers.</p>
                  </div>
                </div>
                <div className="bg-dark-700/50 rounded-lg p-4 mb-6 space-y-2">
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    <X size={14} className="text-red-400" />
                    All transfers will be blocked
                  </p>
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    <X size={14} className="text-red-400" />
                    Investors cannot claim dividends
                  </p>
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    <Check size={14} className="text-green-400" />
                    Admin functions remain available
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPauseConfirm(false)}
                    className="flex-1 py-2.5 rounded-lg neon-pulse-red text-gray-300 hover:bg-dark-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startPauseCountdown}
                    className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold transition-colors"
                  >
                    Proceed
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Transaction Receipt ─── */}
      {hash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card neon-yellow bg-gold-500/5"
        >
          <p className="text-sm text-gold-300 flex items-center gap-2">
            <Check size={16} className="text-green-400" />
            Transaction submitted:
            <a
              href={`https://sepolia.etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline flex items-center gap-1"
            >
              {hash.slice(0, 10)}...{hash.slice(-8)} <ExternalLink size={12} />
            </a>
          </p>
        </motion.div>
      )}
    </div>
  );
}

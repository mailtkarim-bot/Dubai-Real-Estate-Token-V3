import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { CONTRACTS } from '../contracts';
import { addressSchema, amountSchema } from '../utils/validation';
import { getTransactionHistory } from '../utils/history';
import {
  Coins, UserCheck, ArrowRightLeft, DollarSign, Loader2, History,
  BarChart2, TrendingUp, ArrowUpRight, ArrowDownLeft,
  Sparkles, ExternalLink, ChevronLeft, ChevronRight, Maximize2, AlertTriangle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { SkeletonCard } from '../components/Skeleton';

/* ──────────────── Mock Claim History ──────────────── */
const mockClaimHistory = [
  { date: '2024-12-15', amount: '124.50', txHash: '0xabc...def1' },
  { date: '2024-11-28', amount: '89.20', txHash: '0xabc...def2' },
  { date: '2024-10-30', amount: '156.80', txHash: '0xabc...def3' },
];

/* ──────────────── Mock Transaction History (enhanced fallback) ──────────────── */
interface TxRecord {
  transactionHash: string;
  args: {
    from?: string;
    to?: string;
    value?: bigint;
  };
  blockNumber?: bigint;
  type?: 'send' | 'receive' | 'claim';
  date?: string;
  amount?: string;
}

/* ──────────────── 12-Month Chart Data ──────────────── */
const chartData = [
  { name: 'Jan', DREIT: 1000, USDC: 820 },
  { name: 'Feb', DREIT: 2200, USDC: 1350 },
  { name: 'Mar', DREIT: 1800, USDC: 1100 },
  { name: 'Apr', DREIT: 3500, USDC: 2100 },
  { name: 'May', DREIT: 3100, USDC: 1950 },
  { name: 'Jun', DREIT: 4800, USDC: 3200 },
  { name: 'Jul', DREIT: 4500, USDC: 3000 },
  { name: 'Aug', DREIT: 6200, USDC: 4100 },
  { name: 'Sep', DREIT: 5900, USDC: 3900 },
  { name: 'Oct', DREIT: 7800, USDC: 5200 },
  { name: 'Nov', DREIT: 7400, USDC: 4900 },
  { name: 'Dec', DREIT: 9600, USDC: 6400 },
];

/* ──────────────── Custom Chart Tooltip ──────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 neon-cyan rounded-lg px-4 py-3 shadow-xl">
      <p className="text-gold-400 text-sm font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-gold-300 text-sm font-semibold" style={{ color: p.color }}>
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

/* ═══════════════════════════ Investor Dashboard ═══════════════════════════ */

export default function Investor() {
  useDocumentTitle('Investor Dashboard');

  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isConfirmError, error: confirmError } = useWaitForTransactionReceipt({ hash });

  /* ─── Local State ─── */
  const [history, setHistory] = useState<TxRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toError, setToError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'DREIT' | 'USDC'>('DREIT');

  /* ─── Wagmi Reads ─── */
  const { data: balance } = useReadContract({
    ...CONTRACTS.token,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: kycStatus } = useReadContract({
    ...CONTRACTS.registry,
    functionName: 'isVerified',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: claimable } = useReadContract({
    ...CONTRACTS.token,
    functionName: 'getClaimableDividends',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: dividendPerToken } = useReadContract({
    ...CONTRACTS.token,
    functionName: 'dividendPerToken',
    query: { enabled: !!address },
  });

  const { data: usdcBalance } = useReadContract({
    ...CONTRACTS.usdc,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  /* ─── Effects ─── */
  useEffect(() => {
    const timer = setTimeout(() => setIsDataLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (address) {
      setIsLoadingHistory(true);
      getTransactionHistory(address)
        .then((data) => {
          const enhanced = data.map((tx: any) => {
            const isSend = tx.args?.from?.toLowerCase() === address?.toLowerCase();
            return {
              ...tx,
              type: isSend ? 'send' : 'receive',
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              amount: tx.args?.value ? (Number(tx.args.value) / 1e18).toFixed(4) : '0.00',
            };
          });
          setHistory(enhanced);
        })
        .catch(console.error)
        .finally(() => setIsLoadingHistory(false));
    }
  }, [address, isConfirmed]);

  useEffect(() => {
    if (isError) toast.error(`Transaction failed: ${error?.message || 'Unknown error'}`);
    if (isConfirmError) toast.error(`Confirmation failed: ${confirmError?.message || 'Unknown error'}`);
  }, [isError, error, isConfirmError, confirmError]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transaction confirmed!');
      setShowConfirmDialog(false);
    }
  }, [isConfirmed]);

  /* ─── Validation ─── */
  useEffect(() => {
    if (transferTo) {
      try { addressSchema.parse(transferTo); setToError(false); } catch { setToError(true); }
    } else { setToError(false); }
  }, [transferTo]);

  useEffect(() => {
    if (transferAmount) {
      try { amountSchema.parse(transferAmount); setAmountError(false); } catch { setAmountError(true); }
    } else { setAmountError(false); }
  }, [transferAmount]);

  /* ─── Helpers ─── */
  const isLoading = isPending || isConfirming;

  const formattedBalance = balance ? (Number(balance) / 1e18).toFixed(4) : '—';
  const formattedClaimable = claimable ? (Number(claimable) / 1e6).toFixed(4) : '—';
  const formattedUsdc = usdcBalance ? (Number(usdcBalance) / 1e6).toFixed(2) : '—';
  const formattedDpt = dividendPerToken ? (Number(dividendPerToken) / 1e6).toFixed(6) : '—';
  const numericBalance = balance ? Number(balance) / 1e18 : 0;
  const numericClaimable = claimable ? Number(claimable) / 1e6 : 0;

  const handleTransfer = () => {
    setValidationError(null);
    try {
      addressSchema.parse(transferTo);
      amountSchema.parse(transferAmount);
      setShowConfirmDialog(true);
    } catch (e: any) {
      if (e instanceof Error) setValidationError(e.message);
      toast.error(`Validation error: ${e.message}`);
    }
  };

  const confirmTransfer = () => {
    setShowConfirmDialog(false);
    writeContract({
      ...CONTRACTS.token,
      functionName: 'transfer',
      args: [transferTo as `0x${string}`, BigInt(Math.floor(Number(transferAmount) * 1e18))],
    });
  };

  const handleMaxAmount = () => {
    if (numericBalance > 0) setTransferAmount(numericBalance.toFixed(4));
  };

  /* ─── Pagination ─── */
  const { page, setPage, totalPages, paginated } = usePagination(history, 5);

  /* ─── Not Connected ─── */
  if (!isConnected) {
    return (
      <div className="card text-center py-16 neon-pulse-magenta">
        <UserCheck className="mx-auto text-gold-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gold-300 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400">Please connect your MetaMask wallet to view your investor dashboard.</p>
      </div>
    );
  }

  /* ═══════════════════════════ Render ═══════════════════════════ */
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
          Investor Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`badge-${kycStatus ? 'green' : 'red'}`}
        >
          KYC {kycStatus ? 'Verified' : 'Not Verified'}
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
            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="card relative overflow-hidden group neon-cyan">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold-400/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <Coins className="text-gold-400" size={20} />
                </div>
                <span className="text-gray-400 text-sm">DREIT Balance</span>
              </div>
              <div className="text-2xl font-bold text-gold-300">{formattedBalance}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <TrendingUp size={12} />
                <span>+12.5% this month</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="card relative overflow-hidden group neon-magenta">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="text-green-400" size={20} />
                </div>
                <span className="text-gray-400 text-sm">USDC Balance</span>
              </div>
              <div className="text-2xl font-bold text-gold-300">{formattedUsdc}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <TrendingUp size={12} />
                <span>+5.2% this month</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="card relative overflow-hidden group neon-green">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Sparkles className="text-blue-400" size={20} />
                </div>
                <span className="text-gray-400 text-sm">Claimable Dividends</span>
              </div>
              <div className="text-2xl font-bold text-gold-300">{formattedClaimable} USDC</div>
              <div className="flex items-center gap-1 mt-1 text-blue-400 text-xs">
                <TrendingUp size={12} />
                <span>Accumulating</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} className="card relative overflow-hidden group neon-violet">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <BarChart2 className="text-purple-400" size={20} />
                </div>
                <span className="text-gray-400 text-sm">Dividend Per Token</span>
              </div>
              <div className="text-2xl font-bold text-gold-300">{formattedDpt}</div>
              <div className="flex items-center gap-1 mt-1 text-purple-400 text-xs">
                <TrendingUp size={12} />
                <span>+0.8% this period</span>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* ─── Portfolio Chart ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="chart-container neon-blue"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gold-300 flex items-center gap-2">
            <BarChart2 size={20} />
            Portfolio Performance
          </h3>
          <div className="flex gap-2">
            {(['DREIT', 'USDC'] as const).map((tab) => (
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
              <linearGradient id="dreitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#B8860B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="usdcGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222230" />
            <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={activeChartTab}
              stroke={activeChartTab === 'DREIT' ? '#FFD700' : '#22C55E'}
              strokeWidth={3}
              fill={activeChartTab === 'DREIT' ? 'url(#dreitGradient)' : 'url(#usdcGradient)'}
              dot={{ fill: activeChartTab === 'DREIT' ? '#FFD700' : '#22C55E', r: 3, stroke: '#0A0A0F', strokeWidth: 2 }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ─── Claim Dividends ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card relative overflow-hidden neon-green"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/5 rounded-bl-full opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gold-300 flex items-center gap-2">
              <Sparkles size={20} />
              Claim Dividends
            </h3>
            <span className="text-xs text-gray-500">Pull-model distribution</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-gray-400 text-sm">Available to claim</p>
              <p className="text-4xl font-bold text-gold-300">{formattedClaimable} <span className="text-xl text-gray-400">USDC</span></p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => writeContract({ ...CONTRACTS.token, functionName: 'claimDividends' })}
              disabled={isLoading || numericClaimable === 0}
              className="btn-gold flex items-center gap-2 px-8 py-4 text-lg"
              data-testid="claim-button"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              Claim Dividends
            </motion.button>
          </div>

          {hash && (
            <p className="mt-4 text-sm text-gold-400 flex items-center gap-2">
              Transaction:
              <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline flex items-center gap-1">
                {hash.slice(0, 10)}...{hash.slice(-8)} <ExternalLink size={12} />
              </a>
            </p>
          )}

          {/* Claim History */}
          <div className="mt-6 pt-6 neon-cyan">
            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recent Claims</h4>
            <div className="space-y-2">
              {mockClaimHistory.map((claim, i) => (
                <div key={i} className="flex items-center justify-between bg-dark-700/50 rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center">
                      <Sparkles size={14} className="text-gold-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gold-300">+{claim.amount} USDC</span>
                      <span className="text-xs text-gray-500 ml-2">{claim.date}</span>
                    </div>
                  </div>
                  <span className="text-xs text-green-400">Claimed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Transfer DREIT ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card neon-orange"
      >
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <ArrowRightLeft size={20} />
          Transfer DREIT
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
            <input
              type="text"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              placeholder="0x..."
              className={`input-dark w-full ${toError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
              data-testid="transfer-to-input"
            />
            {toError && <p className="text-red-400 text-xs mt-1">Invalid Ethereum address</p>}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-gray-400">Amount</label>
              <button
                onClick={handleMaxAmount}
                className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1 px-2 py-0.5 rounded hover:bg-gold-400/10 transition-colors"
              >
                <Maximize2 size={10} />
                MAX
              </button>
            </div>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="0.00"
              className={`input-dark w-full ${amountError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`}
              data-testid="transfer-amount-input"
            />
            {amountError && <p className="text-red-400 text-xs mt-1">Must be a positive number</p>}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTransfer}
          disabled={isLoading || !transferTo || !transferAmount || toError || amountError}
          className="mt-4 btn-gold w-full md:w-auto"
          data-testid="transfer-button"
        >
          {isLoading && <Loader2 className="animate-spin inline mr-2" size={18} />}
          Send Transfer
        </motion.button>
        {validationError && <p className="text-red-400 text-sm mt-2">{validationError}</p>}

        {/* ─── Confirmation Dialog ─── */}
        <AnimatePresence>
          {showConfirmDialog && (
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
                className="bg-dark-800 neon-orange rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gold-300 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-gold-400" />
                    Confirm Transfer
                  </h3>
                  <button onClick={() => setShowConfirmDialog(false)} className="text-gray-400 hover:text-gray-200">
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="bg-dark-700 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Recipient</p>
                    <p className="text-sm font-mono text-gold-300 break-all">{transferTo}</p>
                  </div>
                  <div className="bg-dark-700 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Amount</p>
                    <p className="text-lg font-bold text-gold-300">{transferAmount} DREIT</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 btn-outline-gold py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmTransfer}
                    className="flex-1 btn-gold py-2 text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ─── Transaction History ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card neon-cyan"
      >
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <History size={20} />
          Transaction History
        </h3>
        {isLoadingHistory ? (
          <div className="text-center py-8 text-gray-400">
            <Loader2 className="animate-spin inline mr-2" />
            Loading transactions...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <History className="mx-auto text-dark-600 mb-3" size={40} />
            <p className="text-gray-400">No transactions found.</p>
            <p className="text-gray-500 text-sm mt-1">Your transfers will appear here.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {paginated.map((tx, i) => {
                const isSend = tx.type === 'send';
                const isReceive = tx.type === 'receive';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between bg-dark-700/50 p-3.5 rounded-lg neon-cyan transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isSend ? 'bg-red-500/10' : isReceive ? 'bg-green-500/10' : 'bg-gold-500/10'
                      }`}>
                        {isSend ? (
                          <ArrowUpRight size={16} className="text-red-400" />
                        ) : isReceive ? (
                          <ArrowDownLeft size={16} className="text-green-400" />
                        ) : (
                          <Sparkles size={16} className="text-gold-400" />
                        )}
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${
                          isSend ? 'text-red-400' : isReceive ? 'text-green-400' : 'text-gold-400'
                        }`}>
                          {isSend ? 'Sent' : isReceive ? 'Received' : 'Claim'}
                        </span>
                        {tx.date && <span className="text-xs text-gray-500 ml-2">{tx.date}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {tx.amount && (
                        <span className="text-sm font-semibold text-gold-300">{tx.amount} DREIT</span>
                      )}
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-500 hover:text-gold-300 transition-colors p-1 rounded hover:bg-gold-400/10"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {history.length > 5 && (
              <div className="flex items-center justify-between mt-4 pt-4 neon-cyan">
                <span className="text-xs text-gray-500">
                  Page {page} of {totalPages} ({history.length} transactions)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg neon-cyan text-gray-400 hover:text-gold-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg neon-cyan text-gray-400 hover:text-gold-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

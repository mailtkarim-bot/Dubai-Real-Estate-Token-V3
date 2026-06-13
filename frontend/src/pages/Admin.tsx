import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { CONTRACTS } from '../contracts';
import { addressSchema, amountSchema } from '../utils/validation';
import { Shield, Coins, Pause, Play, Snowflake, Loader2, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isConfirmError, error: confirmError } = useWaitForTransactionReceipt({ hash });


  // Handle errors
  useEffect(() => {
    if (isError) toast.error(`Transaction failed: ${error?.message || 'Unknown error'}`);
    if (isConfirmError) toast.error(`Transaction confirmation failed: ${confirmError?.message || 'Unknown error'}`);
  }, [isError, error, isConfirmError, confirmError]);

  // Handle success
  useEffect(() => {
    if (isConfirmed) toast.success('Transaction confirmed!');
  }, [isConfirmed]);

  const validateAndWrite = (fn: string, contract: any, args: any[], schema: any[]) => {
    console.error(null);
    try {
      schema.forEach((s, i) => s.parse(args[i]));
      writeContract({ ...contract, functionName: fn, args });
    } catch (e: any) {
      if (e instanceof Error) console.error(e.message);
      toast.error(`Validation error: ${e.message}`);
    }
  };

  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [dividendAmount, setDividendAmount] = useState('');
  const [freezeTarget, setFreezeTarget] = useState('');
  const [freezeReason, setFreezeReason] = useState('');

  const isLoading = isPending || isConfirming;

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

  const formattedSupply = totalSupply ? (Number(totalSupply) / 1e18).toLocaleString() : '0';

  const chartData = [
    { name: 'Jan', Tokens: 10000 },
    { name: 'Feb', Tokens: 15000 },
    { name: 'Mar', Tokens: 12000 },
    { name: 'Apr', Tokens: 20000 },
    { name: 'May', Tokens: 18000 },
    { name: 'Jun', Tokens: 25000 },
  ];

  if (!isConnected) {
    return (
      <div className="card text-center py-16">
        <Shield className="mx-auto text-gold-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gold-300 mb-2">Admin Access Required</h2>
        <p className="text-gray-400">Please connect an admin wallet to access the admin panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div whileHover={{ scale: 1.05 }} className="card">
          <div className="text-gray-400 text-sm">Total Supply</div>
          <div className="text-2xl font-bold text-gold-300">{formattedSupply} DREIT</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="card">
          <div className="text-gray-400 text-sm">Token Address</div>
          <div className="text-sm font-mono text-gold-400 truncate">{CONTRACTS.token.address}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="card">
          <div className="text-gray-400 text-sm">USDC Address</div>
          <div className="text-sm font-mono text-gold-400 truncate">{CONTRACTS.usdc.address}</div>
        </motion.div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="chart-container"
      >
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <BarChart2 size={20} />
          Token Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#FFD700" />
            <YAxis stroke="#FFD700" />
            <Tooltip contentStyle={{ backgroundColor: '#1A1A25', borderColor: '#FFD700' }} />
            <Legend />
            <Line type="monotone" dataKey="Tokens" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Mint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <Coins size={20} />
          Mint Tokens
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
            <input
              type="text"
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
              placeholder="0x..."
              className="input-dark w-full"
              data-testid="mint-to-input"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount (DREIT)</label>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="0.00"
              className="input-dark w-full"
              data-testid="mint-amount-input"
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => validateAndWrite('mint', CONTRACTS.token, [mintTo as `0x${string}`, BigInt(Math.floor(Number(mintAmount) * 1e18))], [addressSchema, amountSchema])}
          disabled={isLoading || !mintTo || !mintAmount}
          className="mt-4 btn-gold"
          data-testid="mint-button"
        >
          {isLoading && <Loader2 className="animate-spin inline mr-2" size={18} />}
          Mint Tokens
        </motion.button>
      </motion.div>

      {/* Distribute Dividends */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <Coins size={20} />
          Distribute Dividends
        </h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Amount (USDC)</label>
            <input
              type="number"
              value={dividendAmount}
              onChange={(e) => setDividendAmount(e.target.value)}
              placeholder="0.00"
              className="input-dark w-full"
              data-testid="dividend-amount-input"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => validateAndWrite('distributeDividends', CONTRACTS.token, [BigInt(Math.floor(Number(dividendAmount) * 1e6))], [amountSchema])}
            disabled={isLoading || !dividendAmount}
            className="btn-gold"
            data-testid="distribute-button"
          >
            {isLoading && <Loader2 className="animate-spin inline mr-2" size={18} />}
            Distribute
          </motion.button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Requires USDC approval. Make sure the contract has sufficient USDC allowance.
        </p>
      </motion.div>

      {/* Freeze / Unfreeze */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
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
              className="input-dark w-full"
              data-testid="freeze-target-input"
            />
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
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => validateAndWrite('freezeInvestor', CONTRACTS.compliance, [freezeTarget as `0x${string}`, freezeReason || 'Regulatory freeze'], [addressSchema])}
            disabled={isLoading || !freezeTarget}
            className="btn-outline-gold border-red-400 text-red-400 hover:bg-red-400/10"
            data-testid="freeze-button"
          >
            Freeze
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => validateAndWrite('unfreezeInvestor', CONTRACTS.compliance, [freezeTarget as `0x${string}`], [addressSchema])}
            disabled={isLoading || !freezeTarget}
            className="btn-outline-gold border-green-400 text-green-400 hover:bg-green-400/10"
            data-testid="unfreeze-button"
          >
            Unfreeze
          </motion.button>
        </div>
      </motion.div>

      {/* Pause / Unpause */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
          Emergency Controls
        </h3>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => writeContract({ ...CONTRACTS.token, functionName: 'pause' })}
            disabled={isLoading || isPaused}
            className="btn-outline-gold border-red-400 text-red-400 hover:bg-red-400/10"
          >
            <Pause size={16} className="inline mr-2" />
            Pause Contract
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => writeContract({ ...CONTRACTS.token, functionName: 'unpause' })}
            disabled={isLoading || !isPaused}
            className="btn-outline-gold border-green-400 text-green-400 hover:bg-green-400/10"
          >
            <Play size={16} className="inline mr-2" />
            Unpause Contract
          </motion.button>
        </div>
      </motion.div>

      {hash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="card bg-gold-500/5 border-gold-500/20"
        >
          <p className="text-sm text-gold-300">
            Transaction submitted:{' '}
            <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline">
              {hash.slice(0, 10)}...{hash.slice(-8)} ↗
            </a>
          </p>
        </motion.div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { CONTRACTS } from '../contracts';
import { addressSchema, amountSchema } from '../utils/validation';
import { Shield, Coins, Pause, Play, Snowflake, Loader2 } from 'lucide-react';

export default function Admin() {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isConfirmError, error: confirmError } = useWaitForTransactionReceipt({ hash });

  const [validationError, setValidationError] = useState<string | null>(null);

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
    setValidationError(null);
    try {
      schema.forEach((s, i) => s.parse(args[i]));
      writeContract({ ...contract, functionName: fn, args });
    } catch (e: any) {
      if (e instanceof Error) setValidationError(e.message);
      toast.error(`Validation error: ${e.message}`);
    }
  };

  const [mintTo, setMintTo] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [dividendAmount, setDividendAmount] = useState('');
  const [freezeTarget, setFreezeTarget] = useState('');

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
        <h1 className="text-3xl font-bold text-gold-300">Admin Panel</h1>
        <div className={`badge-${isPaused ? 'red' : 'green'}`}>
          {isPaused ? 'Paused' : 'Active'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-gray-400 text-sm">Total Supply</div>
          <div className="text-2xl font-bold text-gold-300">{formattedSupply} DREIT</div>
        </div>
        <div className="card">
          <div className="text-gray-400 text-sm">Token Address</div>
          <div className="text-sm font-mono text-gold-400 truncate">{CONTRACTS.token.address}</div>
        </div>
        <div className="card">
          <div className="text-gray-400 text-sm">USDC Address</div>
          <div className="text-sm font-mono text-gold-400 truncate">{CONTRACTS.usdc.address}</div>
        </div>
      </div>

      {/* Mint */}
      <div className="card">
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
        <button
          onClick={() => validateAndWrite('mint', CONTRACTS.token, [mintTo as `0x${string}`, BigInt(Math.floor(Number(mintAmount) * 1e18))], [addressSchema, amountSchema])}
          disabled={isLoading || !mintTo || !mintAmount}
          className="mt-4 btn-gold"
          data-testid="mint-button"
        >
          {isLoading && <Loader2 className="animate-spin inline mr-2" size={18} />}
          Mint Tokens
        </button>
      </div>

      {/* Distribute Dividends */}
      <div className="card">
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
          <button
            onClick={() => validateAndWrite('distributeDividends', CONTRACTS.token, [BigInt(Math.floor(Number(dividendAmount) * 1e6))], [amountSchema])}
            disabled={isLoading || !dividendAmount}
            className="btn-gold"
            data-testid="distribute-button"
          >
            {isLoading && <Loader2 className="animate-spin inline mr-2" size={18} />}
            Distribute
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Requires USDC approval. Make sure the contract has sufficient USDC allowance.
        </p>
      </div>

      {/* Freeze / Unfreeze */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <Snowflake size={20} />
          Freeze / Unfreeze Investor
        </h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
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
          <button
            onClick={() => validateAndWrite('freezeInvestor', CONTRACTS.compliance, [freezeTarget as `0x${string}`], [addressSchema])}
            disabled={isLoading || !freezeTarget}
            className="btn-outline-gold border-red-400 text-red-400 hover:bg-red-400/10"
            data-testid="freeze-button"
          >
            Freeze
          </button>
          <button
            onClick={() => validateAndWrite('unfreezeInvestor', CONTRACTS.compliance, [freezeTarget as `0x${string}`], [addressSchema])}
            disabled={isLoading || !freezeTarget}
            className="btn-outline-gold border-green-400 text-green-400 hover:bg-green-400/10"
            data-testid="unfreeze-button"
          >
            Unfreeze
          </button>
        </div>
      </div>

      {/* Pause / Unpause */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
          Emergency Controls
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => writeContract({ ...CONTRACTS.token, functionName: 'pause' })}
            disabled={isLoading || isPaused}
            className="btn-outline-gold border-red-400 text-red-400 hover:bg-red-400/10"
          >
            <Pause size={16} className="inline mr-2" />
            Pause Contract
          </button>
          <button
            onClick={() => writeContract({ ...CONTRACTS.token, functionName: 'unpause' })}
            disabled={isLoading || !isPaused}
            className="btn-outline-gold border-green-400 text-green-400 hover:bg-green-400/10"
          >
            <Play size={16} className="inline mr-2" />
            Unpause Contract
          </button>
        </div>
      </div>

      {hash && (
        <div className="card bg-gold-500/5 border-gold-500/20">
          <p className="text-sm text-gold-300">
            Transaction submitted:{' '}
            <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline">
              {hash.slice(0, 10)}...{hash.slice(-8)} ↗
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

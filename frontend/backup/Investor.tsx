import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-hot-toast';
import { CONTRACTS } from '../contracts';
import { addressSchema, amountSchema } from '../utils/validation';
import { getTransactionHistory } from '../utils/history';
import { Coins, UserCheck, ArrowRightLeft, DollarSign, Loader2, History } from 'lucide-react';

export default function Investor() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isConfirmError, error: confirmError } = useWaitForTransactionReceipt({ hash });
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (address) {
      setIsLoadingHistory(true);
      getTransactionHistory(address)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setIsLoadingHistory(false));
    }
  }, [address, isConfirmed]);

  useEffect(() => {
    if (isError) toast.error(`Transaction failed: ${error?.message || 'Unknown error'}`);
    if (isConfirmError) toast.error(`Transaction confirmation failed: ${confirmError?.message || 'Unknown error'}`);
  }, [isError, error, isConfirmError, confirmError]);

  useEffect(() => {
    if (isConfirmed) toast.success('Transaction confirmed!');
  }, [isConfirmed]);

  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleTransfer = () => {
    setValidationError(null);
    try {
      addressSchema.parse(transferTo);
      amountSchema.parse(transferAmount);
      
      writeContract({
        ...CONTRACTS.token,
        functionName: 'transfer',
        args: [transferTo as `0x${string}`, BigInt(Math.floor(Number(transferAmount) * 1e18))],
      });
    } catch (e: any) {
      if (e instanceof Error) setValidationError(e.message);
      toast.error(`Validation error: ${e.message}`);
    }
  };

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

  const isLoading = isPending || isConfirming;

  if (!isConnected) {
    return (
      <div className="card text-center py-16">
        <UserCheck className="mx-auto text-gold-400 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gold-300 mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400">Please connect your MetaMask wallet to view your investor dashboard.</p>
      </div>
    );
  }

  const formattedBalance = balance ? (Number(balance) / 1e18).toFixed(4) : '0';
  const formattedClaimable = claimable ? (Number(claimable) / 1e6).toFixed(4) : '0';
  const formattedUsdc = usdcBalance ? (Number(usdcBalance) / 1e6).toFixed(2) : '0';
  const formattedDpt = dividendPerToken ? (Number(dividendPerToken) / 1e6).toFixed(6) : '0';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gold-300">Investor Dashboard</h1>
        <div className={`badge-${kycStatus ? 'green' : 'red'}`}>
          KYC {kycStatus ? 'Verified' : 'Not Verified'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="text-gold-400" size={20} />
            <span className="text-gray-400 text-sm">DREIT Balance</span>
          </div>
          <div className="text-2xl font-bold text-gold-300">{formattedBalance}</div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-gold-400" size={20} />
            <span className="text-gray-400 text-sm">USDC Balance</span>
          </div>
          <div className="text-2xl font-bold text-gold-300">{formattedUsdc}</div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="text-gold-400" size={20} />
            <span className="text-gray-400 text-sm">Claimable Dividends</span>
          </div>
          <div className="text-2xl font-bold text-gold-300">{formattedClaimable} USDC</div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="text-gold-400" size={20} />
            <span className="text-gray-400 text-sm">Dividend Per Token</span>
          </div>
          <div className="text-2xl font-bold text-gold-300">{formattedDpt} USDC</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-gold-300 mb-4">Claim Dividends</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400">Available to claim</p>
            <p className="text-3xl font-bold text-gold-300">{formattedClaimable} USDC</p>
          </div>
          <button
                    onClick={() => writeContract({ ...CONTRACTS.token, functionName: 'claimDividends' })}
                    disabled={isLoading || Number(claimable || 0) === 0}
                    className="btn-gold flex items-center gap-2"
                    data-testid="claim-button"
                  >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            Claim Dividends
          </button>
        </div>
        {hash && (
          <p className="mt-4 text-sm text-gold-400">
            Transaction:{' '}
            <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="underline">
              {hash.slice(0, 10)}...{hash.slice(-8)} ↗
            </a>
          </p>
        )}
      </div>

      <div className="card">
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
              className="input-dark w-full"
              data-testid="transfer-to-input"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="0.00"
              className="input-dark w-full"
              data-testid="transfer-amount-input"
            />
          </div>
        </div>
        <button
          onClick={handleTransfer}
          disabled={isLoading || !transferTo || !transferAmount}
          className="mt-4 btn-gold w-full md:w-auto"
          data-testid="transfer-button"
        >
          {isLoading && <Loader2 className="animate-spin inline mr-2" size={18} />}
          Send Transfer
        </button>
        {validationError && <p className="text-red-400 text-sm mt-2">{validationError}</p>}
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-gold-300 mb-4 flex items-center gap-2">
          <History size={20} />
          Transaction History
        </h3>
        {isLoadingHistory ? (
          <div className="text-center py-4 text-gray-400"><Loader2 className="animate-spin inline mr-2" />Loading...</div>
        ) : history.length === 0 ? (
          <p className="text-gray-400">No transactions found.</p>
        ) : (
          <div className="space-y-2">
            {history.map((tx, i) => (
              <div key={i} className="flex justify-between items-center bg-dark-700 p-3 rounded">
                <span className="text-sm font-mono text-gold-300">
                  {tx.args.from?.toLowerCase() === address?.toLowerCase() ? 'Sent' : 'Received'}
                </span>
                <a href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-400">
                  {tx.transactionHash.slice(0, 10)}...
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

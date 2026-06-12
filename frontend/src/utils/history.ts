import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { CONTRACTS } from '../contracts';

const client = createPublicClient({
  chain: sepolia,
  transport: http('https://rpc.sepolia.org'),
});

export async function getTransactionHistory(address: `0x${string}`) {
  const transferFilter = await client.createContractEventFilter({
    abi: CONTRACTS.token.abi,
    address: CONTRACTS.token.address,
    eventName: 'Transfer',
    args: { from: address }, // This only filters by sender, might need to fetch both
  });

  const incomingFilter = await client.createContractEventFilter({
    abi: CONTRACTS.token.abi,
    address: CONTRACTS.token.address,
    eventName: 'Transfer',
    args: { to: address },
  });

  const outgoing = await client.getFilterLogs({ filter: transferFilter });
  const incoming = await client.getFilterLogs({ filter: incomingFilter });

  return [...outgoing, ...incoming].sort((a, b) => Number(b.blockNumber!) - Number(a.blockNumber!));
}

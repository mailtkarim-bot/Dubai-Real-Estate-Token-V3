import { abi as tokenAbi } from './abis/DubaiRealEstateToken.json';
import { abi as registryAbi } from './abis/IdentityRegistry.json';
import { abi as complianceAbi } from './abis/ComplianceEngine.json';

export const CONTRACTS = {
  token: {
    address: '0x20BA3Dfa13295020b23758474ee831fD8E0f629B' as `0x${string}`,
    abi: tokenAbi,
  },
  registry: {
    address: '0xadCEa5d2d447a324C7577E48E0E2be83fBBC45e9' as `0x${string}`,
    abi: registryAbi,
  },
  compliance: {
    address: '0xF5b23EFD5cb4C05D87FEF1E72766e08DAe5C54af' as `0x${string}`,
    abi: complianceAbi,
  },
  usdc: {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as `0x${string}`,
    abi: [
      {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function",
      },
      {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }],
        "name": "allowance",
        "outputs": [{ "name": "remaining", "type": "uint256" }],
        "type": "function",
      },
    ] as const,
  },
} as const;

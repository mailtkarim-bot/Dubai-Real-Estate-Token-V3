import { abi as tokenAbi } from './abis/DubaiRealEstateToken.json';
import { abi as registryAbi } from './abis/IdentityRegistry.json';
import { abi as complianceAbi } from './abis/ComplianceEngine.json';

export const CONTRACTS = {
  token: {
    address: '0x2fAD3898ccBdc4A933170B0d551bd10b8b659fc6' as `0x${string}`,
    abi: tokenAbi,
  },
  registry: {
    address: '0xECD85Ebd68a548705f902c6D244BfBA76f51F9Fc' as `0x${string}`,
    abi: registryAbi,
  },
  compliance: {
    address: '0x87b62081D607C022B2495D5B6555829fA84E33d6' as `0x${string}`,
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

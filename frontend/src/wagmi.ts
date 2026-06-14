import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DREIT - Dubai Real Estate Investment Token',
  projectId: 'dreit_frontend_demo',
  chains: [sepolia],
  ssr: false,
});

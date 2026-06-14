import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function CustomConnectButton() {
  return (
    <ConnectButton
      chainStatus="icon"
      accountStatus="address"
      showBalance={false}
    />
  );
}

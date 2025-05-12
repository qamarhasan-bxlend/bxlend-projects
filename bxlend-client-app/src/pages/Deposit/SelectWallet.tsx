import React from 'react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const CustomStyles = {
  background: 'linear-gradient(270deg, #00feb9 0%, #00fafd 100%)',
  color: '#172A4F',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

const SelectWallet = () => {
  return (
    <WalletModalProvider>
      <WalletMultiButton style={CustomStyles} />
    </WalletModalProvider>
  );
};

export default SelectWallet;

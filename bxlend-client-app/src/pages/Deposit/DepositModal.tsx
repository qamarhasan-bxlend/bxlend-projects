import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';

import SelectWallet from './SelectWallet';
import AssetInput from './AssetInput';
import { StyledClosebtn } from '../AccountCreated/VerificationPopUp/styled';

const DepositModal = ({ address, coin, show, onClose }) => {
  const [selectedAsset, setSelectedAsset] = useState(coin);

  const solanaNetwork = WalletAdapterNetwork.Devnet;
  const solanaEndpoint = clusterApiUrl(solanaNetwork);
  const solanaWallets = [new SolflareWalletAdapter()];

  const { isDark } = useSelector(({ isDark }) => isDark);

  useEffect(() => {
    setSelectedAsset(coin);
  }, [coin]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains('deposit-modal-overlay')) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [show, onClose]);

  return (
    <div className={`deposit-modal-overlay ${show ? 'show' : ''}`}>
      <div
        className="deposit-modal-content"
        style={{ background: isDark ? '#333' : '#fff', position: 'relative' }}
      >
        <h2 className="title">
          Try out depositing directly from your wallet by connecting via browser extension
        </h2>
        <StyledClosebtn
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -8,
            right: 9,
            fontWeight: 100,
            cursor: 'pointer',
          }}
        >
          +
        </StyledClosebtn>
        <ConnectionProvider endpoint={solanaEndpoint}>
          <WalletProvider wallets={solanaWallets} autoConnect>
            {selectedAsset === 'SOL' && <SelectWallet />}
            <AssetInput
              selectedAsset={selectedAsset}
              setSelectedAsset={setSelectedAsset}
              recipientAddress={address}
            />
          </WalletProvider>
        </ConnectionProvider>
      </div>
    </div>
  );
};

export default DepositModal;

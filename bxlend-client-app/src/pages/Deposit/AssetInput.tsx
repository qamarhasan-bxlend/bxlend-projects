import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import Web3 from 'web3';

import { Loader } from 'src/components/Loader';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';

const assets = ['SOL', 'ETH'];

const AssetInput = ({ selectedAsset, setSelectedAsset, recipientAddress }) => {
  const [balance, setBalance] = useState(0.0);
  const [inputValue, setInputValue] = useState('');
  const [usdValue, setUsdValue] = useState(0.0);
  const [rates, setRates] = useState({ SOL: 0.0, ETH: 0.0 });
  const [loading, setLoading] = useState(false);
  const { connected, publicKey, signTransaction } = useWallet();
  const dispatch = useDispatch();
  const disabled = !(+inputValue > 0);

  const { isDark } = useSelector(({ isDark }) => isDark);

  useEffect(() => {
    if (connected && publicKey && selectedAsset === 'SOL') {
      fetchSolanaBalance();
    } else if (selectedAsset === 'ETH') {
      fetchEthereumBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, selectedAsset, publicKey]);

  useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAsset]);

  const fetchSolanaBalance = async () => {
    setLoading(true);
    try {
      if (!publicKey) {
        throw new Error('Wallet is not connected');
      }

      const connection = new Connection(
        'https://solana-devnet.g.alchemy.com/v2/DqBoHxcQknHVdQgRRPDew-CRmmvfkT_G',
        'confirmed',
      );

      const solanaPublicKey = new PublicKey(publicKey);
      const balanceInLamports = await connection.getBalance(solanaPublicKey);
      const balanceInSol = balanceInLamports / 1e9;
      setBalance(balanceInSol);
    } catch (error) {
      console.error('Failed to fetch Solana balance:', error);
      dispatch(setAppAlert({ message: 'Failed to fetch Solana balance.' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchEthereumBalance = async () => {
    setLoading(true);
    try {
      const ethereumWallet = await connectEthereumWallet();
      if (!ethereumWallet) {
        throw new Error('Failed to connect to Ethereum wallet');
      }
      const { web3, address } = ethereumWallet;
      const balanceInWei = await web3.eth.getBalance(address);
      const balanceInEth = Web3.utils.fromWei(balanceInWei, 'ether');
      setBalance(parseFloat(balanceInEth));
    } catch (error) {
      console.error('Failed to fetch Ethereum balance:', error);
      dispatch(setAppAlert({ message: 'Failed to fetch Ethereum balance.' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchRates = async () => {
    setLoading(true);
    try {
      const [solResponse, ethResponse] = await Promise.all([
        request.get(`${PUBLIC_URL}/v1/tickers/SOL-USD`),
        request.get(`${PUBLIC_URL}/v1/tickers/ETH-USD`),
      ]);

      const solRate = solResponse.data.ticker.to;
      const ethRate = ethResponse.data.ticker.to;

      setRates({ SOL: solRate, ETH: ethRate });
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      dispatch(setAppAlert({ message: 'Failed to fetch rates.', isSuccess: false }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    convertToUsd(value);
  };

  const handleMaxClick = () => {
    setInputValue(String(balance));
    convertToUsd(balance);
  };

  const convertToUsd = (value) => {
    const rate = rates[selectedAsset];
    setUsdValue(value * rate);
  };

  const displayBalance = (balance) => {
    const precision = selectedAsset === 'SOL' ? 6 : 4;
    return balance.toFixed(precision);
  };

  const connectEthereumWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        console.log('Connected to Ethereum address:', address);
        return { web3, address };
      } catch (error) {
        console.error('Failed to connect to MetaMask:', error);
        return;
      }
    } else {
      console.error('MetaMask is not installed');
      return;
    }
  };

  const handleDeposit = async () => {
    if (selectedAsset === 'SOL') {
      await depositSolana();
    } else if (selectedAsset === 'ETH') {
      await depositEthereum();
    }
  };

  const depositSolana = async () => {
    setLoading(true);
    try {
      if (!publicKey) {
        throw new Error('Solana wallet is not connected');
      }

      const connection = new Connection(
        'https://solana-devnet.g.alchemy.com/v2/DqBoHxcQknHVdQgRRPDew-CRmmvfkT_G',
        'confirmed',
      );

      const { blockhash } = await connection.getRecentBlockhash('finalized');

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: +inputValue * 1e9,
        }),
      );

      if (signTransaction) {
        const signedTransaction = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log('Transaction successful with signature:', signature);
        dispatch(setAppAlert({ message: 'SOL deposit successful!', isSuccess: true }));
        fetchSolanaBalance();
      }
    } catch (error) {
      console.error('Failed to deposit SOL:', error);
      dispatch(setAppAlert({ message: 'Failed to deposit SOL.', isSuccess: false }));
    } finally {
      setInputValue('');
      setLoading(false);
    }
  };

  const depositEthereum = async () => {
    setLoading(true);
    try {
      const ethereumWallet = await connectEthereumWallet();
      if (!ethereumWallet) {
        throw new Error('Failed to connect to Ethereum wallet');
      }
      const { web3, address } = ethereumWallet;

      const transaction = await web3.eth.sendTransaction({
        from: address,
        to: recipientAddress,
        value: Web3.utils.toWei(inputValue, 'ether'),
      });

      console.log('Transaction successful with hash:', transaction.transactionHash);
      dispatch(setAppAlert({ message: 'ETH deposit successful!', isSuccess: true }));
      fetchEthereumBalance();
    } catch (error) {
      console.error('Failed to deposit ETH:', error);
      dispatch(setAppAlert({ message: 'Failed to deposit ETH.', isSuccess: false }));
    } finally {
      setLoading(false);
    }
  };

  if (!connected && selectedAsset === 'SOL') {
    return null;
  }

  return (
    <>
      <div className="asset-input-container" style={{ background: isDark ? 'none' : '#172a4f' }}>
        <div className="content">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Please enter the value here"
          />
          <button onClick={handleMaxClick} disabled={loading} className={loading ? 'disabled' : ''}>
            MAX
          </button>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            style={{ background: isDark ? '#333' : '#172a4f' }}
          >
            {assets.map((asset) => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
        </div>
        <div className="balance wrapper">
          <div className="usd-value">
            <span>$</span>
            {loading ? <Loader size={14} /> : usdValue.toFixed(2)}
          </div>
          <div className="balance">
            Balance {loading ? <Loader size={14} /> : displayBalance(balance)}
          </div>
        </div>
        <div className="rate-row">
          <div>Exchange rate</div>
          <div>
            {loading ? <Loader size={14} /> : `1 ${selectedAsset} = $${rates[selectedAsset]}`}
          </div>
        </div>
      </div>
      <button
        onClick={handleDeposit}
        className={`try-wallet-btn submit-btn ${disabled ? 'disabled' : ''}`}
        disabled={disabled}
      >
        Submit
      </button>
    </>
  );
};

export default AssetInput;

import React, { useState } from 'react';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Modal } from 'src/components/Modal';
import { Input } from 'src/components/Input';
import { Loader } from 'src/components/Loader';

import { useDispatch } from 'src/store/useDispatch';
import { PUBLIC_URL } from 'src/configs';
import { setAppAlert } from 'src/store/slice/appAlert';
import request from 'src/request';

const WalletAddressModal = ({ open, onClose }) => {
  const [wallet, setWallet] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleWalletSetUp = () => {
    setLoading(true);

    request
      .put(`${PUBLIC_URL}/presale/client/presale-user`, {
        receiving_wallet: wallet,
      })
      .then(() => {
        dispatch(
          setAppAlert({
            message: 'You have successfully added wallet address',
            isSuccess: true,
          }),
        );
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong.',
            isSuccess: false,
          }),
        );
      })
      .finally(() => {
        onClose();
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Container padding="1.5rem">
        <Container fontWeight={600} fontSize="1.31rem" paddingBottom="1.25rem">
          Wallet Address
        </Container>
        <Container paddingBottom="1.25rem">
          To receive your BXT tokens, please select your wallet address and enter it in the input
          box below. You will receive the BXT tokens at this address after the token sale ends.
        </Container>
        <Input
          label="Enter your Ethereum address"
          placeholder="Wallet address"
          value={wallet}
          onChange={(e) => setWallet(e.currentTarget.value)}
        />
        <Container paddingBottom="1.25rem">
          Note: Address is the receiving wallet of an ERC20 Smart Chain on any non custodial wallet.
        </Container>
        <Container>
          DO NOT USE your exchange wallet address OR if you don`t have a private key of your
          address. You WILL NOT receive your token and you WILL LOSE YOUR FUNDS if you do.
        </Container>
      </Container>
      <Container display="flex" justifyContent="center">
        <Button text="Add Wallet" disabled={!wallet.length} onClick={() => handleWalletSetUp()} />
      </Container>
    </Modal>
  );
};

export default WalletAddressModal;

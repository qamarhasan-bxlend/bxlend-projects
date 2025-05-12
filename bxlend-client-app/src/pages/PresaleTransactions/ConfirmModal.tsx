import React, { useState } from 'react';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import { Input } from 'src/components/Input';
import { Modal } from 'src/components/Modal';
import OrderDetails from './OrderDetails';

interface ConfirmTrxModal {
  onConfirm: () => void;
  onClose: () => void;
  receipt: any;
  blockchainTrxId: string;
  setReceipt: any;
  setBlockchainTrxId: any;
  trx: any;
}

const ConfirmTrx: React.FC<ConfirmTrxModal> = ({
  onConfirm,
  onClose,
  setReceipt,
  setBlockchainTrxId,
  blockchainTrxId,
  receipt,
  trx,
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setReceipt(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveReceipt = () => {
    setReceipt(null);
    setPreview(null);
  };

  return (
    <Modal isOpen onClose={onClose}>
      <Container textAlign="center" fontWeight={600} fontSize="1.25rem" paddingBottom="1.5rem">
        Do you want to confirm order?
      </Container>
      <OrderDetails order={trx} />
      <Container>
        <Container marginBottom="2rem">
          <Container display="flex" justifyContent="space-between" alignItems="center">
            <Container fontWeight={500}>Order NO</Container>
            <Container>{trx.order_number}</Container>
          </Container>
          <Container display="flex" justifyContent="space-between" alignItems="center">
            <Container fontWeight={500}>Blockchain</Container>
            <Container>{trx.blockchain_name}</Container>
          </Container>
          <Container display="flex" justifyContent="space-between" alignItems="center">
            <Container fontWeight={500}>Coin Converted Price</Container>
            <Container>{trx.coin_converted_price}</Container>
          </Container>
          <Container display="flex" justifyContent="space-between" alignItems="center">
            <Container fontWeight={500}>Coin Price</Container>
            <Container>{trx.coin_price}</Container>
          </Container>
          <Container display="flex" justifyContent="space-between" alignItems="center">
            <Container fontWeight={500}>Amount in USD</Container>
            <Container>{trx.amount_in_usd}</Container>
          </Container>
          <Container display="flex" justifyContent="space-between" alignItems="center">
            <Container fontWeight={500}>Payment Coin</Container>
            <Container>{trx.payment_coin}</Container>
          </Container>
          <Container display="flex" justifyContent="space-between" alignItems="center">
            <Container fontWeight={500}>Token Allocation</Container>
            <Container>{trx.token_allocation}</Container>
          </Container>
        </Container>
      </Container>
      <Input
        label="Blockchain transaction ID"
        value={blockchainTrxId}
        onChange={(e) => {
          const value = e.currentTarget.value.replace(/[^a-zA-Z0-9]/g, '');
          setBlockchainTrxId(value);
        }}
      />
      <Container textAlign="center" paddingTop="1rem">
        {preview ? (
          <Container>
            <img
              src={preview}
              alt="Uploaded receipt"
              style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '1rem' }}
            />
            <br />
            <Button
              text="Remove Receipt"
              onClick={handleRemoveReceipt}
              styles={{ background: '#DC3545' }}
            />
          </Container>
        ) : (
          <Container display="flex" justifyContent="center" marginTop="0.5rem">
            <label
              htmlFor="upload-receipt"
              style={{
                cursor: 'pointer',
                border: '1px dashed gray',
                padding: '0.5rem 1rem',
                textAlign: 'center',
                display: 'inline-block',
              }}
            >
              Upload Receipt
            </label>
            <input
              id="upload-receipt"
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </Container>
        )}
      </Container>
      <Container display="flex" justifyContent="space-around" alignItems="center" paddingTop="3rem">
        <Button text="Confirm Order" onClick={onConfirm} disabled={!receipt || !blockchainTrxId} />
        <Button type="outlined" text="Close" onClick={onClose} />
      </Container>
    </Modal>
  );
};

export default ConfirmTrx;

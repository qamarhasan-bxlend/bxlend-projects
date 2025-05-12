import React from 'react';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import { Modal } from 'src/components/Modal';

interface CancelTrxProps {
  onCancel: () => void;
  onClose: () => void;
  trx: any;
}

const CancelTrx: React.FC<CancelTrxProps> = ({ onCancel, onClose, trx }) => {
  return (
    <Modal isOpen onClose={onClose}>
      <Container textAlign="center" fontWeight={600} fontSize="1.25rem" paddingBottom="1.5rem">
        Are you sure you want to cancel order?
      </Container>
      <Container>
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
      <Container
        display="flex"
        justifyContent="space-around"
        gap="2rem"
        alignItems="center"
        paddingTop="1.5rem"
      >
        <Button
          text="Cancel"
          $fullWidth
          onClick={onCancel}
          styles={{
            background: '#DC3545',
          }}
        />
        <Button $fullWidth type="outlined" text="Close" onClick={onClose} />
      </Container>
    </Modal>
  );
};

export default CancelTrx;

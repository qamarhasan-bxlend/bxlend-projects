import React from 'react';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import { Modal } from 'src/components/ModalNew';

interface ConfirmTrxModal {
  onConfirm: () => void;
  onClose: () => void;
  trx: any;
}

const ConfirmTrx: React.FC<ConfirmTrxModal> = ({ onConfirm, onClose, trx }) => {
  return (
    <Modal isOpen onClose={onClose}>
      <Container textAlign="center" fontWeight={600} fontSize="1.25rem" paddingBottom="1.5rem">
        Do you want to confirm order?
      </Container>
      <Container marginBottom="2rem">
        <Container display="flex" justifyContent="space-between" alignItems="center">
          <Container fontWeight={500}>Order NO</Container>
          <Container>{trx.order_number}</Container>
        </Container>
        <Container display="flex" justifyContent="space-between" alignItems="center">
          <Container fontWeight={500}>Blockchain</Container>
          <Container>{trx.blockchain}</Container>
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
      <Container display="flex" justifyContent="space-around" alignItems="center">
        <Button text="Confirm Order" onClick={onConfirm} />
        <Button type="outlined" text="Close" onClick={onClose} />
      </Container>
    </Modal>
  );
};

export default ConfirmTrx;

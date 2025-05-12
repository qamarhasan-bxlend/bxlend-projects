import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiCopy } from 'react-icons/bi';
import QRcode from 'react-qr-code';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import { Modal } from 'src/components/Modal';
import { AlertCopy } from 'src/components/Table/components/AlertCopy';

import { handleCopy, shortenString } from 'src/constants';
import { ROUTE_PRESALE_ORDERS } from 'src/routes';

const PaymentDetailsModal = ({ trx, onClose, amount, coin, blockchain }) => {
  const navigate = useNavigate();

  return (
    <Modal isOpen={!!trx} onClose={onClose}>
      <Container padding="1.5rem">
        <Container fontWeight={600} fontSize="1.31rem" paddingBottom="1.25rem">
          Your Payment Details
        </Container>
        <Container color="green" paddingBottom="1.25rem">
          Your order no. <span style={{ fontWeight: 600 }}>{trx.transaction_number}</span> has been
          placed successfully.
        </Container>
        <Container paddingBottom="1.25rem">
          Please send{' '}
          <span style={{ color: 'green', fontWeight: 600 }}>
            {amount} {coin}
          </span>{' '}
          to the address below. The token balance will appear in your account only after your
          transaction gets approved.
        </Container>
        <Container paddingBottom="0.75rem">
          Blockchain Network:{' '}
          <Container display="inline" fontWeight={600}>
            {blockchain}
          </Container>
        </Container>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="1.25rem"
          marginBottom="1rem"
        >
          <Container>
            <QRcode value={trx.deposit_address} size={140} />
          </Container>
          <Container width="100%">
            <Container display="flex" alignItems="center" gap="0.6rem">
              <Container display="flex" gap="0.6rem" justifyContent="center" flexWrap="wrap">
                <span>Send amount:</span>{' '}
                <span style={{ color: 'green', fontWeight: 600 }}>
                  {amount} {coin}
                </span>
              </Container>
            </Container>
          </Container>
        </Container>
        <Container
          width="calc(100% + 2rem)"
          padding="1rem"
          marginLeft="-1rem"
          background="rgba(0, 255, 185, 0.1)"
          border="1px solid #00feb9"
          borderRadius="10px"
        >
          <Container fontSize="0.8rem" fontWeight={600}>
            Deposit Address
          </Container>
          <Container
            padding="0.6rem 0"
            display="flex"
            gap="1rem"
            alignItems="center"
            justifyContent="space-between"
          >
            <Container>{shortenString(trx.deposit_address, 15, 15)}</Container>
            <button className="btn p-0" onClick={() => handleCopy(trx.deposit_address)}>
              <BiCopy />
            </button>
          </Container>
        </Container>
        <Container marginTop="1.25rem">
          <Button text="View Orders" $fullWidth onClick={() => navigate(ROUTE_PRESALE_ORDERS)} />
        </Container>
      </Container>
      <AlertCopy />
    </Modal>
  );
};

export default PaymentDetailsModal;

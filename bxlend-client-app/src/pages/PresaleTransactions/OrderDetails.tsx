import React from 'react';
import QRcode from 'react-qr-code';
import { BiCopy } from 'react-icons/bi';

import { Container } from 'src/components/Container';
import { AlertCopy } from 'src/components/Table/components/AlertCopy';

import { handleCopy, shortenString } from 'src/constants';

const OrderDetails = ({ order }) => {
  return (
    <Container marginBottom="2rem">
      <Container>
        <Container paddingBottom="1.25rem">
          Please send{' '}
          <span style={{ color: 'green', fontWeight: 600 }}>{order.coin_converted_price}</span> to
          the address below. The token balance will appear in your account only after your
          transaction gets approved.
        </Container>
        <Container paddingBottom="0.75rem">
          Blockchain Network:{' '}
          <Container display="inline" fontWeight={600}>
            {order.blockchain_name}
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
            <QRcode value={order.deposit_address} size={140} />
          </Container>
          <Container width="100%">
            <Container display="flex" alignItems="center" gap="0.6rem">
              <Container display="flex" gap="0.6rem" justifyContent="center" flexWrap="wrap">
                <span>Send amount:</span>{' '}
                <span style={{ color: 'green', fontWeight: 600 }}>
                  {order.coin_converted_price}
                </span>
              </Container>
            </Container>
          </Container>
        </Container>
        <Container
          width="100%"
          padding="1rem"
          background="rgba(0, 255, 185, 0.1)"
          border="1px solid #00feb950"
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
            <Container>{shortenString(order.deposit_address, 15, 15)}</Container>
            <button className="btn p-0" onClick={() => handleCopy(order.deposit_address)}>
              <BiCopy />
            </button>
          </Container>
        </Container>
      </Container>
      <AlertCopy />
    </Container>
  );
};

export default OrderDetails;

import React from 'react';

import { Container } from 'src/components/Container';

const Cautions = () => {
  return (
    <Container>
      <Container height="5rem"></Container>
      <Container
        paddingBottom="2rem"
        borderBottom="1px solid #cccc"
        textAlign="center"
        fontSize="1.5rem"
        fontWeight={600}
      >
        Cautions
      </Container>
      <Container padding="1.25rem 0">
        <ul>
          <li>
            Sale and purchase of ZRT take place between you and ZRT the Issuer and ProBit is neither
            a seller nor a party as any capacity in the sale of ZRT
          </li>
          <li>Purchase of ZRT is final and there will be no refunds or cancellations</li>
          <li>Please contact the Issuer for any inquiries regarding ZRT</li>
          <li>Distribution schedule of ZRT is to be determined by the Issuer</li>
          <li>
            <a href="#">View items</a>
          </li>
        </ul>
      </Container>
      <Container height="2.5rem"></Container>
      <h4>Notice for rates</h4>
      <ul>
        <li>
          BTC, ETC, BNB: USD price as published by CoinMArketCap on https://coinmarketcap.com daily
          at 23^00 (UTC)
        </li>
        <li>1 USDT = 1 USD</li>
        <li>
          PROB: the previous 10 minute volume weighted average price of PROB on ProBit Globals
          PROB/USDT market. (Price updated every minute)
        </li>
      </ul>
    </Container>
  );
};

export default Cautions;

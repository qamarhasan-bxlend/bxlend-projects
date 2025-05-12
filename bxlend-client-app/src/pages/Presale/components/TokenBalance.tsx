import React from 'react';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';

import { getSign } from 'src/constants';

import { StyledRoundSection } from '../styled';
import { IPresaleInfo, ITicker } from 'src/interfaces';

interface ITokenBalance {
  totalAllocation: number;
  tickers: ITicker[];
  presale: IPresaleInfo;
}

const TokenBalance: React.FC<ITokenBalance> = ({ totalAllocation, tickers, presale }) => {
  const token = localStorage?.getItem('access');
  const sign = getSign();

  const usd = tickers?.find((t) => t.pair === 'USDT/USD')?.last;
  const btc = tickers?.find((t) => t.pair === 'BTC/USDT')?.last;
  const eth = tickers?.find((t) => t.pair === 'ETH/USDT')?.last;

  return (
    <StyledRoundSection>
      <Glass margin="0 0 1rem">
        <Container position="relative">
          {!token && (
            <Container
              position="absolute"
              zIndex="999"
              top="0"
              left="0"
              borderRadius="1.25rem"
              width="calc(100% + 3rem)"
              height="calc(100% + 3rem)"
              marginTop="-1.5rem"
              marginLeft="-1.5rem"
              backdropFilter="blur(8px)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="0.25rem"
            >
              <span>
                <a href={sign}>Login</a>
              </span>
              <span>using password</span>
            </Container>
          )}
          <Container fontSize="1.25rem" paddingBottom="1.25rem" textAlign="center">
            Token Balance
          </Container>
          <Glass padding="0.5rem 1rem" margin="0 0 1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>{totalAllocation ?? 0}</Container>
              <Container>$BXT</Container>
            </Container>
          </Glass>
          <Glass>
            <Container display="flex" flexDirection="column" justifyContent="space-between">
              <Container>Balance in other currencies:</Container>
              <Container display="flex" justifyContent="space-between">
                <span>USD</span>
                <span>
                  {(
                    (totalAllocation * Number(presale.base_price.$numberDecimal)) /
                    Number(usd)
                  ).toFixed(4)}
                </span>
              </Container>
              <Container display="flex" justifyContent="space-between">
                <span>BTC</span>
                <span>
                  {(
                    (totalAllocation * Number(presale.base_price.$numberDecimal)) /
                    Number(btc)
                  ).toFixed(4)}
                </span>
              </Container>
              <Container display="flex" justifyContent="space-between">
                <span>ETH</span>
                <span>
                  {(
                    (totalAllocation * Number(presale.base_price.$numberDecimal)) /
                    Number(eth)
                  ).toFixed(4)}
                </span>
              </Container>
            </Container>
          </Glass>
        </Container>
      </Glass>
    </StyledRoundSection>
  );
};

export default TokenBalance;

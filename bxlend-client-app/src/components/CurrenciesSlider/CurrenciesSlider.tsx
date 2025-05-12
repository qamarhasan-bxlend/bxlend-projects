import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { Container } from 'src/components/Container';
import { ICurrency, ITicker } from 'src/interfaces';
import { getChange24, getCurrencyPairs } from 'src/constants';

const slide = (totalItems: number) => keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-${totalItems * 200}px);
  }
`;

const SliderWrapper = styled.div<{ $totalItems: number }>`
  display: flex;
  flex-direction: row;
  animation: ${(props) => slide(props.$totalItems)} ${(props) => props.$totalItems * 4}s infinite
    linear;
  width: ${(props) => props.$totalItems * 200}px;

  &:hover {
    animation-play-state: paused;
  }
`;

const CurrencyItem = styled.div<{ $isDark: boolean }>`
  flex-shrink: 0;
  border-right: ${({ $isDark }) => `1px solid ${$isDark ? '#423e3e' : '#f2f2f2'}`};
  border-left: ${({ $isDark }) => `1px solid ${$isDark ? '#423e3e' : '#f2f2f2'}`};
  transition: 0.5s all;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
  }

  &:hover {
    transform: scale(0.9);
    border: none;
  }
`;

const CurrenciesSlider: React.FC<{ currencies: ICurrency[]; tickers: ITicker[] }> = ({
  currencies,
  tickers,
}) => {
  const [showItems, setShowItems] = useState<ICurrency[]>([]);

  const { isDark } = useSelector(({ isDark }) => isDark);

  const getCryptoCurrencyLogo = (currency: string) => {
    if (currency === 'usd' || currency === 'hkd') {
      return `./assets/${currency.toLowerCase()}.png`;
    } else {
      const currencyIcon = currencies.find((item) => item.code.toLowerCase() === currency)?.icon;
      return currencyIcon?.replace('https://static.bxlend.com/', '');
    }
  };

  useEffect(() => {
    setShowItems([...currencies, ...currencies]);
  }, [currencies]);

  return (
    <Container
      width="calc(100% + 6rem)"
      marginLeft="-3rem"
      overflow="hidden"
      borderTop={`1px solid ${isDark ? '#423e3e' : '#f2f2f2'}`}
      borderBottom={`1px solid ${isDark ? '#423e3e' : '#f2f2f2'}`}
    >
      <Container display="flex" overflow="hidden" width="100%">
        <SliderWrapper $totalItems={currencies.length}>
          {showItems.map((currency, index) => {
            const ticker =
              currency.code === 'USDC'
                ? tickers.find((t) => t.pair === 'USDT/USD')
                : tickers.find((t) => t.pair.split('/')[0] === currency.code);

            const curr = { ...ticker, ...currency };
            const pairOne = getCurrencyPairs(curr.pair ?? '')[0];
            const pairTwo = getCurrencyPairs(curr.pair ?? '')[1];

            return curr.last ? (
              <CurrencyItem key={index} $isDark={isDark}>
                <Link
                  className="market-action-button mx-1"
                  to={`/trade?pair=${pairOne.toLowerCase()}-${pairTwo.toLowerCase()}`}
                >
                  <Container
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="1rem"
                  >
                    <Container>
                      <img
                        width={24}
                        height={24}
                        src={getCryptoCurrencyLogo(curr.code.toLowerCase())}
                      />
                    </Container>
                    <Container>{curr.code}</Container>
                  </Container>
                  <Container
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="1rem"
                  >
                    <Container>${curr.last}</Container>
                    <Container
                      color={
                        getChange24(String(curr.percent_change_24)) > 0
                          ? '#20bf55 !important'
                          : '#e51c1c !important'
                      }
                    >
                      ({curr.percent_change_24}%)
                    </Container>
                  </Container>
                </Link>
              </CurrencyItem>
            ) : null;
          })}
        </SliderWrapper>
      </Container>
    </Container>
  );
};

export default CurrenciesSlider;

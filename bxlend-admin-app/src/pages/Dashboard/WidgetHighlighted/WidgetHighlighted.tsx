import React from 'react';

import Text from 'src/components/Text';

import { StyledContainer, StyledWrap } from './styled';

const WidgetHighlighted = () => {
  return (
    <StyledContainer>
      <Text size={14} padding="0 0 4vh .25vw">
        Last activity on 21 Mar, 2023
      </Text>
      <br />
      <Text size={16}>Available balance</Text>
      <br />
      <Text size={18} color="#0057FF" padding="1vh 0 0 1vw">
        2.398748764 BTC
      </Text>
      <br />
      <Text size={14} padding="1vh 0 3vh 1vw">
        15,893.02 BTC
      </Text>
      <br />
      <Text size={16}>Available balance in USD</Text>
      <br />
      <Text size={18} color="#0057FF" padding="1vh 0 4vh 1vw">
        180,999.050
      </Text>
      <StyledWrap>
        <Text size={14} padding="0 0 2vh">
          Profit (7d)
        </Text>
        <Text size={14} padding="0 0 2vh" marginLeft>
          +0.0536 BTC
        </Text>
      </StyledWrap>
      <StyledWrap>
        <Text size={14}>Deposit in orders</Text>
        <Text size={14} marginLeft>
          15,893.02 BTC
        </Text>
      </StyledWrap>
    </StyledContainer>
  );
};

export default WidgetHighlighted;

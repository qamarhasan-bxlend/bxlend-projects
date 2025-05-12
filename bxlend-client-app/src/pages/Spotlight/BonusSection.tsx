import React from 'react';

import { Container } from 'src/components/Container';
import ListCheckboxItem from './ListCheckboxItem';
import Logo from 'src/assets/Logo.svg';

import { SPOTLIGHT_CHECKBOX_LIST_ITEMS, SPOTLIGHT_INFO_ITEMS } from 'src/constants';

import { StyledBonusWrap, StyledListItem, StyledPercentageItem } from './styled';
import { Input } from 'src/components/Input';

const BonusSection = () => {
  return (
    <StyledBonusWrap style={{ display: 'flex' }}>
      <Container
        padding="2.5% 2.5%"
        flexGrow={1}
        background="linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,26,121,1) 35%, rgba(0,212,255,1) 100%)"
        position="relative"
      >
        <Container
          padding="0.25rem 1.1rem"
          border="1px solid #fff"
          borderRadius="3.rem"
          width="fit-content"
          color="#fff"
        >
          Listing on Nov 10
        </Container>
        <img
          src={Logo}
          alt="icon"
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -40%)',
          }}
        />
        <Container
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          height="100%"
          paddingBottom="3em"
        >
          <Container
            textAlign="center"
            paddingBottom="1.25rem"
            borderBottom="1px solid #fff"
            marginTop="auto"
          >
            2023-10-23 09:00 ~ 2023-10-29 09:00 (UTC+3)
          </Container>
          <Container textAlign="center" padding="0.6rem 0">
            10% Bonus : PROB
          </Container>
          <Container textAlign="center">5% Bonus : USDT, BTC, ETH, BNB</Container>
        </Container>
      </Container>
      <Container padding="1.5% 2.5%" maxWidth="50%">
        <ul style={{ display: 'flex' }}>
          {['PROB', 'USDT', 'BTC', 'ETH', 'BNB'].map((item) => (
            <StyledListItem key={item} padding={item === 'BNB' ? '1% 5%' : undefined}>
              {item}
            </StyledListItem>
          ))}
        </ul>
        <Container position="relative" padding="0.75rem 0">
          <Container
            position="absolute"
            border="2px solid #ca1010"
            display="inline-block"
            borderRadius="1.25rem"
            padding="0 0.75rem"
            fontSize="0.75rem"
            color="#ca1010"
          >
            Bonus 10%
          </Container>
          <Container textAlign="right" paddingBottom="0.4rem">
            <a href="#">Buy PROB</a>
          </Container>
          <Container textAlign="right">
            Available Balance <b>0.00000000</b> PROB
          </Container>
        </Container>
        <Container position="relative">
          <Input value="" onChange={() => null} />
          <Container position="absolute" top="50%" transform="translate(0, -50%)" left="5%">
            Payment |
          </Container>
          <Container position="absolute" top="50%" transform="translate(0, -50%)" right="2%">
            PROB
          </Container>
        </Container>
        <ul style={{ display: 'flex', marginTop: '0.4rem' }}>
          {['25%', '50%', '75%', '100%'].map((item) => (
            <StyledPercentageItem key={item}>{item}</StyledPercentageItem>
          ))}
        </ul>
        <Container position="relative" marginTop="0.5rem">
          <Input value="" onChange={() => null} />
          <Container
            color="#333 !important"
            position="absolute"
            top="50%"
            transform="translate(0, -50%)"
            left="5%"
          >
            You get
          </Container>
          <Container
            color="#333 !important"
            position="absolute"
            top="50%"
            transform="translate(0, -50%)"
            right="2%"
          >
            ZRT
          </Container>
        </Container>
        <ul style={{ margin: '0.75rem 0' }}>
          {SPOTLIGHT_CHECKBOX_LIST_ITEMS.map(({ text, link }) => (
            <ListCheckboxItem key={text} text={text} link={link} />
          ))}
        </ul>
        <Container
          padding="0.6rem"
          textAlign="center"
          fontSize="1.25rem"
          background="#9e9e9e"
          width="100%"
        >
          End of sale
        </Container>
        <Container marginTop="0.6rem">
          {SPOTLIGHT_INFO_ITEMS.map(({ label, value }) => (
            <Container key={label} display="flex" justifyContent="space-between">
              <Container fontSize="0.8rem">{label}</Container>
              <Container>{value}</Container>
            </Container>
          ))}
        </Container>
      </Container>
    </StyledBonusWrap>
  );
};

export default BonusSection;

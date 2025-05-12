import React from 'react';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';

import { SOCIAL_MEDIAS } from 'src/constants';

import { StyledDatesWrap, StyledDetailsWrap, StyledText, StyledWrap } from './styled';

const GraphicsList = () => {
  return (
    <Container padding="0%">
      <h4 style={{ textAlign: 'center', paddingBottom: '0.6rem' }}>Details</h4>
      <Container height={30} />
      <StyledDetailsWrap>
        <Container style={{ minWidth: '50%' }}>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0" borderTop="1px solid #ccc">
            <StyledText>Name</StyledText>
            <span style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }}>Zororium</span>
          </Container>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0">
            <StyledText>Ticker</StyledText>
            <span style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }}>ZRT</span>
          </Container>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0">
            <StyledText>Price</StyledText>
            <span style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }}>1 ZRT = 0.00025 USDT</span>
          </Container>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0">
            <StyledText>Bonus</StyledText>
            <span style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }}>
              10% when buying with PROB 5%
            </span>
          </Container>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0">
            <StyledText>Hard cap</StyledText>
            <span style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }}>1,000,000 USDT</span>
          </Container>
        </Container>
        <Container minWidth="50%">
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0" borderTop="1px solid #ccc">
            <StyledText>Website</StyledText>
            <span>
              <a style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }} href="#">
                English
              </a>
            </span>
          </Container>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0">
            <StyledText>Contract address</StyledText>
            <span>
              <a style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }} href="#">
                0x40db4356751a9015
              </a>
            </span>
          </Container>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0">
            <StyledText>Token type</StyledText>
            <span style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }}>BEP-20</span>
          </Container>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0">
            <StyledText>Whitepaper</StyledText>
            <span>
              <a style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }} href="#">
                English
              </a>
            </span>
          </Container>
          <Container borderBottom="1px solid #ccc" padding="0.6rem 0">
            <StyledText>Social media</StyledText>
            <span>
              {SOCIAL_MEDIAS.map((s) => (
                <a key={s} style={{ fontSize: '0.9rem', paddingLeft: '0.5rem' }} href="#">
                  {s}
                </a>
              ))}
            </span>
          </Container>
        </Container>
      </StyledDetailsWrap>
      <Container height={50} />
      <h4 style={{ textAlign: 'center' }}>Vesting schedule</h4>
      <Container height={30} />
      <Container textAlign="center">
        <Button text="Learn more about vesting" />
        <Container height={30} />
        <StyledDatesWrap>
          <StyledWrap>
            <span style={{ fontWeight: 600 }}>Distribution date (UTC+3)</span>
            <span style={{ fontWeight: 600 }}>Distribution</span>
          </StyledWrap>
          <StyledWrap>
            <span>2023-11-10 11:00</span>
            <span>50%</span>
          </StyledWrap>
          <StyledWrap>
            <span style={{ fontWeight: 600 }}>2023-11-10 11:00</span>
            <span style={{ fontWeight: 600 }}>10%</span>
          </StyledWrap>
          <StyledWrap>
            <span>2023-11-10 11:00</span>
            <span>10%</span>
          </StyledWrap>
          <StyledWrap>
            <span>2023-11-10 11:00</span>
            <span>10%</span>
          </StyledWrap>
          <StyledWrap>
            <span>2023-11-10 11:00</span>
            <span>10%</span>
          </StyledWrap>
          <StyledWrap>
            <span>2023-11-10 11:00</span>
            <span>10%</span>
          </StyledWrap>
        </StyledDatesWrap>
      </Container>
    </Container>
  );
};

export default GraphicsList;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_BUY_TOKEN } from 'src/routes';
import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Glass } from 'src/components/Glass';
import ProgressBar from './ProgressSection';
import { formatNumberWithSpaces } from 'src/constants';
import { StyledRoundSection } from '../styled';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedGlass = styled(Glass)<{ delay: number }>`
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  animation-delay: ${({ delay }) => delay}s;
`;

const RoundSection = ({ presaleInfo, isEmailVerified, tickers }) => {
  const navigate = useNavigate();
  const soldPercentage = (presaleInfo.purchased_tokens / presaleInfo.total_tokens) * 100;
  const orderedPercentage = (presaleInfo.queued_tokens / presaleInfo.total_tokens) * 100;
  const basePrice = Number(presaleInfo.base_price.$numberDecimal);
  const currentStage = presaleInfo.current_stage;
  const nextStage = currentStage + 1;
  const nextStagePriceIncrement =
    presaleInfo.base_price_for_each_stage[nextStage - 1].price_increment;
  const nextStagePrice = nextStagePriceIncrement * basePrice + basePrice;
  const eth = tickers?.find((t) => t.pair === 'ETH/USDT');

  return (
    <StyledRoundSection>
      <Glass>
        <Container fontSize="1.25rem" paddingBottom="1.25rem" textAlign="center">
          Stage {presaleInfo.current_stage}
        </Container>
        {[
          <Container display="flex" justifyContent="space-between" key="1">
            <Container>Token remaining in stage</Container>
            <Container>
              {formatNumberWithSpaces(
                presaleInfo.total_tokens - presaleInfo.purchased_tokens - presaleInfo.queued_tokens,
              )}
            </Container>
          </Container>,
          <Container
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            key="2"
          >
            <ProgressBar percentage={soldPercentage} />
            <Container fontSize="1rem" fontWeight={600} marginLeft="auto">
              <span>SOLD</span> <span>{soldPercentage.toFixed(6)}%</span>
            </Container>
          </Container>,
          <Container
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            key="3"
          >
            <ProgressBar percentage={orderedPercentage} />
            <Container fontSize="1rem" fontWeight={600} marginLeft="auto">
              <span>ORDERED</span> <span>{orderedPercentage.toFixed(6)}%</span>
            </Container>
          </Container>,
          <Container key="4">
            <Container display="flex" justifyContent="space-between">
              <Container>BXT price in current stage</Container>
              <Container>{presaleInfo.base_price.$numberDecimal} USD</Container>
            </Container>
            <Container display="flex" justifyContent="space-between">
              <Container>Coin price (ETH/USD)</Container>
              <Container>{eth.last} USD</Container>
            </Container>
            <Container display="flex" justifyContent="space-between">
              <Container>The next stage price</Container>
              <Container>{nextStagePrice} USD</Container>
            </Container>
          </Container>,
          <Container display="flex" justifyContent="space-between" key="7">
            <Container>Tokens Sold In Total</Container>
            <Container>
              {formatNumberWithSpaces(
                presaleInfo.purchased_tokens * presaleInfo.base_price.$numberDecimal,
              )}
            </Container>
          </Container>,
        ].map((content, index) => (
          <AnimatedGlass padding="1rem" margin="0 0 1rem" delay={index * 0.2} key={index}>
            {content}
          </AnimatedGlass>
        ))}

        <Container display="flex" justifyContent="center">
          <Button
            text="Buy Token Now"
            disabled={!isEmailVerified}
            onClick={() => navigate(ROUTE_BUY_TOKEN)}
          />
        </Container>
      </Glass>
    </StyledRoundSection>
  );
};

export default RoundSection;

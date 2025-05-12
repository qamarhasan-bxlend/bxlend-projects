import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { RootState } from 'src/store/store';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { Input } from 'src/components/Input';
import { Button } from 'src/components/Button';
import GradientedArea from 'src/pages/Presale/components/GradientedArea';
import AddReferralCodeModal from './AddReferralCodeModal';

import { formatNumberWithSpaces } from 'src/constants';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const AnimatedContainer = styled(Container)<{ index: number }>`
  animation: ${slideIn} 0.4s ease-out forwards;
  animation-delay: ${({ index }) => index * 0.1}s;
  opacity: 0;
`;

const StepOne = ({ presaleInfo, amountUsd, setAmountUsd }) => {
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);

  return (
    <Glass>
      <Container
        display="flex"
        justifyContent="space-around"
        flexWrap="wrap"
        marginBottom="5rem"
        gap="4rem"
      >
        {presaleInfo.discounts.map((discount, index) => (
          <AnimatedContainer textAlign="center" id="this-one" key={index} index={index}>
            <GradientedArea>
              <Container padding="0 3rem" textAlign="center">
                <Container letterSpacing="0.6rem">BONUS</Container>
                <Container fontSize="3.75rem">{discount.discount * 100}%</Container>
              </Container>
            </GradientedArea>
            <Glass>
              Get{' '}
              <span style={{ color: '#198754', fontWeight: 600 }}>
                {formatNumberWithSpaces((discount.minimum_buy / 100) * (discount.discount * 100))}
              </span>{' '}
              BXT extra on
              <Container>
                <span style={{ color: '#198754', fontWeight: 600 }}>
                  {formatNumberWithSpaces(discount.minimum_buy)}
                </span>
                <span> BXT</span>
              </Container>
            </Glass>
          </AnimatedContainer>
        ))}
      </Container>
      <Container textAlign="center" paddingBottom="1.25rem" fontSize="1.75rem">
        Step 1
      </Container>
      <Glass width="fit-content" margin="0 auto">
        <Container paddingBottom="1.25rem" textAlign="center">
          Enter the amount in USD you want to spend to purchase BXT tokens
        </Container>
        <Container maxWidth="30rem" margin="0 auto">
          <Input
            label="Amount in USD"
            value={amountUsd}
            type="number"
            onChange={(e) => setAmountUsd(e.currentTarget.value)}
          />
        </Container>
        <Glass padding="1rem">
          {user.referred_by ? (
            <Container textAlign="center">
              <Container>You are referred by </Container>
              <Container>
                <strong>{user.referred_by}</strong>
              </Container>
            </Container>
          ) : (
            <Container textAlign="center">
              <Button
                type="outlined"
                text="Add Referral Code"
                onClick={() => setIsReferralModalOpen(true)}
              />
            </Container>
          )}
        </Glass>
      </Glass>
      <Container display="flex" justifyContent="space-around"></Container>
      <AddReferralCodeModal
        open={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </Glass>
  );
};

export default StepOne;

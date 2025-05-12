import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Container } from 'src/components/Container';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const StepContainer = styled(Container)<{ delay: number }>`
  animation: ${slideIn} 0.6s ease-out forwards;
  opacity: 0;
  animation-delay: ${(props) => props.delay}s;
`;

const StepNumber = styled(Container)`
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  border-radius: 50%;
  background: rgb(0, 254, 185);
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #172a4f !important;
  flex-shrink: 0;
`;

const StepsGuide = () => {
  const steps = [
    {
      number: 1,
      title: 'Select the Token and Copy the Wallet Address',
      description: 'Withdraw to Wallet Address',
    },
    {
      number: 2,
      title: 'Withdraw to Wallet Address',
      description:
        'Paste the copied wallet address on other exchange platforms and submit a withdrawal application',
    },
    {
      number: 3,
      title: 'Transfer Confirmation',
      description: 'Wait for the blockchain network to confirm the transfer',
    },
    {
      number: 4,
      title: 'Deposit Successful',
      description:
        'After the blockchain network has confirmed the transfer, BxLend will transfer the asset to your wallet address',
    },
  ];

  return (
    <Container padding="1.25rem 1.25rem 40px" display="flex" gap="3%">
      {steps.map((step, index) => (
        <StepContainer key={step.number} width="25%" delay={index * 0.3}>
          <Container display="flex" alignItems="center" gap="3%" paddingBottom="1rem">
            <StepNumber>{index + 1}</StepNumber>

            {index < steps.length - 1 && (
              <Container border="2px solid rgb(0, 254, 185)" width="100%"></Container>
            )}
          </Container>
          <Container fontSize="0.8rem" fontWeight={600}>
            {step.title}
          </Container>
          <Container color="grey" fontSize="0.8rem">
            {step.description}
          </Container>
        </StepContainer>
      ))}
    </Container>
  );
};

export default StepsGuide;

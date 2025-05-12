import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const StyledLoaderSpinner = styled.div<{ size?: number }>`
  width: ${({ size }) => `${size || 14}px`};
  height: ${({ size }) => `${size || 14}px`};
  border: 2px solid ${({ theme }) => theme.palette.teal};
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

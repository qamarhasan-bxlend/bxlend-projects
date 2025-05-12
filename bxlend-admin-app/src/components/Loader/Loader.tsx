import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const StyledLoaderSpinner = styled.div<{ size?: number }>`
  width: ${({ size }) => `${size || 14}px`};
  height: ${({ size }) => `${size || 14}px`};
  border: 2px solid #00feb9;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

interface LoaderProps {
  size?: number;
  overlay?: boolean;
}

export const Loader: FC<LoaderProps> = ({ size = 50, overlay = false }) => {
  return overlay ? (
    <Overlay>
      <StyledLoaderSpinner size={100} />
    </Overlay>
  ) : (
    <StyledLoaderSpinner size={size} />
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

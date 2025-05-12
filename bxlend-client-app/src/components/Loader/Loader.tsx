import React, { FC } from 'react';
import styled from 'styled-components';
import { StyledLoaderSpinner } from 'src/pages/Market/components/styled';

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

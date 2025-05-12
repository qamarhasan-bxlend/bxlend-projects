import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(50%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const StyledContainer = styled.div<{ isBg?: boolean }>`
  background: ${({ isBg }) => (isBg ? '#f0f2f5' : '#fff')};
  display: flex;
  flex-direction: column;
  gap: 2vh;
  padding: 0 3vw;
  justify-content: center;
  animation: ${fadeIn} 1s ease-out;

  @media only screen and (max-width: 768px) {
    display: ${({ isBg }) => (isBg ? 'none' : 'flex')};
    padding: ${({ isBg }) => (isBg ? '0 3vw' : '0 5vw')};
  }
`;

export const StyledLogInButton = styled.button`
  border: none;
  background: #174b8a;
  text-align: center;
  border-radius: 5px;
  margin: 2vh 0;
  cursor: pointer;

  & > a {
    color: #fff;
    text-decoration: none;
    padding: 0.75rem 0;
    display: inline-block;
    width: 100%;
  }
`;

export const StyledLogInWrap = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 1.5fr 1fr;

  @media only screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledText = styled.span<{ align?: string }>`
  color: #5e5c54;
  text-align: ${({ align }) => align || 'auto'};
`;

export const StyledImage = styled.img<{ height?: string; align?: string }>`
  height: ${({ height }) => (height ? `${height}` : 'auto')};
  margin: ${({ align }) => (align ? '0 auto' : '0')};
`;

export const StyledLogoText = styled.span`
  font-style: normal;
  font-weight: 400;
  font-size: 2.75rem;
  font-family: Iceberg;
  background: linear-gradient(179.2deg, #ffd600 -5.19%, #f6e9bb 70.26%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const StyledLogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

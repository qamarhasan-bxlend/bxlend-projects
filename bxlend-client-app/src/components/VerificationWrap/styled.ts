import styled from 'styled-components';

export const StyledVerificationWrap = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 70vh;
`;

export const StyledBgWrap = styled.div`
  justify-content: space-between;
  position: relative;
  height: 70vh;

  @media (max-width: 1024px) {
    display: none;
  }
`;

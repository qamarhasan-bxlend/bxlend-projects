import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(6.25rem);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(18.75rem);
  }
`;

export const StyledNotificationWrapper = styled.div<{ $isVisible: boolean; $isSuccess?: boolean }>`
  position: fixed;
  top: 7.5rem;
  right: 1.755rem;
  animation: ${({ $isVisible }) => ($isVisible ? slideIn : slideOut)} 0.5s ease-in-out forwards;
  transition: visibility 0.5s ease-in-out;
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  background: #fff;
  box-shadow: 0px 0px 0.9375rem 0.0625rem rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
  border-bottom: ${({ $isSuccess }) => `0.375rem solid ${$isSuccess ? '#00FEB9' : 'red'}`};
  padding: 1.25rem;
  text-align: center;
  z-index: 9999;
  max-width: 30%;
`;

export const StyledContent = styled.div`
  &::first-letter {
    text-transform: capitalize;
  }
`;

export const StyledPaginationButtonsWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

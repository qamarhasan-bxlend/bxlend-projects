import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
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
    transform: translateX(100%);
  }
`;

export const StyledModalOverlay = styled.div<{ isOpen: boolean; loading?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  z-index: 101;
  animation: ${({ isOpen }) => (isOpen ? 'fadeIn 0.3s' : 'fadeOut 0.3s')};
`;

export const StyledModalContainer = styled.div<{ isOpen: boolean; loading?: boolean }>`
  position: relative;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? `calc(100vw - 1040px)` : '100vw')};
  width: 65rem;
  height: 100%;
  background-color: white;
  display: ${({ loading }) => (loading ? 'flex' : 'block')};
  align-items: ${({ loading }) => (loading ? 'center' : 'auto')};
  justify-content: ${({ loading }) => (loading ? 'center' : 'auto')};
  z-index: 2;
  animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.3s ease-in-out;
  overflow: auto;
  padding: 1.25rem 1.25rem 3.5rem;
  transition: 1s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const StyledCloseButton = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  cursor: pointer;
  font-size: 1.5rem;
`;

export const StyledButtonsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.25rem;
  padding-top: 1.25rem;
  margin-bottom: 2rem;
`;

export const StyledButtonCancel = styled.button`
  background: #172a4f;
  border-radius: 1.25rem;
  border: none;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  color: #fff;
  min-width: 6rem;
`;

export const StyledButtonOk = styled.button<{ isDisabled: boolean }>`
  background: ${({ isDisabled }) => isDisabled ? '#ccc' : '#172a4f'};
  border-radius: 1.25rem;
  border: none;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  color: #fff;
  min-width: 6rem;
`;

export const StyledTextarea = styled.textarea`
  width: calc(100% - 50px);
  padding: 1.25rem;
  min-height: 6rem;
  resize: none;
  outline: none;
`;

export const StyledImg = styled.img`
  max-width: 20rem;
  max-height: 20rem;
`;

export const StyledWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

export const StyledSelect = styled.select`
  padding: 0.5rem;
  margin-bottom: 1.25rem;
  outline: none;
`;

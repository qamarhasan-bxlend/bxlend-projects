import styled from 'styled-components';

export const StyledOptionsModal = styled.div`
  width: 12rem;
  padding: 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  z-index: 10;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0px 0px 1.25rem 3px rgba(0, 0, 0, 0.25);
  position: absolute;
  top: 4rem;
  right: 0;
`;

export const StyledOption = styled.div<{ isAlign?: boolean; isCursor?: boolean }>`
  display: flex;
  gap: 1.25rem;
  align-items: ${({ isAlign }) => (isAlign ? 'center' : 'flex-start')};
  cursor: ${({ isCursor }) => (isCursor ? 'pointer' : 'default')};
`;

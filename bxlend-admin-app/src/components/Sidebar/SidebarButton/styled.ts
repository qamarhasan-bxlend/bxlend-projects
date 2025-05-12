import styled, { css } from 'styled-components';

export const StyledSidebarButton = styled.button<{ isActive: boolean }>`
  border: none;
  display: flex;
  align-items: center;
  background: #fafafa;
  border-radius: 0.5rem;

  &:hover {
    background: #00feb9;
    border-radius: 0.5rem;
  }

  ${(props) =>
    props.isActive &&
    css`
      background: #00feb9;
      border-radius: 0.5rem;
    `}
`;

export const StyledIcon = styled.span`
  padding: 0.25rem 0.75rem;
  min-width: 1.25rem;
  display: flex;
  width: 1rem;
`;

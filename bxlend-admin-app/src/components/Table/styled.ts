import { styled, css } from 'styled-components';

export const StyledTable = styled.div`
  background: #fff;
  padding: 2rem 1rem;
  border-radius: 3.5rem;
  font-size: calc(0.75rem + 0.4vw);
  height: 100%;
  overflow: scroll;
`;

export const StyledRow = styled.div<{ isHeader?: boolean; columns?: string }>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns};
  padding: 2vh 0;
  min-width: 45rem;

  ${(props) =>
    props.isHeader &&
    css`
      color: #8c918c;
      padding-bottom: 4vh;
    `}

  ${(props) =>
    !props.isHeader &&
    css`
      border-top: 1px solid #e7efff;
      & > span:nth-child(1) {
        font-weight: 600;
      }

      & > span:nth-child(2) {
        font-family: Inter-Medium;
      }
    `}

    .nested_cell {
      overflow-wrap: anywhere;
    }

    .nested_cell > span:nth-child(3) {
    display: inline-block;
    color: #aabdad;
    font-weight: 400;
    padding-top: 2%;
  }

  svg {
    cursor: pointer;
  }
`;

export const StyledActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledBadge = styled.span<{ bg: string }>`
  display: flex;
  align-self: baseline;

  & > span {
    background: ${({ bg }) => bg};
    color: #fff;
    padding: 4px 1rem;
    border-radius: 1.25rem;
    text-transform: lowercase;
  }

  & > span:first-letter {
    text-transform: capitalize;
  }
`;

export const StyledCopyButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #007bff;
  position: absolute;
  left: -5px;
  top: -1.5rem;
  padding: 0;
`;

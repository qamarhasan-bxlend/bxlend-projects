/* eslint-disable indent */
import styled from 'styled-components';

export const StyledTable = styled.div<{ $columns?: string; $isDark: boolean }>`
  display: grid;
  width: 100%;
  padding-bottom: 1rem;

  .header {
    background: #f7f4f4;
    border-radius: 0.5rem;
    border: 0;
    display: grid;
    grid-template-columns: ${({ $columns }) => $columns || 'auto'};
    // TODO: FIX COLOR PRIORITY ISSUE
    color: ${({ theme }) => `${theme.palette.primary} !important`};
    padding: 0.5rem 0.75rem;
    margin-bottom: 1rem;
    width: calc(100% + 1.5rem);
    margin-left: -0.75rem;
  }

  .cell {
    padding: 0.5rem 0;
    text-align: left;
    font-size: 0.87rem;
    transition: all 0.3s ease-in-out;
  }

  .table-row {
    cursor: pointer;
    border-radius: 0.5rem;
    transition: background 0.2s;
    display: grid;
    grid-template-columns: ${({ $columns }) => $columns || 'auto'};
    padding: 0.5rem 0;
    align-items: center;

    &:hover {
      background: ${({ $isDark }) => ($isDark ? '#444' : '#f1f1f1')};
      color: ${({ $isDark, theme }) => ($isDark ? '#fff' : theme.palette.dark)};

      .cell {
        padding: 0.5rem 0.75rem;
      }
    }
  }

  @media (max-width: 768px) {
    .header {
      grid-template-columns: ${({ $columns }) => $columns || 'auto'};
    }

    .cell {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .header {
      display: none;
    }

    .table-row {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: ${({ $isDark }) =>
        $isDark ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 4px 8px rgba(0, 0, 0, 0.1)'};
    }

    .cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: right;
      padding: 0.5rem 0;
      width: 100%;

      &:before {
        content: attr(data-label);
        font-weight: bold;
        text-transform: capitalize;
        text-align: left;
      }
    }
  }
`;

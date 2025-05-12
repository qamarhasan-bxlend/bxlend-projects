import styled from 'styled-components';
import { slideDown } from 'src/pages/Home/components/styled';

export const StyledTabs = styled.ul`
  display: flex;
  gap: 6vw;
  margin-bottom: 1rem;
  padding-left: 0.62rem;

  @media screen and (max-width: 500px) {
    font-size: 0.87rem;
  }

  & > li {
    font-weight: 500;
    list-style: none;
    padding: 14px 0;
  }
`;

export const StyledTabsWrap = styled.div`
  padding: 1.5vw;
  margin-top: 0.62rem;
  border-radius: 1.25rem;
  box-shadow: 0px 0px 15px 3px rgba(0, 0, 0, 0.25);

  @media screen and (max-width: 500px) {
    box-shadow: none;
    border: none;
    padding-left: 0;
    padding-right: 0;
  }
`;

export const StyledOptionsModal = styled.div<{ $isDark: boolean }>`
  width: 13.75rem;
  padding: 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: absolute;
  top: 5.35rem;
  right: 2vw;
  z-index: 10;
  background: #fff;
  border-radius: 0.62rem;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);

  background: ${({ $isDark }) => ($isDark ? 'rgba(20, 20, 20, 1)' : 'rgba(255, 255, 255, 1)')};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 8px 32px rgba(255, 255, 255, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.25)'};
  transition: transform 0.3s ease, background-color 0.4s ease, box-shadow 0.4s ease;
  animation: ${slideDown} 0.8s ease-out forwards;

  .option {
    font-weight: 500;
    font-size: 0.87rem;
    cursor: pointer;
    color: ${({ $isDark, theme }) => ($isDark ? theme.palette.white : theme.palette.black)};
  }
`;

export const StyledPasswordDropdown = styled.div<{ $isDark: boolean }>`
  position: absolute;
  top: 2.5rem;
  left: -9.3rem;
  width: 12.5rem;
  background: ${({ $isDark }) => ($isDark ? 'rgba(20, 20, 20, 1)' : 'rgba(255, 255, 255, 1)')};
  border-radius: 8px;
  padding: 0.62rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.62rem;
  box-shadow: 0 4px 0.75rem rgba(0, 0, 0, 0.2);

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      gap: 0.62rem;
      padding: 8px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

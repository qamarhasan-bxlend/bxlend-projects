import styled from 'styled-components';

export const StyledAside = styled.aside`
  /* padding-top: 10rem; */

  & > ul {
    display: flex;
    flex-direction: column;
    gap: 3.12rem;
  }

  & > ul > li {
    list-style: none;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  & > ul > li > a {
    text-decoration: none;
  }
`;

export const StyledAsideBtn = styled.button`
  border: none;
  background: none;
  padding: 2vh 2vw;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1vw;
`;

export const StyledBtnsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
`;

export const StyledTable = styled.div`
  -webkit-box-shadow: 0px 0px 15px 3px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 0px 0px 15px 3px rgba(0, 0, 0, 0.25);
  box-shadow: 0px 0px 15px 3px rgba(0, 0, 0, 0.25);
  width: -webkit-fill-available;
  border-radius: 1.25rem;
  padding: 1rem 2rem;
  position: relative;
`;

export const StyledOrdersWrap = styled.div`
  display: flex;
  gap: 2rem;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    padding-right: 0;

    & > aside {
      height: auto;
      width: calc(100% + 24px);
    }

    & > aside > ul > li > a {
      display: flex;
      justify-content: center;
    }
  }
`;

export const StyledButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0 0 1.5rem;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

export const StyledWrap = styled.div<{ $margin?: string }>`
  display: flex;
  flex-wrap: ${({ $margin }) => ($margin ? 'nowrap' : 'wrap')};
  gap: 0.62rem;
  margin: ${({ $margin }) => $margin || 0};
  align-self: baseline;

  @media only screen and (max-width: 600px) {
    margin-left: 0;
  }
`;

export const StyledRow = styled.div<{ $columns: string; $isHeader?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  background: ${({ $isHeader }) => ($isHeader ? '#F2F2F2' : 'none')};
  padding: ${({ $isHeader }) => ($isHeader ? '.6vw 2vw' : '0')};
  border-radius: ${({ $isHeader }) => ($isHeader ? '1.25rem' : '0')};
`;

export const StyledDataRow = styled.div<{ $columns: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: center;
  padding: 0.6vw 2vw;
`;

export const StyledPaginationButtonsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
  justify-content: center;
`;

export const StyledButton = styled.button<{ width?: number; gap?: number; $hasDropDown?: boolean }>`
  display: flex;
  gap: ${({ gap }) => `${gap || 2.5}vw`};
  border: 1px solid #cfcfcf;
  border-radius: 1rem;
  padding: 0.5rem 0.6rem;
  align-items: center;
  width: ${({ width }) => (width ? `${width}vw` : 'auto')};
  background: none;
  color: rgba(23, 42, 79, 0.69);
  font-weight: 500;
  align-self: baseline;
  width: ${({ $hasDropDown }) => ($hasDropDown ? 'auto' : '100%')};
  text-align: ${({ $hasDropDown }) => ($hasDropDown ? 'auto' : 'center')};

  .label {
    color: #172a4f;
  }

  .dropdown_wrap {
    display: flex;
    align-items: center;
    gap: 0.5vw;
  }

  @media only screen and (max-width: 600px) {
    flex-grow: 1;
    padding: 0.75vh 2vw;
  }

  @media only screen and (max-width: 600px) {
    justify-content: space-between;
  }
`;

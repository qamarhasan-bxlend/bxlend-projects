import styled from 'styled-components';

export const StyledBtnsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
`;

export const StyledTable = styled.div`
  width: -webkit-fill-available;
  min-height: 100vh;
  border-radius: 1.25rem;
`;

export const StyledOrdersWrap = styled.div`
  height: 100%;
  display: flex;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    padding-right: 0;

    & > aside {
      height: auto;
      width: calc(100% + 1.5rem);
    }

    & > aside > ul > li > a {
      display: flex;
      justify-content: center;
    }
  }
`;

export const StyledItem = styled.span`
  display: flex;
  align-items: center;
`;

export const StyledButtonsRow = styled.div`
  display: flex;
  gap: 0.62rem;
  padding-bottom: 2rem;
`;

export const StyledDateButton = styled.button`
  display: flex;
  align-items: center;
  align-self: baseline;
  gap: 1vw;
  border: 1px solid #cfcfcf;
  border-radius: 1rem;
  background: none;
  color: rgba(23, 42, 79, 0.69);
  font-weight: 500;
  padding: 0.75vh 1vw;

  @media only screen and (max-width: 600px) {
    width: -webkit-fill-available;
    justify-content: center;
  }

  & > svg {
    transform: rotate(270deg);
  }
`;

export const StyledWrap = styled.div<{ margin?: string }>`
  display: flex;
  flex-wrap: ${({ margin }) => (margin ? 'nowrap' : 'wrap')};
  gap: 2vw;
  margin: ${({ margin }) => margin || 0};
  align-items: self-end;

  @media only screen and (max-width: 600px) {
    margin-left: 0;
  }
`;

export const StyledRow = styled.div<{ $columns: string; $isHeader?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  background: ${({ $isHeader }) => ($isHeader ? '#F2F2F2' : 'none')};
  font-weight: ${({ $isHeader }) => ($isHeader ? '500' : '400')};
  padding: ${({ $isHeader }) => ($isHeader ? '.6vw 2vw' : '0')};
  border-radius: ${({ $isHeader }) => ($isHeader ? '1.25rem' : '0')};
`;

export const StyledButton = styled.button<{
  width?: number;
  gap?: number;
  $hasDropDown?: boolean;
  label: boolean;
}>`
  display: flex;
  align-items: center;
  gap: ${({ gap }) => `${gap || 2.5}vw`};
  border: 1px solid #cfcfcf;
  border-radius: 1rem;
  padding: 0.75vh 0.75vw;
  width: ${({ width }) => (width ? `${width}vw` : 'auto')};
  background: none;
  color: ${({ label }) => (label ? 'rgba(23, 42, 79, 0.69)' : '#001131')};
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

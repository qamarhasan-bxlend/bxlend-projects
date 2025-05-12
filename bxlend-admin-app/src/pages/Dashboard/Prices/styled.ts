import { css, styled } from 'styled-components';

export const StyledWrap = styled.div`
  width: 100%;
`;

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 2vw;
`;

export const StyledTable = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledTableWrap = styled.div`
  background: #fff;
  padding: 2vh 2vw;
  border-radius: 3.5rem;

  @media only screen and (max-width: 1024px) {
    padding: 1% 5%;

    & > ul > div {
      padding: 1% 0;
      border-top: 2px solid #e7efff;
    }
  }
`;

export const StyledTableRow = styled.div<{ isHeader?: boolean }>`
  display: grid;
  grid-template-columns: 2.5fr 1fr;

  & > span:nth-child(1) {
    display: flex;
    align-items: center;
  }

  .price_subname {
    color: #8c918c;
    font-size: 0.75rem;
    padding-left: 0.5vw;
  }

  ${(props) =>
    props.isHeader &&
    css`
      color: #8c918c;
    `}

  @media only screen and (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 60%;

    ${(props) =>
      props.isHeader &&
      css`
        padding-top: 3%;
      `}
  }
`;

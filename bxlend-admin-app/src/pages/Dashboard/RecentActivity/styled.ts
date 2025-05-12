import { styled, css } from 'styled-components';

export const StyledWrap = styled.div`
  width: 100%;
`;

export const StyledTable = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledHeader = styled(StyledTable)`
  padding: 0 2vw;
`;

export const StyledTableRow = styled.div<{ isHeader?: boolean }>`
  display: grid;
  grid-template-columns: 6fr 4fr 4fr 2fr;
  padding: 2vh 0.5vw;

  & > div {
    display: flex;
    flex-direction: column;
  }

  ${(props) =>
    props.isHeader &&
    css`
      color: #8c918c;
    `}

  .activity_id {
    font-weight: 600;
  }

  .activity_amount {
    font-family: Inter-Medium;
  }

  ${(props) =>
    !props.isHeader &&
    css`
      border-top: 1px solid #e7efff;
    `}
`;

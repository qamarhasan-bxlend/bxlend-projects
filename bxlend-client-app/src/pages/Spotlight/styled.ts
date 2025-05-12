import styled from 'styled-components';

export const StyledBonusWrap = styled.div`
  display: flex;

  @media only screen and (max-width: 1024px) {
    flex-direction: column;

    & > div {
      max-width: 100% !important;
    }

    & > div:nth-child(1) {
      height: 25rem;
    }
  }
`;

export const StyledDetailsWrap = styled.div`
  display: flex;

  @media only screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const StyledDatesWrap = styled.div`
  width: 50%;
  margin: 0 auto;

  @media only screen and (max-width: 1024px) {
    width: auto;
  }
`;

export const StyledText = styled.span`
  font-size: 0.5rem;
  background: #eee;
  min-width: 8rem;
  display: inline-block;
  padding: 0.6rem 0.5rem;
  font-weight: 600;
`;

export const StyledWrap = styled.div`
  padding: 0.25rem 1.6rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
`;

export const StyledListItem = styled.li<{ padding?: string }>`
  border: 1px solid gray;
  color: gray;
  font-weight: 600;
  padding: ${({ padding }) => padding ?? '1% 0'};
  flex-grow: 1;
  text-align: center;
  list-style: none;
  cursor: pointer;
`;

export const StyledPercentageItem = styled.li`
  border: 1px solid gray;
  list-style: none;
  flex-grow: 1;
  text-align: center;
  font-size: 0.87rem;
  cursor: pointer;
`;

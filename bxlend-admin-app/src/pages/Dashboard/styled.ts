import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  grid-gap: 1vw;

  @media only screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledWidgetHighlightedWrap = styled.div`
  display: flex;
  margin-bottom: 2vh;

  @media only screen and (max-width: 1024px) {
    display: block;

    & > div:nth-child(1) {
      width: calc(100% - 12%);
      padding: 4% 6%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    & > div:nth-child(2) {
      margin: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
`;

export const StyledWrap = styled.div`
  width: -webkit-fill-available;

  ul {
    padding-left: 0;
  }

  & > div:nth-child(1) {
    margin-bottom: 0.75rem;
  }
`;

export const StyledWidgetsWrap = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 4vh;

  @media only screen and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media only screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledSVGWrap = styled.div`
  flex-grow: 1;
  justify-content: center;
  display: flex;
`;

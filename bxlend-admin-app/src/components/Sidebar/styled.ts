import styled from 'styled-components';

export const StyledSidebar = styled.aside`
  display: flex;
  flex-direction: column;
  align-self: baseline;
  align-items: center;
  padding: 0 1rem;
  z-index: 100;
  box-shadow: -1px 3px 3px 0px rgba(0, 0, 0, 0.25);
  background: #fff;
  transition: all 0.5s ease-out;

  & > ul {
    margin: 0 0 4vh;
  }

  & > ul > li > a > button {
    color: #172a4f;
    gap: 1rem;
    cursor: pointer;
    width: -webkit-fill-available;
    /* background: #fafafa; */
  }

  & > ul > li > a > button > span:nth-child(2) {
    padding-right: 2rem;
  }

  & > ul > li {
    list-style: none;
    cursor: pointer;
    border-radius: 3.5rem;
  }

  & > ul > span {
    display: inline-block;
    margin-bottom: 2vh;
    color: #172a4f;
    font-weight: 500;
    font-size: 0.75rem;
  }

  .logo_image {
    height: 1.5rem;
  }

  .logo_text {
    font-size: 1.5rem;
  }

  .logo_wrap {
    padding-top: 1.25rem;
  }

  @media only screen and (max-width: 768px) {
    transition: translate var(--animation-timing);
    translate: -100%;
    position: fixed;
  }

  & > ul > span:nth-child(1) {
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }

  & > ul {
    @media only screen and (max-width: 768px) {
      border: none;
      margin: 6vh 0 0 0;
    }
  }
`;

export const StyledList = styled.ul`
  width: calc(100% + 1vw);
  padding: 3vh 0;
  display: flex;
  gap: 1vh;
  flex-direction: column;

  a {
    text-decoration: none;
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    border: none;
    margin: 6vh 0 0 0;
  }
`;

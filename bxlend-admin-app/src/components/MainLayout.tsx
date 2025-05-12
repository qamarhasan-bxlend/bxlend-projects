import React, { FC } from 'react';
import Header from './Header';

import Sidebar from './Sidebar';

import { StyledContainer, StyledWrap } from './styled';

const MainLayout: FC<{ Component?: FC }> = ({ Component }) => {
  return (
    <StyledContainer>
      <label id="burger-menu" className="hamburger-menu">
        <input id="input-burger" type="checkbox" />
      </label>
      <Sidebar />
      <StyledContainer isColumn>
        <Header />
        <StyledWrap>{Component && <Component />}</StyledWrap>
      </StyledContainer>
    </StyledContainer>
  );
};

export default MainLayout;

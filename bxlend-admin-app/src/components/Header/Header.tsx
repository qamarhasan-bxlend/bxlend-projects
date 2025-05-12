import React, { useState } from 'react';

import { RxAvatar } from 'react-icons/rx';

import { StyledHeader, StyledIconsWrap } from './styled';
// import Search from '../Search';
import OptionsModal from '../AuthedOptions';

const Header = () => {
  const [isModal, setIsModal] = useState(false);

  return (
    <StyledHeader>
      {/* NOTE: Temproraly commented Search input as it's useless at the moment. */}
      {/* <Search dropDownItems={['All']} /> */}
      <div></div>
      <StyledIconsWrap>
        <RxAvatar size={30} onClick={() => setIsModal((prevState) => !prevState)} style={{ cursor: 'pointer' }} />
        {isModal && <OptionsModal handleClose={() => setIsModal(false)} />}
      </StyledIconsWrap>
    </StyledHeader>
  );
};

export default Header;

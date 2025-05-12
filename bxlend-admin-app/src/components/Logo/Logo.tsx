import React from 'react';

import LogoImage from 'src/assets/images/Logo.svg';

import { StyledImage, StyledLogoText } from 'src/pages/LogIn/styled';
import { StyledLogoWrap } from '../styled';

const Logo = () => {
  return (
    <StyledLogoWrap className="logo_wrap">
      <StyledImage className="logo_image" src={LogoImage} />
      <StyledLogoText className="logo_text">BxLend</StyledLogoText>
    </StyledLogoWrap>
  );
};

export default Logo;
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import LoginBg from 'src/assets/images/LoginBg.png';
import Logo from 'src/components/Logo';

import { handleLogin } from './helpers';

import { StyledContainer, StyledLogInButton, StyledLogInWrap, StyledText, StyledImage } from './styled';

const LogIn = () => {
  const { state } = useLocation();
  const sign = handleLogin();

  useEffect(() => {
    state?.status === 401 && localStorage.removeItem('access');
  }, [state]);

  return (
    <StyledLogInWrap>
      <StyledContainer isBg>
        <StyledImage src={LoginBg} height="50vh" align="center" />
        <StyledText align="center">
          Instant, Easy and Secure way to Manage Wallets <br /> Using Your Preferred Currency And Payment method
        </StyledText>
      </StyledContainer>
      <StyledContainer>
        <Logo />
        <b>Sign-In</b>
        <StyledText>Access the BtcEx panel using your OpenID Connect Account.</StyledText>
        <StyledLogInButton>
          <a href={sign}>Login Using OpenID Connect</a>
        </StyledLogInButton>
        <StyledText>© 2023 BtcEx. All Rights Reserved.</StyledText>
      </StyledContainer>
    </StyledLogInWrap>
  );
};

export default LogIn;

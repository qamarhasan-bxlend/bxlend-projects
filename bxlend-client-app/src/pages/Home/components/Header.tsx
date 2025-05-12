import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Justify } from 'react-bootstrap-icons';

import { RootState } from 'src/store/store';
import { ROUTE_DASHBOARD } from 'src/routes';

import { ReactComponent as Logo } from 'src/assets/Logo.svg';

import { Button } from 'src/components/Button';
import LoggedNav from './LoggedNav';
import ThemeToggle from './ThemeToggle';
import AsideNavbar from './AsideNavbar';

import { getSign, MARKET_PRESALE_TRADE } from 'src/constants';

import { StyledContainer, StyledHeader, StyledLogoWrap, StyledWrap, UnLoggedNav } from './styled';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { isDark } = useSelector(({ isDark }) => isDark);
  const { user } = useSelector((state: RootState) => state.user);

  const { state, pathname } = useLocation();
  const token = localStorage?.getItem('access');
  const sign = getSign();

  useEffect(() => {
    state?.status === 401 && localStorage.removeItem('token');
  }, [state]);

  useEffect(() => {
    setIsLoggedIn(!!token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    window.addEventListener('storage', () => {
      setIsLoggedIn(!!token);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-sm header-back justify-content-between p-0">
        <StyledHeader $isDark={isDark}>
          <Link
            className="navbar-brand d-lg-flex d-none justify-content-left align-items-center pt-3 pb-3"
            to="/"
          >
            <Logo className="logo" />
          </Link>
          <button
            className="navbar-toggler d-flex d-lg-none"
            data-bs-toggle="modal"
            data-bs-target="#mobile-navbar"
          >
            <Justify width="2.5rem" height="2.5rem" color={isDark ? '#00feb9' : '#172a4f'} />
          </button>
          <StyledLogoWrap>
            <Link
              className="navbar-brand d-flex d-lg-none justify-content-left align-items-center ms-4 pt-3 pb-3"
              to="/"
            >
              <Logo className="logo" />
            </Link>
          </StyledLogoWrap>
          <StyledWrap>{isLoggedIn && <LoggedNav isDark={isDark} />}</StyledWrap>
          <div className="collapse navbar-collapse" id="main-navbar">
            <StyledContainer>
              {MARKET_PRESALE_TRADE.map(({ route, text }) => (
                <Link key={text} className="link" to={route}>
                  {text}
                </Link>
              ))}
              {isLoggedIn && (
                <Link className="link" to={ROUTE_DASHBOARD}>
                  Dashboard
                </Link>
              )}
            </StyledContainer>
            {isLoggedIn && <LoggedNav isDark={isDark} />}
          </div>
          {!isLoggedIn && (
            <UnLoggedNav>
              <ThemeToggle />
              <Link to={user.id ? '/market' : `${sign}&action=signup`}>
                <Button text="Log In" />
              </Link>
            </UnLoggedNav>
          )}
        </StyledHeader>
      </nav>
      <AsideNavbar isLoggedIn={isLoggedIn} />
    </>
  );
};

export default Header;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUserCheck } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';

import { Container } from 'src/components/Container';
import ThemeToggle from './ThemeToggle';
import OptionsModal from './OptionsModal';

import { ROUTE_NOTIFICATIONS, ROUTE_OPEN_ORDERS, ROUTE_ORDERS, ROUTE_WALLET } from 'src/routes';

import { StyledLoggedInIcons, StyledLoggedInLinks, StyledCount } from './styled';

const LoggedNav = ({ isDark }) => {
  const [isModal, setIsModal] = useState(false);

  const { notificationsCount } = useSelector(({ notificationsCount }) => notificationsCount);
  const iconColor = isDark ? '#fff' : '#172a4f';

  return (
    <>
      <StyledLoggedInLinks>
        <Link className="link" to={`${ROUTE_ORDERS}${ROUTE_OPEN_ORDERS}`}>
          Orders
        </Link>
        <Link className="link" to={ROUTE_WALLET}>
          Wallet
        </Link>
      </StyledLoggedInLinks>
      <StyledLoggedInIcons>
        <ThemeToggle />
        <Link to={ROUTE_NOTIFICATIONS} className="icon-link">
          <Container position="relative">
            {notificationsCount ? <StyledCount>{notificationsCount}</StyledCount> : null}
            <IoMdNotificationsOutline size="1.5rem" fill={iconColor} />
          </Container>
        </Link>
        <span className="avatar-wrapper">
          <FiUserCheck
            size="1.5rem"
            fill={iconColor}
            onClick={() => setIsModal((prevState) => !prevState)}
          />
          {isModal && <OptionsModal handleClose={() => setIsModal(false)} />}
        </span>
      </StyledLoggedInIcons>
    </>
  );
};

export default LoggedNav;

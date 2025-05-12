import React, { FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoSettingsOutline } from 'react-icons/io5';
// import { IoLanguageOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';
import { PiPasswordLight, PiPhoneCallLight } from 'react-icons/pi';

import { Container } from 'src/components/Container';

import { ROUTE_CHANGE_PW, ROUTE_DASHBOARD, ROUTE_UPDATE_PHONE } from 'src/routes';
import { StyledOptionsModal, StyledPasswordDropdown } from 'src/pages/Trade/components/Tabs/styled';

const OptionsModal: FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const { isDark } = useSelector(({ isDark }) => isDark);
  const iconColor = isDark ? '#fff' : '#333';

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
      handleClose();
    }
  };

  const handleToggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleLogOut = () => {
    localStorage.removeItem('access');
    navigate('/');
    navigate(0);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container position="fixed" top={0} left={0} zIndex={9999} width="100vw" height="100vh">
      <StyledOptionsModal ref={modalRef} $isDark={isDark}>
        <Container
          display="flex"
          gap="1.25rem"
          alignItems="center"
          padding="0 1rem"
          onClick={() => {
            navigate(ROUTE_DASHBOARD);
            handleClose();
          }}
        >
          <FiUser />
          <Container className="option">Dashboard</Container>
        </Container>

        {/* <Container display="flex" gap="1.25rem" alignItems="center" padding="0 1rem">
          <IoLanguageOutline fill={iconColor} />
          <Container className="option">Language and region</Container>
        </Container> */}

        <Container
          display="flex"
          gap="1.25rem"
          alignItems="center"
          padding="0 1rem"
          onMouseEnter={handleToggleDropdown}
          onMouseLeave={handleToggleDropdown}
          onClick={handleToggleDropdown}
        >
          <IoSettingsOutline fill={iconColor} />
          <Container className="option">Settings</Container>
          {showDropdown && (
            <StyledPasswordDropdown $isDark={isDark}>
              <ul>
                <li
                  onClick={() => {
                    navigate(ROUTE_CHANGE_PW);
                    handleClose();
                  }}
                >
                  <PiPasswordLight size="1rem" fill={iconColor} />
                  <Container className="option">Change password</Container>
                </li>
                <li
                  onClick={() => {
                    navigate(ROUTE_UPDATE_PHONE);
                    handleClose();
                  }}
                >
                  <PiPhoneCallLight size="1rem" fill={iconColor} />
                  <Container className="option">Update phone number</Container>
                </li>
              </ul>
            </StyledPasswordDropdown>
          )}
        </Container>

        <Container
          display="flex"
          gap="1.25rem"
          alignItems="center"
          cursor="pointer"
          padding="0 1rem"
        >
          <CiLogout fill={iconColor} />
          <Container className="option" onClick={handleLogOut}>
            Log out
          </Container>
        </Container>
      </StyledOptionsModal>
    </Container>
  );
};

export default OptionsModal;

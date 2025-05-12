import React, { FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa6';
import { IoSettingsOutline } from 'react-icons/io5';
import { HiOutlineLanguage } from 'react-icons/hi2';
import { CiLogout } from 'react-icons/ci';

import { ROUTE_LOGIN } from 'src/utils/routes';

import { StyledOption, StyledOptionsModal } from './styled';

const OptionsModal: FC<{ handleClose: () => void }> = ({ handleClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    const { target } = event;
    if (target instanceof Node && !modalRef.current?.contains(target)) {
      handleClose();
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('access');
    navigate(ROUTE_LOGIN);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <StyledOptionsModal ref={modalRef}>
      <StyledOption isAlign>
        <FaRegUser size={18} />
        <span>My Account</span>
      </StyledOption>
      <StyledOption isAlign>
        <HiOutlineLanguage size={18} />
        <span>Language and region</span>
      </StyledOption>
      <StyledOption isAlign>
        <IoSettingsOutline size={18} />
        <span>Settings</span>
      </StyledOption>
      <StyledOption isCursor isAlign>
        <CiLogout size={18} />
        <span onClick={handleLogOut}>Log out</span>
      </StyledOption>
    </StyledOptionsModal>
  );
};

export default OptionsModal;

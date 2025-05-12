import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';

import { StyledIcon, StyledSidebarButton } from './styled';

const SidebarButton: FC<{ text: string; url: string; src: IconType }> = ({ text, url, src: Icon }) => {
  const pathMatch = `/admin/${url}`;

  const isActive = window.location.href.indexOf(pathMatch) > -1;

  return (
    <Link to={pathMatch}>
      <StyledSidebarButton isActive={isActive}>
        <StyledIcon>
          <Icon size={30} />
        </StyledIcon>
        <span>{text}</span>
      </StyledSidebarButton>
    </Link>
  );
};

export default SidebarButton;

import React from 'react';

import Logo from '../Logo';
import SidebarButton from './SidebarButton';

import { SIDEBAR_BUTTONS } from '../../utils/constants';

import { StyledSidebar, StyledList } from './styled';

const Sidebar = () => {
  return (
    <StyledSidebar id="sidebar">
      <Logo />
      <StyledList>
        {SIDEBAR_BUTTONS.map(({ text, url, img }) => (
          // TODO: FIX ME LATER: USE PROPER KEY VALUE
          <li key={text}>
            <SidebarButton text={text} src={img} url={url} />
          </li>
        ))}
      </StyledList>
    </StyledSidebar>
  );
};

export default Sidebar;

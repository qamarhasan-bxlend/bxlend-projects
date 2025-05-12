import React, { FC, ReactElement } from 'react';

import { Button } from 'src/components/Button';
import { ITabProps } from './Tab/Tab';

import { StyledTabs, StyledTabsWrap } from './styled';

const Tabs: FC<{
  children: ReactElement<ITabProps>[];
  activeOrdersLength?: number;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
  isKycVerified: boolean;
}> = ({ children, isLoggedIn, isKycVerified, activeTab, setActiveTab }) => {
  return (
    <StyledTabsWrap className={!isLoggedIn || !isKycVerified ? 'blur-box' : ''}>
      <StyledTabs>
        {children.map(({ props: { label } }) => {
          const isActive = activeTab === label;
          return (
            <Button
              key={label}
              type={isActive ? 'default' : 'outlined'}
              text={label}
              onClick={() => setActiveTab(label)}
            />
          );
        })}
      </StyledTabs>
      <>{children.map(({ props: { label, children } }) => label === activeTab && children)}</>
    </StyledTabsWrap>
  );
};

export default Tabs;

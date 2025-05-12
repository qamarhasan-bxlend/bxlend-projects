import React, { FC, ReactNode } from 'react';

import { useSelector } from 'react-redux';

import './style.css';

const Dropdown: FC<{ classNames?: string; children: ReactNode }> = ({ classNames, children }) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return <ul className={`dropdown-menu ${classNames}${isDark ? ' isDark' : ''}`}>{children}</ul>;
};

export default Dropdown;

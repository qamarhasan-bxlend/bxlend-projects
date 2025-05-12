import React, { FC, ReactNode } from 'react';

export interface ITabProps {
  label: string;
  children: ReactNode;
}

const Tab: FC<ITabProps> = ({ children }) => <div>{children}</div>;

export default Tab;

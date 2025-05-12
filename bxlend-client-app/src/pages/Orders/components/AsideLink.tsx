import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from 'src/components/Button';

import { ROUTE_ORDERS } from 'src/routes';

interface IAsideLink {
  title: string;
  to: string;
}

const AsideLink: FC<IAsideLink> = ({ title, to }) => {
  const { pathname } = useLocation();
  const isActive = pathname === `${ROUTE_ORDERS}/${to}` ? 'active' : undefined;

  return (
    <li>
      <Link to={to} className={isActive}>
        <Button text={title} type={isActive ? 'default' : 'outlined'} />
      </Link>
    </li>
  );
};

export default AsideLink;

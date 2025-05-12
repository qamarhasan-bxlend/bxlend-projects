import React from 'react';

import { ASIDE_LINKS } from 'src/constants';

import AsideLink from './AsideLink';

import { StyledAside } from '../styled';

const Aside = () => {
  return (
    <StyledAside>
      <ul>
        {ASIDE_LINKS.map(({ to, title }) => (
          <AsideLink key={title} title={title} to={to} />
        ))}
      </ul>
    </StyledAside>
  );
};

export default Aside;

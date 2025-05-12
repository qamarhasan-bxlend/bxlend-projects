import React from 'react';

import { ReactComponent as SmallOval } from 'src/assets/SmallOval.svg';
import { ReactComponent as LargeOval } from 'src/assets/LargeOval.svg';

import { StyledBgWrap } from './styled';

const BgWrap = () => {
  return (
    <StyledBgWrap>
      <LargeOval style={{ height: '50vh' }} />
      <SmallOval style={{ position: 'absolute', left: '9vw', bottom: '142px', height: '40vh' }} />
    </StyledBgWrap>
  );
};

export default BgWrap;

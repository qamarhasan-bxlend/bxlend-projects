import React, { FC, ReactNode } from 'react';

import { StyledVerificationWrap } from './styled';

const VerificationWrap: FC<{ children: ReactNode }> = ({ children }) => {
  return <StyledVerificationWrap>{children}</StyledVerificationWrap>;
};

export default VerificationWrap;

import React from 'react';

import { StyledGradientedArea } from '../styled';

interface IGradientArea {
  children: React.ReactNode;
  margin?: string;
  padding?: string;
}

const GradientedArea: React.FC<IGradientArea> = ({ children, margin, padding }) => {
  return (
    <StyledGradientedArea $margin={margin} $padding={padding}>
      {children}
    </StyledGradientedArea>
  );
};

export default GradientedArea;

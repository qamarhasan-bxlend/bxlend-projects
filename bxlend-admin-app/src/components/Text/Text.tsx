import React, { FC } from 'react';
import { StyledText } from './styled';

const Text: FC<{
  size: number;
  color?: string;
  padding?: string;
  family?: string;
  marginLeft?: boolean;
  weight?: number;
  children: string;
}> = ({ size, color, padding, family, marginLeft, weight, children }) => {
  return (
    <StyledText size={size} color={color} padding={padding} family={family} marginLeft={marginLeft} weight={weight}>
      {children}
    </StyledText>
  );
};

export default Text;

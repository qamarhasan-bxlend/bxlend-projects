import React, { FC } from 'react';

import { useSelector } from 'react-redux';

import { ReactComponent as ArrowDown } from 'src/assets/ArrowDown.svg';

import { StyledButton } from '../styled';

const Button: FC<{ text: string; label?: string; hasDropDown?: boolean; gap?: number }> = ({
  text,
  gap,
  label = 'All',
  hasDropDown,
}) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <StyledButton className={isDark ? 'isDark' : ''} gap={gap} $hasDropDown={hasDropDown}>
      <span>{text}</span>
      {hasDropDown && (
        <div className="dropdown_wrap">
          <span className="label">{label}</span>
          <ArrowDown />
        </div>
      )}
    </StyledButton>
  );
};

export default Button;

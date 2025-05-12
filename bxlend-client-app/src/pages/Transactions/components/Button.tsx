import React, { FC } from 'react';

import { ReactComponent as ArrowDown } from 'src/assets/ArrowDown.svg';

import { Container } from 'src/components/Container';

import { StyledButton } from '../styled';

interface IButton {
  text: string;
  label?: string;
  hasDropDown?: boolean;
  gap?: number;
  caption?: string;
}

const Button: FC<IButton> = ({ text, gap, label, hasDropDown, caption }) => {
  return (
    <div>
      {caption && (
        <Container
          fontSize="0.75rem"
          color="rgba(23, 42, 79, 0.69)"
          fontWeight={500}
          padding="0 0 0.6vw"
        >
          {caption}
        </Container>
      )}
      <StyledButton gap={gap} $hasDropDown={hasDropDown} label={!!label}>
        <span>{text}</span>
        {hasDropDown && (
          <div className="dropdown_wrap">
            <span className="label">{label}</span>
            <ArrowDown />
          </div>
        )}
      </StyledButton>
    </div>
  );
};

export default Button;

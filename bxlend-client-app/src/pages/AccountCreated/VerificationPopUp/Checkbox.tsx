import React from 'react';

import { StyledCheckbox, StyledCheckboxContainer, StyledHiddenCheckbox } from './styled';
import { useSelector } from 'react-redux';

const Checkbox = ({ isChecked, setIsChecked, children }) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <StyledCheckboxContainer>
      <StyledHiddenCheckbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
      <StyledCheckbox checked={isChecked} $isDark={isDark}>
        {isChecked && <span>&#10003;</span>}
      </StyledCheckbox>
      {children}
    </StyledCheckboxContainer>
  );
};

export default Checkbox;

import React from 'react';
import { useSelector } from 'react-redux';
import { MoonFill } from 'react-bootstrap-icons';
import { MdSunny } from 'react-icons/md';

import { useDispatch } from 'src/store/useDispatch';
import { setTheme } from 'src/store/slice/theme';

import { StyledToggleCircle, StyledToggleSlider, StyledToggleWrapper } from './styled';

const ThemeToggle = () => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  const dispatch = useDispatch();

  return (
    <StyledToggleWrapper onClick={() => dispatch(setTheme())}>
      <StyledToggleSlider $isOn={isDark}>
        {isDark ? (
          <MdSunny
            width="0.75rem"
            height="0.75rem"
            style={{ position: 'absolute', top: '0.2rem', left: '0.2rem', zIndex: 10 }}
          />
        ) : null}
        <StyledToggleCircle $isOn={isDark} />
        {!isDark ? (
          <MoonFill
            width="0.75rem"
            height="0.75rem"
            style={{ position: 'absolute', top: '0.3rem', right: '0.2rem', zIndex: 10 }}
          />
        ) : null}
      </StyledToggleSlider>
    </StyledToggleWrapper>
  );
};

export default ThemeToggle;

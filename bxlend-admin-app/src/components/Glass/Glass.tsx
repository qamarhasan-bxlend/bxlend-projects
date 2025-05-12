import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';

interface IGlass {
  children: React.ReactNode;
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  className?: string;
}

const GlassContainer = styled.div<{
  $margin?: string;
  $padding?: string;
  $width?: string;
  $maxWidth?: string;
  $isDark: boolean;
}>`
  box-shadow: ${({ $isDark }) => `0 4px 20px rgba(0, 0, 0, ${$isDark ? '0.5' : '0.2'})`};
  border-radius: 0.5rem;
  width: ${({ $width }) => $width ?? 'calc(100% - 3rem)'};
  max-width: ${({ $maxWidth }) => $maxWidth ?? '100%'};
  padding: ${({ $padding }) => $padding ?? '1.5rem'};
  margin: ${({ $margin }) => $margin ?? '0'};
`;

export const Glass: React.FC<IGlass> = ({
  children,
  margin,
  padding,
  width,
  maxWidth,
  className,
}) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  return (
    <GlassContainer
      className={className}
      $padding={padding}
      $margin={margin}
      $width={width}
      $maxWidth={maxWidth}
      $isDark={isDark}
    >
      {children}
    </GlassContainer>
  );
};

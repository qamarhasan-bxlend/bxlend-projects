import React from 'react';
import styled from 'styled-components';

// export type ContainerProps = { children: React.ReactNode; onClick?: () => void } | Styles<object>;
export type ContainerProps = any;

const StyledContainer = styled.div<{ $styles: { key: string } }>`
  ${(props) => props.$styles}
`;

export const Container: React.FC<ContainerProps> = ({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  id,
  ...styles
}) => {
  return (
    <StyledContainer
      id={id}
      className={className}
      $styles={styles}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </StyledContainer>
  );
};

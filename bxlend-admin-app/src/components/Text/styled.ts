import { styled, css } from 'styled-components';

export const StyledText = styled.span<{
  size: number;
  color?: string;
  padding?: string;
  family?: string;
  weight?: number;
  marginLeft?: boolean;
}>`
  display: inline-block;
  font-size: ${({ size }) => `${size}px`};
  padding: ${({ padding }) => padding ?? 0};
  color: ${({ color }) => color ?? '#fff'};
  font-family: ${({ family }) => family ?? 'Inter'};
  font-weight: ${({ weight }) => weight ?? '400'};

  ${(props) =>
    props.marginLeft &&
    css`
      margin-left: auto;
    `}
`;

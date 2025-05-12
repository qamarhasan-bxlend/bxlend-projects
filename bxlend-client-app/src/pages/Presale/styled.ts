import { styled } from 'styled-components';

export const StyledRoundSection = styled.div`
  border-radius: 1.25rem;
  flex-grow: 1;
`;

export const StyledGradientedArea = styled.div<{ $padding?: string; $margin?: string }>`
  padding: ${({ $padding }) => $padding ?? '1rem'};
  border-radius: 1.25rem;
  margin: ${({ $margin }) => $margin ?? '0 0 1.25rem'};
`;

export const StyledProgressBarContainer = styled.div`
  display: flex;
`;

export const StyledPipe = styled.span<{ $filled: boolean }>`
  color: ${({ $filled }) => ($filled ? '#111' : '#ccc')} !important;
  font-size: 0.55rem;
`;

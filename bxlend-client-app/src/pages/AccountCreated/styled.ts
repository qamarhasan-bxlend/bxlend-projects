import styled from 'styled-components';

export const StyledContainer = styled.div<{ $isVerified?: boolean }>`
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1.25rem;
  background: #eee;
  border-radius: 0.5rem;
  align-items: center;
  cursor: ${({ $isVerified }) => ($isVerified ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ $isVerified }) => ($isVerified ? 'none' : 'auto')};
  min-width: 25rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: ${({ $isVerified }) => (!$isVerified ? 'scale(1.05)' : 'none')};
    box-shadow: ${({ $isVerified }) => (!$isVerified ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none')};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.08);
  }
`;

export const StyledOvalShape = styled.div<{ deg: string; color: string }>`
  width: 1.75rem;
  height: 2rem;
  transform: ${({ deg }) => `skewX(${deg}deg)`};
  background: ${({ color }) => color ?? '#828282'};
  border-radius: 50%;
`;

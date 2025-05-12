import styled from 'styled-components';

export const SliderContainer = styled.div<{ $translateX: number; $noTransition?: boolean }>`
  display: flex;
  transition: ${({ $noTransition }) => ($noTransition ? 'none' : 'transform 0.6s ease-in-out')};
  transform: translateX(${({ $translateX }) => $translateX}%);
`;

export const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3.75rem;
  height: 3.75rem;
  background: ${({ theme }) => theme.palette.teal};
  border: none;
  border-radius: 50%;
  color: #111 !important;
  cursor: pointer;
  font-size: 1.75rem;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

export const PrevButton = styled(NavigationButton)`
  left: 0;
`;

export const NextButton = styled(NavigationButton)`
  right: 0;
`;

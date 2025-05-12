/* eslint-disable indent */
import styled, { keyframes } from 'styled-components';

export const slideDown = keyframes`
  0% {
    transform: translateY(-50%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const StyledLoggedInLinks = styled.div`
  display: flex;
  align-items: center;

  .link {
    text-decoration: none;
    margin-left: 4vw;
    position: relative;
    transition: color 0.3s ease, transform 0.2s ease;

    &:hover {
      color: #fff;
      transform: scale(1.1);
    }

    &:active {
      color: #d18b00;
      transform: scale(0.95);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #00feb9;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media only screen and (max-width: 991px) {
    .link {
      display: none;
    }
  }
`;

export const StyledLoggedInIcons = styled.div`
  display: flex;
  gap: 1.75rem;
  align-items: center;
  margin-left: auto;

  .icon-link {
    position: relative;
    display: inline-block;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .avatar-wrapper {
    position: relative;
    display: inline-block;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    svg {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
`;

export const StyledLogoWrap = styled.span`
  @media only screen and (max-width: 576px) {
    display: none;
  }
`;

export const StyledCount = styled.span`
  display: inline-block;
  top: -8.5px;
  padding: 0px 5px;
  background: red;
  position: absolute;
  right: -0.75rem;
  border-radius: 35%;
  color: #fff;
  text-align: center;
  font-size: 0.75rem;
`;

export const StyledToggleWrapper = styled.div`
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const StyledToggleSlider = styled.div<{ $isOn: boolean }>`
  position: relative;
  width: 3.12rem;
  height: 1.4rem;
  border-radius: 1rem;
  background: ${({ $isOn, theme }) => ($isOn ? theme.palette.teal : '#ccc')};
  transition: background-color 0.4s, transform 0.2s ease-in-out;
`;

export const StyledToggleCircle = styled.div<{ $isOn: boolean }>`
  position: absolute;
  top: 0.2rem;
  left: ${({ $isOn }) => ($isOn ? 'calc(100% - 1.2rem)' : '0.2rem')};
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: left 0.4s, transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  z-index: 20;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const UnLoggedNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75rem;
  margin-left: auto;

  .link {
    text-decoration: none;
    color: #fff;
    margin-left: 4vw;
    position: relative;
    transition: color 0.3s ease, transform 0.2s ease;

    &:hover {
      color: #fff;
      transform: scale(1.1);
    }

    &:active {
      color: #d18b00;
      transform: scale(0.95);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #00feb9;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

export const StyledWrap = styled.div`
  display: flex;
  margin-right: 1rem;
  align-items: center;

  @media (min-width: 992px) {
    display: none;
  }
`;

export const StyledContainer = styled.div`
  display: none;

  .link {
    text-decoration: none;
    color: #fff;
    margin-left: 4vw;
    position: relative;
    transition: color 0.3s ease, transform 0.2s ease;

    &:hover {
      color: #fff;
      transform: scale(1.1);
    }

    &:active {
      color: #d18b00;
      transform: scale(0.95);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: #00feb9;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media (min-width: 768px) {
    flex: 0 0 auto;
    width: 50%;
  }

  @media (min-width: 992px) {
    display: flex;
    justify-content: flex-start !important;
    align-items: center;
  }
`;

export const StyledHeader = styled.header<{ $isDark: boolean }>`
  width: 98vw;
  padding: 0 1vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 2vh;
  left: 1vw;
  border-radius: 1rem;
  z-index: 1000;

  background: ${({ $isDark }) => ($isDark ? 'rgba(20, 20, 20, 0.4)' : 'rgba(255, 255, 255, 0.4)')};
  backdrop-filter: blur(1.25rem);

  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 8px 32px rgba(255, 255, 255, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.25)'};

  transition: transform 0.3s ease, background-color 0.4s ease, box-shadow 0.4s ease;
  animation: ${slideDown} 0.8s ease-out forwards;

  &:hover {
    transform: scale(1.02);
    box-shadow: ${({ $isDark }) =>
      $isDark ? '0 0.75rem 40px rgba(255, 255, 255, 0.25)' : '0 0.75rem 40px rgba(0, 0, 0, 0.3)'};
  }

  .link {
    color: ${({ theme, $isDark }) =>
      `${$isDark ? theme.palette.white : theme.palette.primary} !important`};
    text-decoration: none;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.palette.secondary};
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

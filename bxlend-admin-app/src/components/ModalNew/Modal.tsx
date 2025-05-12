/* eslint-disable indent */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-0.6rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div<{ $isDark?: boolean }>`
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  padding: 1.25rem;
  border-radius: 1rem;
  box-shadow: ${({ $isDark }) => ($isDark ? '0 8px 32px rgba(255, 255, 255, 0.15)' : '0 8px 32px rgba(0, 0, 0, 0.25)')};
  animation: ${fadeIn} 0.3s ease-out;
  max-width: 31.25rem;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  transition: transform 0.3s ease, background-color 0.4s ease, box-shadow 0.4s ease;
`;

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<IModal> = ({ isOpen, onClose, children }) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (event.target.id === 'modal-background') {
        onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <ModalBackground id="modal-background">
      <ModalContent $isDark={isDark}>{children}</ModalContent>
    </ModalBackground>
  );
};

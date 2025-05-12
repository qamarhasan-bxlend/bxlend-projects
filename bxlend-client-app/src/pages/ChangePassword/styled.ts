import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.25rem;

  svg {
    position: absolute;
    right: 1rem;
    top: 80%;
    transform: translateY(-80%);
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-76%) scale(1.1);
    }
  }
`;

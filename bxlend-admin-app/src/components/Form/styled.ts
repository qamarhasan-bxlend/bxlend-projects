import { styled } from 'styled-components';

export const StyledForm = styled.form<{ isFlex?: boolean }>`
  padding: 1rem 2rem;
  background: #fff;
  border-radius: 1rem;
  margin-top: 1rem;
  display: ${({ isFlex }) => isFlex ? 'flex' : 'block'};
`;

export const StyledWrap = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 7%;
  margin-bottom: 3vh;
  width: 60%;

  select,
  & > div {
    width: 100%;
  }
`;
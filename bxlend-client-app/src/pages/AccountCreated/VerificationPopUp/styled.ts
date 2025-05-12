import styled from 'styled-components';

export const StyledWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.palette.teal};
  padding: 0.62rem 1rem;
  border-radius: 1.25rem;
  background-color: #f9f9f9;
  gap: 0.5rem;
  font-size: 0.87rem;
  color: ${({ theme }) => theme.palette.primary};
`;

export const StyledInput = styled.input`
  display: none;
`;

export const StyledLabel = styled.label`
  padding: 0.31rem 1.25rem;
  background: #172a4f;
  color: #fff;
  border-radius: 0.31rem;
  cursor: pointer;
`;

export const StyledClosebtn = styled.span`
  font-size: 1.37rem;
  color: #ff4d4f !important;
  cursor: pointer;
  transform: rotate(45deg);
  transition: color 0.3s ease;

  &:hover {
    color: #ff2d2f;
  }
`;

export const StyledSquare = styled.div`
  width: 9.3rem;
  height: 9.3rem;
  margin: 0 auto;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
`;

export const StyledDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 10rem;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ccc;
`;

export const StyledOption = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  color: #111 !important;

  &:hover {
    background-color: #f2f2f2;
  }
`;

export const StyledUploadInput = styled.input`
  display: none;
`;

export const StyledUploadButton = styled.label<{ $isPlus: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #172a4f;
  color: #fff;
  padding: ${({ $isPlus }) => ($isPlus ? '0.6rem 1.25rem' : '0.75rem 1.5rem')};
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: ${({ $isPlus }) => ($isPlus ? '1.5rem' : '1rem')};
  border: 1px solid ${({ theme }) => theme.palette.teal};
  transition: all 0.3s ease;

  &:hover {
    background: #00feb9;
    box-shadow: 0px 6px 0.75px rgba(0, 0, 0, 0.1);
  }
`;

export const StyledButton = styled.button<{ $isOtp?: boolean }>`
  background: ${({ $isOtp }) => ($isOtp ? '#00FEB9' : '#ccc')};
  color: #fff;
  cursor: ${({ $isOtp }) => ($isOtp ? 'pointer' : 'auto')};
  border: none;
  padding: 0.37rem 1.12rem;
  border-radius: 2.5rem;
`;

export const StyledCheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

export const StyledHiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

export const StyledCheckbox = styled.span<{ checked?: boolean; $isDark: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #333;
  border: ${({ $isDark }) => `1px solid ${$isDark ? '#fff' : '#333'}`};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  font-size: 0.87rem;
  cursor: pointer;
`;

export const StyledCheckboxLabel = styled.span`
  user-select: none;
`;

export const StyledError = styled.span`
  font-size: 0.87rem;
  color: red !important;
`;

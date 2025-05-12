import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const StyledSelect = styled.select`
  width: 100%;
  height: 2.8rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 0 1rem;
  outline: none;
  color: #111;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.1);
  }

  &:disabled {
    border-color: #ddd;
    color: #999;
  }

  #option-tag {
    color: #111 !important;
  }
`;

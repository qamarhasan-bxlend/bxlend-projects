import React from 'react';
import styled from 'styled-components';

import { formatFieldString } from 'src/constants';

export const StyledBadge = styled.span<{ bg: string }>`
  display: flex;
  align-self: center;

  & > span {
    background: ${({ bg }) => bg};
    color: #fff;
    padding: 0.2rem 1.12rem;
    border-radius: 1rem;
    text-transform: lowercase;
  }

  & > span:first-letter {
    text-transform: capitalize;
  }
`;

const COLORS: { [key: string]: string } = {
  ACTIVE: '#198754',
  FULFILLED: '#198754',
  SUCCESS: '#198754',
  VERIFIED: '#198754',
  COMPLETED: '#198754',
  UNVERIFIED: '#DC3545',
  FAILED: '#DC3545',
  CANCELLED: '#DC3545',
  CANCELED: '#DC3545',
  REJECTED: '#DC3545',
  PENDING: '#FD7E14',
  UNDER_REVIEW: '#FD7E14',
  INPROGRESS: '#FD7E14',
  IN_PROGRESS: '#FD7E14',
  TRUE: '#198754',
  FALSE: '#DC3545',
  MINED: '#198754',
  BROADCASTED: '#FD7E14',
};

const Badge = ({ value }: { value: string }) => {
  return (
    <StyledBadge bg={COLORS[value.toString().toUpperCase()]}>
      <span>{formatFieldString(value)}</span>
    </StyledBadge>
  );
};

export default Badge;

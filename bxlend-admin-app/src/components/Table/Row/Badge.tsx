import React from 'react';

import Cropped from './Cropped';

import { StyledBadge } from '../styled';
import { formatFieldString } from '../helpers';

const STATUSES = [
  'ACTIVE',
  'SUCCESS',
  'FULFILLED',
  'FAILED',
  'FALSE',
  'TRUE',
  'CANCELLED',
  'CANCELED',
  'COMPLETED',
  'PENDING',
  'REJECTED',
  'VERIFIED',
  'UNVERIFIED',
  'UNDER_REVIEW',
  'IN_PROGRESS',
];
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
  IN_PROGRESS: '#FD7E14',
  TRUE: '#198754',
  FALSE: '#DC3545',
};

const Badge = ({ value }: { value: string | boolean }) => {
  const getText = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? 'VERIFIED' : 'UNVERIFIED';
    } else if (value === 'VERIFIED' || value === 'UNVERIFIED') {
      return value;
    }

    return formatFieldString(value);
  };

  return STATUSES.includes(value.toString().toUpperCase()) ? (
    <StyledBadge bg={COLORS[value.toString().toUpperCase()]}>
      <span>{getText(value)}</span>
    </StyledBadge>
  ) : (
    <Cropped value={value as string} />
  );
};

export default Badge;

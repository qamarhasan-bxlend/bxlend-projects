import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from 'src/components/Button';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const AnimatedButton = styled(Button)<{ index: number }>`
  animation: ${slideIn} 0.4s ease-out forwards;
  animation-delay: ${({ index }) => index * 0.1}s;
  opacity: 0;
`;

const FilterButtons = ({ filterButtons, filter, setFilter }) => (
  <div className="d-flex gap-3 market-filter-btn-group">
    {filterButtons.map((filterButton, index) => (
      <AnimatedButton
        key={index}
        index={index}
        type={filter === filterButton ? 'default' : 'outlined'}
        text={filterButton}
        onClick={() => setFilter(filterButton)}
      />
    ))}
  </div>
);

export default FilterButtons;

import React from 'react';

import { StyledPipe, StyledProgressBarContainer } from '../styled';

interface ProgressSectionProps {
  percentage: number;
  totalPipes?: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ percentage, totalPipes = 100 }) => {
  const filledPipes = Math.round((percentage / 100) * totalPipes);

  return (
    <StyledProgressBarContainer>
      {Array.from({ length: totalPipes }, (_, index) => (
        <StyledPipe key={index} $filled={index < filledPipes}>
          |
        </StyledPipe>
      ))}
    </StyledProgressBarContainer>
  );
};

export default ProgressSection;

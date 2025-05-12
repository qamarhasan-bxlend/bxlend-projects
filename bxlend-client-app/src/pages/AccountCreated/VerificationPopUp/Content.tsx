import React, { ReactNode, FC } from 'react';

import { Container } from 'src/components/Container';

import { Button } from 'src/components/Button';

interface IContent {
  title: string;
  subtitle?: string;
  buttonText: string;
  children: ReactNode;
  isNextActive?: boolean;
  submitLoading?: boolean;
  step?: number;
  handleNext: () => void;
}

const Content: FC<IContent> = ({
  title,
  subtitle,
  buttonText,
  isNextActive,
  submitLoading,
  children,
  handleNext,
}) => {
  return (
    <Container width="100%" padding="0 1.25rem">
      <Container fontSize="1.75rem">{title}</Container>
      {subtitle && <p>{subtitle}</p>}
      {children}
      <Container paddingTop="1.25rem">
        <Button
          text={buttonText}
          $fullWidth
          disabled={!isNextActive || submitLoading}
          isLoading={submitLoading}
          onClick={handleNext}
        />
      </Container>
    </Container>
  );
};

export default Content;

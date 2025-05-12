import React, { FC } from 'react';

import { Container } from 'src/components/Container';

const NoResult: FC = () => {
  return (
    <Container textAlign="center" padding="5rem 0">
      There is no result.
    </Container>
  );
};

export default NoResult;

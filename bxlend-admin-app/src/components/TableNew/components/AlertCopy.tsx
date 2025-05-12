import React from 'react';

import { Container } from 'src/components/Container';

export const AlertCopy = () => {
  return (
    <Container
      margin="2rem"
      backgroundColor="rgba(178, 251, 202, 0.9)"
      padding="1rem 2rem"
      borderRadius="0.25rem"
      position="absolute"
      top="0"
      right="0"
      display="none"
      id="copied-alert"
    >
      <Container fontSize="1rem">Copied</Container>
    </Container>
  );
};

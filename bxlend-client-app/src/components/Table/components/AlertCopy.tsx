import React from 'react';
import styled from 'styled-components';

import { Container } from 'src/components/Container';

const AlertCopyWrapper = styled.div`
  & > #copied-alert > div {
    color: #111;
  }
`;

export const AlertCopy = () => {
  return (
    <AlertCopyWrapper>
      <Container
        margin="2rem"
        className="alert alert-success position-absolute top-0 end-0"
        id="copied-alert"
      >
        <Container fontSize="1rem">Copied</Container>
      </Container>
    </AlertCopyWrapper>
  );
};

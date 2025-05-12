import React from 'react';

import { Container } from '../Container';

const RedAreaNote = ({ title }) => {
  return (
    <Container
      color="#fff"
      background="#f59f9f"
      textAlign="center"
      borderRadius={10}
      display="flex"
      alignItems="center"
    >
      <Container
        width="15%"
        padding="1rem 0"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container
          width="1.25rem"
          height="1.25rem"
          border="1px solid #fff"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="#fff"
        >
          !
        </Container>
      </Container>
      <Container textAlign="center" width="100%">
        {title}
      </Container>
    </Container>
  );
};

export default RedAreaNote;

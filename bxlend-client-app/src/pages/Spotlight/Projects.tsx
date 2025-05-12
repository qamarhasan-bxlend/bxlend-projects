import React from 'react';

import { Container } from 'src/components/Container';

const Projects = () => {
  return (
    <Container>
      <Container height={80} />
      <Container
        padding="1.5rem 0"
        textAlign="center"
        fontSize="1.4rem"
        fontWeight={800}
        background="#eee"
      >
        Upcoming project <br /> in the One Piece Fanclub ecosystem:
      </Container>
      <Container height="2.5rem" />
      <Container display="flex" justifyContent="space-around">
        <Container>
          <Container
            paddingBottom="0.6rem"
            fontWeight={600}
            fontSize="1.25rem"
            color="#111"
            textAlign="center"
          >
            Vegapunk
          </Container>
          <Container fontWeight={600} color="gray">
            Release in October 2023
          </Container>
        </Container>
        <Container>
          <Container
            paddingBottom="0.6rem"
            fontWeight={600}
            fontSize="1.25rem"
            color="#111"
            textAlign="center"
          >
            Smoker
          </Container>
          <Container fontWeight={600} color="gray">
            Release in November 2023
          </Container>
        </Container>
        <Container>
          <Container
            paddingBottom="0.6rem"
            fontWeight={600}
            fontSize="1.25rem"
            color="#111"
            textAlign="center"
          >
            Sabo
          </Container>
          <Container fontWeight={600} color="gray">
            Release in December 2023
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default Projects;

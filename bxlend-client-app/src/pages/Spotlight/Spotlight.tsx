import React from 'react';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import BonusSection from './BonusSection';
import GraphicsList from './GraphicsList';
import Projects from './Projects';
import Cautions from './Cautions';
import Footer from 'src/pages/Home/components/Footer';

import { SPOTLIGHT_IMAGES } from 'src/constants';

const Spotlight = () => {
  return (
    <>
      <Container>
        <Container marginBottom="1.25rem">
          <Button text="Return to list" />
        </Container>
        <BonusSection />
        <Container height={20} />
        <Button text="Log in to check ZRT amount" />
        <Container height={75} />
        <GraphicsList />
        <Projects />
        <Cautions />
        <Container
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="3rem"
          paddingTop="15rem"
        >
          {SPOTLIGHT_IMAGES.map((item) => (
            <img key={item} src={item} style={{ width: '60%' }} />
          ))}
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default Spotlight;

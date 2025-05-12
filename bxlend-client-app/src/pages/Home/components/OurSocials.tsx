import React from 'react';
import styled from 'styled-components';
import { Telegram, Discord } from 'react-bootstrap-icons';

import { ReactComponent as XLogo } from 'src/assets/XLogo.svg';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { FadeInSection } from 'src/components/FadeInSection';

const SocialContainer = styled(Container)`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const OurSocials = () => {
  return (
    <FadeInSection $offsetY={100}>
      <Container paddingTop="5rem" marginBottom="8rem">
        <Container fontSize="2.2rem" paddingBottom="3rem">
          Join The Community
        </Container>
        <Glass width="fit-content" margin="0 auto">
          <Container
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="2rem"
            flexWrap="wrap"
          >
            <a
              href="https://x.com/bxlend_"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <SocialContainer>
                <Container>Follow us on X</Container>
                <XLogo height="2rem" />
              </SocialContainer>
            </a>
            <a
              href="https://t.me/bxlend"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <SocialContainer>
                <Container>Join our Telegram</Container>
                <Telegram size="2rem" color="#0088CC" />
              </SocialContainer>
            </a>
            <a
              href="https://discord.gg/Kg8z3zNP"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <SocialContainer>
                <Container>Join our Discord</Container>
                <Discord size="2rem" color="#5865F2" />
              </SocialContainer>
            </a>
          </Container>
        </Glass>
      </Container>
    </FadeInSection>
  );
};

export default OurSocials;

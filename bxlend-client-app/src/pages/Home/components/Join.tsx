import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

import { Container } from 'src/components/Container';
import { FadeInSection } from 'src/components/FadeInSection';

const slideFade = keyframes`
  0% { opacity: 0; transform: translateX(100%); }
  15% { opacity: 1; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(0); }
  65% { opacity: 0; transform: translateX(-100%); }
  100% { opacity: 0; transform: translateX(-100%); }
`;

const AnimatedContainer = styled(Container)`
  position: absolute;
  width: 100%;
  text-align: center;
  opacity: 0;
  animation: ${slideFade} 6s ease-in-out;
`;

const Wrapper = styled.div`
  position: relative;
  width: 50%;
  height: 6rem;
  overflow: hidden;
  margin: 0 auto;
`;

const items = [
  { id: 1, value: '1M+', label: 'Verified users' },
  { id: 2, value: '99+', label: 'Countries supported' },
  { id: 3, value: '$99B+', label: 'Quarterly trading volume' },
];

const Join = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-5 pt-5">
      <FadeInSection>
        <Container fontSize="2.2rem" paddingBottom="2rem">
          BxLend is a crypto exchange for everyone
        </Container>
      </FadeInSection>
      <Wrapper>
        {items.map(
          (item, index) =>
            activeIndex === index && (
              <AnimatedContainer key={item.id}>
                <Container fontSize="2.75rem">{item.value}</Container>
                <Container fontSize="1.25rem">{item.label}</Container>
              </AnimatedContainer>
            ),
        )}
      </Wrapper>
    </div>
  );
};

export default Join;

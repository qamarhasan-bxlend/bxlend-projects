import React from 'react';
import { useSelector } from 'react-redux';

import { Container } from 'src/components/Container';
import { convertDate } from 'src/constants';

const TrxTimeline = ({ transaction }) => {
  const { isDark } = useSelector(({ isDark }) => isDark);

  const steps = [
    {
      title: 'Withdrawal order submitted',
      timestamp: transaction.created_at,
    },
    { title: 'System processing', timestamp: '2024-11-26 04:32' },
    { title: 'Completed', timestamp: transaction.updated_at },
  ];

  return (
    <Container display="flex" flexDirection="column" gap="1.5rem" padding="1rem">
      {steps.map((step, index) => (
        <Container key={index} position="relative">
          {index !== steps.length - 1 && (
            <Container
              position="absolute"
              left="1rem"
              top="2.5rem"
              width="1px"
              height="3rem"
              background={isDark ? '#fff' : '#333'}
            />
          )}
          <Container display="flex" gap="1rem" alignItems="center">
            <Container
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="2rem"
              height="2rem"
              fontSize="1rem"
              color="#172a4f !important"
              background="#00feb9"
              borderRadius="50%"
            >
              ✔
            </Container>
            <Container display="flex" flexDirection="column" gap="0.25rem">
              <Container fontSize="1rem" fontWeight="bold">
                {step.title}
              </Container>
              <Container fontSize="0.85rem">
                {convertDate(step.timestamp).date} {convertDate(step.timestamp).time}
              </Container>
            </Container>
          </Container>
        </Container>
      ))}
    </Container>
  );
};

export default TrxTimeline;

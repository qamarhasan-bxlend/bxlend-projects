import React, { useState } from 'react';
import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { FAQ_DATA } from 'src/constants';

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <Container height="100%" display="flex" alignItems="center" justifyContent="center">
      <Glass>
        <Container fontSize="1.75rem" textAlign="center" paddingBottom="1.25rem">
          Frequently Asked Questions
        </Container>
        {FAQ_DATA.map(({ question, answer }, index) => (
          <Container
            key={index}
            marginBottom="1rem"
            padding="1rem"
            borderRadius="10px"
            boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
          >
            <Container
              fontSize="1.25rem"
              fontWeight={600}
              cursor="pointer"
              onClick={() => toggleAccordion(index)}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {question}
              <span>{openIndex === index ? '-' : '+'}</span>
            </Container>
            {openIndex === index && (
              <Container fontSize="1rem" paddingTop="0.5rem">
                {answer}
              </Container>
            )}
          </Container>
        ))}
      </Glass>
    </Container>
  );
};

export default FAQAccordion;

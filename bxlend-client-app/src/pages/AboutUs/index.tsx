import React from 'react';

import FinancialCrime from 'src/assets/FinancialCrime.jpeg';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';

const AboutUs = () => {
  return (
    <Container textAlign="center">
      <Glass maxWidth="80vw" margin="0 auto">
        <Container fontSize="1.75rem" paddingBottom="1.25rem">
          About Us
        </Container>
        <Container>
          <Container textAlign="left">
            <p>
              Bxlend is a leading financial technology company operating in the heart of Europe -
              the Czech Republic. Established in 2020. In 2025 ZenithChain s.r.o. Registration No.
              224 04 031 obtain CASP (Crypto Asset Service Provider) license.
            </p>
            <p>
              Headquartered in Prague, the vibrant capital of the Czech Republic, Bxlend is at the
              forefront of the country&apos;s thriving fintech ecosystem. Our company has obtained
              the highly sought-after CASP (Crypto Asset Service Provider) license from the Czech
              National Bank, ensuring that we adhere to the most rigorous AML (Anti-Money
              Laundering) and KYC (Know Your Customer) standards.
            </p>
            <p>
              At Bxlend, we are committed to fostering the responsible adoption of cryptocurrencies
              and blockchain technology. By leveraging our CASP license and operating within the
              Czech Republic&apos;s robust regulatory landscape, we aim to set new standards for
              transparency, security, and customer protection in the crypto-asset industry.
            </p>{' '}
            <p>
              Join us on our mission to revolutionize the world of digital finance. Discover the
              advantages of trading and investing with Bxlend, the trusted crypto partner in the
              heart of Europe.
            </p>
          </Container>
          <Container padding="3rem 0">
            <Container fontWeight={600} fontSize="1.5rem">
              <span>Licenses</span> & Registrations
            </Container>
          </Container>
        </Container>
        <Container>
          <Container margin="0 auto" border="1px solid #ccc" padding="1.25rem" width="fit-content">
            <Container marginBottom="1.25rem">
              <img src={FinancialCrime} width="5rem" />
            </Container>
            <Container letterSpacing="0.2rem">LITHUANIA</Container>
            <Container fontWeight={600} fontSize="1.5rem">
              Financial Crime <br /> Investigation Service
            </Container>
            <Container paddingBottom="2rem" color="gray">
              Execution of Virtual Currency Exchange <br /> Operator and Deposit of Virtual Currency{' '}
              <br /> Wallets Operator
            </Container>
            <Container paddingBottom="1.25rem" color="gray">
              Reference NO. <br /> 306723160
            </Container>
            <Container paddingBottom="1.25rem" color="gray">
              COMPANY <br /> BxLend UAB
            </Container>
            <Container paddingBottom="2rem" color="gray">
              <a
                href="https://www.registrucentras.lt/jar/sarasai/vvko.php"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  marginBottom: '1.25rem',
                }}
              >
                https://www.registrucentras.lt/jar/sarasai/vvko.php
              </a>
              <a
                href="https://www.registrucentras.lt/jar/sarasai/dvvpo."
                style={{ display: 'block', maxWidth: '100%', wordBreak: 'break-word' }}
              >
                https://www.registrucentras.lt/jar/sarasai/dvvpo.
              </a>
            </Container>
          </Container>
          <Container
            margin="0 auto"
            border="1px solid #ccc"
            borderTop="none"
            padding="1.25rem"
            width="fit-content"
          >
            <Container marginBottom="1.25rem">
              <img src={FinancialCrime} width="5rem" />
            </Container>
            <Container letterSpacing="0.2rem">CZECH REPUBLIC</Container>
            <Container fontWeight={600} fontSize="1.5rem">
              Financial Crime <br /> Investigation Service
            </Container>
            <Container paddingBottom="2rem" color="gray">
              Execution of Virtual Currency Exchange <br /> Operator and Deposit of Virtual Currency{' '}
              <br /> Wallets Operator
            </Container>
            <Container paddingBottom="1.25rem" color="gray">
              Reference NO. <br /> 224 04 031
            </Container>
            <Container paddingBottom="1.25rem" color="gray">
              COMPANY <br /> ZenithChain s.r.o
            </Container>
            <Container paddingBottom="2rem" color="gray">
              <a
                href="https://www.registrucentras.lt/jar/sarasai/vvko.php"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  marginBottom: '1.25rem',
                }}
              >
                https://www.registrucentras.lt/jar/sarasai/vvko.php
              </a>
              <a
                href="https://www.registrucentras.lt/jar/sarasai/dvvpo."
                style={{ display: 'block', maxWidth: '100%', wordBreak: 'break-word' }}
              >
                https://www.registrucentras.lt/jar/sarasai/dvvpo.
              </a>
            </Container>
          </Container>
        </Container>
      </Glass>
    </Container>
  );
};

export default AboutUs;

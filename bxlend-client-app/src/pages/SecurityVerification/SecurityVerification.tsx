import React from 'react';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Glass } from 'src/components/Glass';
import VerificationWrap from 'src/components/VerificationWrap/VerificationWrap';

import { Input } from 'src/components/Input';

const SecurityVerification = () => {
  return (
    <Container height="100%" display="flex" justifyContent="space-around" alignIems="center">
      <Glass maxWidth="25rem">
        <VerificationWrap>
          <Container>
            <Container fontSize="1.75rem" paddingBottom="1.25rem">
              Security verification
            </Container>
            <Container>
              <Container paddingBottom="1.25rem">
                Enter the 6-digit code sent to 88****8912773
              </Container>
              <Input label="Phone number verification code" value="" onChange={() => null} />
              <Container cursor="pointer" padding="5px 0">
                Resend code
              </Container>
              <br />
              <Button text="Submit" $fullWidth />
            </Container>
          </Container>
        </VerificationWrap>
      </Glass>
    </Container>
  );
};

export default SecurityVerification;

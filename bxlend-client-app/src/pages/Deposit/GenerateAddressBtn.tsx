import React from 'react';

import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';

import RedAreaNote from 'src/components/RedAreaNote';

const GenerateAddressBtn = ({ onClick, blockchain, isReadyForAddress, children }) => {
  return (
    <Container>
      <Container>
        <Container borderLeft="2px solid rgb(0, 254, 185)" paddingLeft={6} marginBottom="0.6rem">
          <Container>Tips</Container>
        </Container>
        <Container fontSize="0.8rem" color="gray" paddingBottom="1.25rem">
          This address only supports deposits of {blockchain?.blockchain?.symbol ?? 'selected'}{' '}
          assets. Do not deposit other assets to this address as the assets will not be credited or
          recoverable.
        </Container>
        <Container fontSize="0.8rem" color="gray" paddingBottom="1.25rem">
          Please note: if the single deposit amount is less than the minimum deposit amount, it will
          not be credited. The platform will not be liable for any loss of assets resulting from
          this. Thank you for your understanding and support.
        </Container>
      </Container>
      <Container border="1px solid #ccc" borderRadius={10}>
        <Container padding="1.75rem" borderBottom="1px solid #ccc" textAlign="center">
          {isReadyForAddress && children}
          {!isReadyForAddress && !blockchain?.deposit_options?.is_suspended && (
            <Button $fullWidth text="Generate Address" disabled={!blockchain} onClick={onClick} />
          )}
          {!isReadyForAddress && blockchain?.deposit_options?.is_suspended && (
            <RedAreaNote
              title={`Deposit is currently suspended for ${blockchain?.blockchain?.symbol}`}
            />
          )}
        </Container>
        <Container display="flex" flexDirection="column" gap="0.6rem" padding="0.75rem">
          <Container display="flex" justifyContent="space-between">
            <Container fontSize="0.8rem" color="grey">
              Minimum deposit amount
            </Container>
            <Container>0 {blockchain?.blockchain?.symbol ?? ''}</Container>
          </Container>
          <Container display="flex" justifyContent="space-between">
            <Container fontSize="0.8rem" color="grey">
              Pre-crediting
            </Container>
            <Container fontSize="1rem">12 network confirmations</Container>
          </Container>
          <Container display="flex" justifyContent="space-between">
            <Container fontSize="0.8rem" color="grey">
              Credited successfully
            </Container>
            <Container fontSize="1rem">12 network confirmations</Container>
          </Container>
          {blockchain && blockchain.contract_address && (
            <Container display="flex" justifyContent="space-between">
              <Container fontSize="0.8rem" color="grey">
                Contract address
              </Container>
              <Container>
                Ending with{' '}
                <span style={{ fontWeight: 600 }}>
                  {blockchain.contract_address.substring(blockchain.contract_address.length - 5)}
                </span>
              </Container>
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
};

export default GenerateAddressBtn;

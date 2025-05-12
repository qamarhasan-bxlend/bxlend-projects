import React from 'react';

import { Container } from 'src/components/Container';

import './index.css';

const CopyAlert = ({ address }) => {
  return (
    <Container
      color="#111 !important"
      className="alert alert-success position-fixed top-0 end-0"
      id="copied-alert"
      zIndex="9999"
      margin="2rem"
    >
      {address && <strong style={{ color: '#111' }}>Copied: </strong>} {address || ''}
    </Container>
  );
};

export default CopyAlert;

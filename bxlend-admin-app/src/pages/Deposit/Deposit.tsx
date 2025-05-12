import React from 'react';

import Form from 'src/components/Form';
import PageHeader from 'src/components/PageHeader';

const Deposit = () => {
  return (
    <>
      <PageHeader title="Manual Deposit" hideSearch />
      <Form type="deposit" />
    </>
  );
};

export default Deposit;

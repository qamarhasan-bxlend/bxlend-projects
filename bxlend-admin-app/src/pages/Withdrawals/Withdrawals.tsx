import React, { useState } from 'react';

import Form from 'src/components/Form';
import PageHeader from 'src/components/PageHeader';
import Table from 'src/components/Table';

import { WITHDRAWALS_DATA, WITHDRAWALS_HEADERS } from 'src/utils/constants';

const Withdrawals = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <>
      <PageHeader
        title={isFormVisible ? 'Manual Withdraw' : 'Withdrawals'}
        subtitle={isFormVisible ? '' : 'You have a total of 99 withdrawal requests'}
        dropdownTitle={isFormVisible ? '' : WITHDRAWALS_HEADERS[0]}
        dropDownItems={isFormVisible ? [] : WITHDRAWALS_HEADERS}
        hideSearch={isFormVisible}
      />
      {isFormVisible ? (
        <Form type="manual" />
      ) : (
        <Table
          headers={WITHDRAWALS_HEADERS}
          data={WITHDRAWALS_DATA}
          hasAction
          columns="1fr .5fr .5fr .5fr .4fr"
          showForm={() => setIsFormVisible(true)}
        />
      )}
    </>
  );
};

export default Withdrawals;

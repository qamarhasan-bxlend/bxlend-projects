import React, { useState } from 'react';

import { Table } from 'src/components/TableNew';
import { Button } from 'src/components/Button';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { fetchPresaleUsers, updateField, updateSearch } from 'src/store/slice/presaleUsers';

import { CRON_JOBS_HEADERS } from 'src/utils/constants';

const PresaleUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const cronJobs: any[] = [];

  return (
    <>
      <PageHeader
        title="Cron Jobs"
        subtitle={`You have a total of ${0} cron jobs`}
        dropdownTitle={CRON_JOBS_HEADERS[0]}
        dropDownItems={['Name', 'Description']}
        entity="presaleUsers"
        fetchEntity={fetchPresaleUsers}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {!cronJobs?.length ? (
        <Table
          headers={CRON_JOBS_HEADERS}
          items={cronJobs}
          columns="1fr 1fr 1fr"
          detailsModalTitle="User"
          fieldsToShow={['name', 'description']}
          // FIX ME LATER
          totalPages={5}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          actions={() => {
            return (
              <Button
                text="Confirm"
                $fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            );
          }}
        />
      ) : (
        <NoResult />
      )}
    </>
  );
};

export default PresaleUsers;

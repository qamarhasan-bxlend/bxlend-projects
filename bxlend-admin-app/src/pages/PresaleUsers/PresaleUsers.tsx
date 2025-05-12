import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { fetchPresaleUsers, updateField, updateSearch } from 'src/store/slice/presaleUsers';

import { PRESALE_USERS_HEADERS } from 'src/utils/constants';

const PresaleUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const {
    data: { presaleUsers, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ presaleUsers }) => presaleUsers);

  useEffect(() => {
    dispatch(fetchPresaleUsers({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Presale Users"
        subtitle={`You have a total of ${totalCount} presale users`}
        dropdownTitle={PRESALE_USERS_HEADERS[0]}
        dropDownItems={[
          'id',
          'Order NO',
          'Status',
          'Blockchain',
          'BXT Base Price',
          'Payment Coin',
          'Stage',
          'Tokens',
          'Amount USD',
        ]}
        entity="presaleUsers"
        fetchEntity={fetchPresaleUsers}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {presaleUsers?.length ? (
        <Table
          headers={PRESALE_USERS_HEADERS}
          items={presaleUsers.map(({ user_id: { ...userRest }, ...rest }) => {
            return {
              ...rest,
              ...userRest,
              name: userRest?.name?.first ? `${userRest.name.first} ${userRest.name.last}` : null,
              user_id: userRest.id,
              referral_reward: rest.referral_reward.token_allocation,
            };
          })}
          columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr"
          detailsModalTitle="User"
          fieldsToShow={[
            'user_id',
            'referral_reward',
            'total_allocation',
            'pending_allocation',
            'email',
            'kyc_status',
            'name',
            'created_at',
          ]}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <NoResult />
      )}
    </>
  );
};

export default PresaleUsers;

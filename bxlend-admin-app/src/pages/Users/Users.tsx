import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';

import { USERS_HEADERS } from 'src/utils/constants';
import { fetchUsers, updateField, updateSearch } from 'src/store/slice/users';
import NoResult from 'src/components/NoResult/NoResult';

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const {
    data: { users, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ users }) => users);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={`You have a total of ${totalCount} users`}
        dropdownTitle={USERS_HEADERS[0]}
        dropDownItems={['Name', 'Status', 'KYC Status', 'Email']}
        entity="users"
        fetchEntity={fetchUsers}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {users?.length ? (
        <Table
          headers={USERS_HEADERS}
          items={users.map(({ name: { ...userRest }, ...rest }) => {
            return {
              ...rest,
              name: userRest?.first ? `${userRest?.first} ${userRest?.last}` : null,
            };
          })}
          columns="1fr 1fr 1fr 1fr 1fr 1fr "
          fieldsToShow={['name', 'email', 'status', 'id', 'kyc_status', 'created_at']}
          detailsModalTitle="User"
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

export default Users;

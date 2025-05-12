import React, { useEffect, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';

import { Loader } from 'src/components/Loader';
import { Table } from 'src/components/TableNew';
import PageHeader from 'src/components/PageHeader';
import NoResult from 'src/components/NoResult/NoResult';

import { KYC_HEADERS } from 'src/utils/constants';
import { fetchKyc, updateField, updateSearch } from 'src/store/slice/kyc';

const Kyc = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const {
    data: { kyc, totalCount, totalPages, field, search },
    loading,
  } = useSelector(({ kyc }) => kyc);

  useEffect(() => {
    dispatch(fetchKyc({ page: currentPage, field, search }));
  }, [currentPage]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader
        title="Kyc"
        subtitle={`You have a total of ${totalCount} kyc`}
        dropdownTitle={KYC_HEADERS[0]}
        dropDownItems={['Name', 'ID', 'Status', 'Country Code', 'Address']}
        entity="kyc"
        fetchEntity={fetchKyc}
        updateEntityField={updateField}
        updateEntitySearch={updateSearch}
      />
      {kyc?.length ? (
        <Table
          isKyc
          headers={KYC_HEADERS}
          items={kyc.map(
            ({
              name: { ...nameRest },
              user: { ...userRest },
              identification_url: { ...identificationUrlRest },
              address,
              ...rest
            }: any) => {
              delete rest.__v;

              return {
                ...rest,
                name: nameRest?.first ? `${nameRest.first} ${nameRest.last}` : null,
                user_id: userRest.id,
                kyc_id: rest._id,
                address: address ? `${address.city} ${address.pin_code} ${address.full_address}` : null,
                ...identificationUrlRest,
              };
            }
          )}
          detailsModalTitle="User"
          columns="1fr 1fr 1fr 1fr 1fr"
          fieldsToShow={['name', 'kyc_id', 'status', 'country_code', 'address']}
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

export default Kyc;

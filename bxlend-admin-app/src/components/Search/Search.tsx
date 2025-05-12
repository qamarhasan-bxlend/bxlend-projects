import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Container } from 'src/components/Container';
import { Select } from 'src/components/Select';
import { Input } from 'src/components/Input';

import { useDispatch } from 'src/store/useDispatch';
import { hasOnlySpaces } from '../Table/helpers';

interface ISearch {
  title?: string;
  dropDownItems?: string[];
  entity: string;
  fetchEntity: any;
  updateEntityField: any;
  updateEntitySearch: any;
}

const Search: FC<ISearch> = ({ dropDownItems, entity, fetchEntity, updateEntityField, updateEntitySearch }) => {
  const [isSearchStarted, setIsSearchStarted] = useState(false);

  const ENTITY_TYPES = [
    'waitingListUsers',
    'orders',
    'transactions',
    'users',
    'kyc',
    'wallets',
    'presaleOrders',
    'presaleUsers',
  ];

  const data: any = useSelector((data) => data);

  const dispatch = useDispatch();

  const search = data[entity]?.data?.search || '';
  const field = data[entity]?.data?.field || '';
  const isValidSearch = !hasOnlySpaces(search);

  useEffect(() => {
    if (ENTITY_TYPES.includes(entity) && isSearchStarted && isValidSearch) {
      const timeoutId = setTimeout(() => {
        dispatch(
          fetchEntity({
            page: 1,
            field,
            search,
          })
        );
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [search]);

  return (
    <Container display="flex" gap="1rem">
      <Input
        label={`Search by ${field}`}
        value={search}
        onChange={(e) => {
          setIsSearchStarted(true);
          dispatch(
            updateEntitySearch({
              search: e.currentTarget.value,
            })
          );
        }}
      />
      <Select
        label="Select Field"
        options={dropDownItems ? dropDownItems.map((i) => ({ value: i, label: i })) : []}
        value={field}
        onChange={(e) => {
          dispatch(
            updateEntityField({
              field: e.currentTarget.value,
            })
          );
        }}
      />
    </Container>
  );
};

export default Search;

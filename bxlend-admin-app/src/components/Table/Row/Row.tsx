import React, { FC, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ReactComponent as Eye } from 'src/assets/images/Eye.svg';
import { ReactComponent as Trash } from 'src/assets/images/Trash.svg';

import Badge from './Badge';
import Modal from 'src/components/Modal';
import Notification from 'src/components/Notification';

import request from 'src/request';
import { AUTH_URL } from 'src/configs';

import { StyledRow, StyledActions } from '../styled';

interface IRow {
  item: object;
  isHeader?: boolean;
  hasAction?: boolean;
  hasActions?: boolean;
  columns: string;
  showForm?: () => void;
}

const Row: FC<IRow> = ({ item, isHeader, hasAction, hasActions, columns }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', isError: false });

  const { pathname } = useLocation();

  const isKyc = pathname === '/admin/kyc';
  const isBankAccount = pathname === '/admin/bank-account';
  const isUsers = pathname === '/admin/users';
  const isWaitingUsersList = pathname === '/admin/waiting-list-users';

  const values = Object.values(item);
  const isAnyAction = hasAction || hasActions;

  const kycUserId = isKyc && values[2] ? values[2] : null;
  const bankAccountId = isBankAccount && values[1] ? values[1] : null;
  const userId = isUsers && values[2] ? values[2] : null;
  const waitingUserId = isWaitingUsersList && values[2] ? values[2] : null;

  const getPath = () => {
    if (isKyc) return 'kyc';
    if (isBankAccount) return 'bank-accounts';
    if (isWaitingUsersList) return 'waiting-list-users';

    return 'users';
  };

  const getId = () => {
    if (isKyc) return kycUserId;
    if (isBankAccount) return bankAccountId;
    if (isWaitingUsersList) return waitingUserId;

    return userId;
  };

  const fetchModalData = () => {
    setLoading(true);
    setIsModalOpen(true);
    request
      .get(`${AUTH_URL}/v1/admin/${getPath()}/${getId()}`)
      .then(({ data }) => setData(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <StyledRow columns={columns} isHeader={isHeader}>
        {values.map((value) => {
          // TODO: FIX ME LATER: USE PROPER KEY VALUE
          return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? (
            // @ts-expect-error TODO: FIX ME LATER
            <Badge value={value} />
          ) : (
            <span className="nested_cell">
              {Object.values(value).map(
                (val) =>
                  typeof val === 'string' && (
                    <>
                      <span key={val}>{val}</span>
                      {isWaitingUsersList || isUsers ? ' ' : <br />}
                    </>
                  )
              )}
            </span>
          );
        })}
        {isAnyAction && (
          <span>
            {hasAction && (
              <Eye
                onClick={() =>
                  isKyc || isBankAccount || isUsers || isWaitingUsersList ? fetchModalData() : setIsModalOpen(true)
                }
              />
            )}
            {hasActions && (
              <StyledActions>
                <Eye />
                <Trash />
              </StyledActions>
            )}
          </span>
        )}
      </StyledRow>
      <Modal
        setNotification={setNotification}
        loading={loading}
        data={data ?? item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {notification.message && <Notification message={notification.message} isSuccess={!notification.isError} />}
    </>
  );
};

export default Row;

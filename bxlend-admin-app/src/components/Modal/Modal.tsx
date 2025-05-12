import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from 'src/store/useDispatch';

import { Loader } from '../Loader';
import KycContent from './KycContent';
import UserContent from './UserContent';
import BankAccountContent from './BankAccount';
import WaitingUserContent from './WaitingUser';
import PresaleTransaction from './PresaleTransaction';

import {
  StyledButtonCancel,
  StyledButtonOk,
  StyledButtonsWrap,
  StyledModalContainer,
  StyledModalOverlay,
} from './styled';
import request from 'src/request';
import { AUTH_URL } from 'src/configs';
import { fetchEntities } from 'src/store/slice/entities';

interface IModal {
  data: any;
  isOpen: boolean;
  loading?: boolean;
  setNotification: Dispatch<SetStateAction<{ message: string; isError: boolean }>>;
  onClose: () => void;
}

const Modal: FC<IModal> = ({ setNotification, data, isOpen, loading, onClose }) => {
  const [kycStatus, setKycStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const dispatch = useDispatch();

  const handleOverlayClick = (event: any) => event.target === event.currentTarget && onClose();

  const { pathname } = useLocation();
  const isKyc = pathname === '/admin/kyc';
  const isUsers = pathname === '/admin/users';
  const isBankAccount = pathname === '/admin/bank-account';
  const isWaitingUsersList = pathname === '/admin/waiting-list-users';
  const isPresaleTrx = pathname === '/admin/presale-transactions';

  const sendKyc = () => {
    setSubmitLoading(true);
    request
      .patch(`${AUTH_URL}/v1/admin/kyc/${data.kyc._id}`, {
        status: kycStatus,
        response_message: feedback,
      })
      .then(() => {
        setNotification({ message: 'Status has been updated successfully.', isError: false });
        onClose();
        dispatch(
          fetchEntities({
            type: 'kyc',
            page: 1,
            fields: ['name', 'user_id', '_id', 'status', 'country_code', 'address'],
          })
        );
      })
      .catch((e) =>
        setNotification({ message: e.response.data.error ?? 'Unprocessible entity. Try again.', isError: true })
      )
      .finally(() => setSubmitLoading(false));
  };

  return (
    <>
      <StyledModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
        <StyledModalContainer isOpen={isOpen} loading={loading}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {isKyc && <KycContent data={data} setKycStatus={setKycStatus} setFeedback={setFeedback} />}
              {isUsers && <UserContent data={data} />}
              {isBankAccount && <BankAccountContent data={data} />}
              {isWaitingUsersList && <WaitingUserContent data={data} />}
              {isPresaleTrx && <PresaleTransaction data={data} setNotification={setNotification} onClose={onClose} />}
              <StyledButtonsWrap>
                <StyledButtonCancel onClick={onClose}>Cancel</StyledButtonCancel>
                {isKyc || isWaitingUsersList ? (
                  data?.kyc?.status === 'PENDING' && (
                    <StyledButtonOk
                      onClick={isKyc ? sendKyc : onClose}
                      disabled={submitLoading}
                      isDisabled={submitLoading}
                    >
                      {submitLoading ? 'Loading...' : 'OK'}
                    </StyledButtonOk>
                  )
                ) : (
                  <StyledButtonOk
                    onClick={isKyc ? sendKyc : onClose}
                    disabled={submitLoading}
                    isDisabled={submitLoading}
                  >
                    {submitLoading ? 'Loading...' : 'OK'}
                  </StyledButtonOk>
                )}
              </StyledButtonsWrap>
            </>
          )}
        </StyledModalContainer>
      </StyledModalOverlay>
    </>
  );
};

export default Modal;

import React, { useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { Modal } from 'src/components/Modal';

import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';

const WithdrawOtpPopUp = ({
  onClose,
  currency,
  address,
  blockchain,
  quantity,
  fee,
  closeModal,
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAgreedToFee, setIsAgreedToFee] = useState(false);

  const dispatch = useDispatch();

  const submitOtp = async () => {
    try {
      setLoading(true);
      request
        .post(`${PUBLIC_URL}/v1/transactions/withdraw`, {
          quantity,
          currency: currency?.id,
          recipient_address: address,
          two_fa_code: otp,
          blockchain: blockchain?.blockchain?._id,
        })
        .then(({ data }) => {
          dispatch(
            setAppAlert({
              message: data?.msg || 'Operation has been carried out successfully.',
              isSuccess: true,
            }),
          );
        })
        .catch(({ response }) => {
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Something went wrong.',
              isSuccess: false,
            }),
          );
        })
        .finally(() => {
          onClose();
          setLoading(false);
        });
    } catch (error) {
      console.error('Error submitting OTP code:', error);
    }
  };

  return (
    <>
      <Modal onClose={closeModal} isOpen>
        <Container marginBottom="1rem" textAlign="center">
          {isAgreedToFee ? (
            'Enter Google 2FA Code from authenticator app'
          ) : (
            <span>
              {fee}{' '}
              <span style={{ fontWeight: 400, color: 'gray' }}>
                fee will be taken from this operation
              </span>
            </span>
          )}
        </Container>
        {isAgreedToFee ? (
          <Input
            label="2FA Code"
            value={otp}
            onChange={(e) => {
              const value = e.currentTarget.value;
              const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 6);

              setOtp(sanitizedValue);
            }}
          />
        ) : null}
        <br />
        {isAgreedToFee ? (
          <Button
            text="Submit"
            $fullWidth
            disabled={!otp}
            isLoading={loading}
            onClick={submitOtp}
          />
        ) : (
          <Button
            text="Proceed"
            $fullWidth
            isLoading={loading}
            disabled={loading}
            onClick={() => setIsAgreedToFee(true)}
          />
        )}
      </Modal>
    </>
  );
};

export default WithdrawOtpPopUp;

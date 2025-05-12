import React, { useEffect, useRef, useState } from 'react';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { Loader } from 'src/components/Loader';
import { Modal } from 'src/components/Modal';

import { useDispatch } from 'src/store/useDispatch';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { setAppAlert } from 'src/store/slice/appAlert';
import { fetchUser } from 'src/store/slice/user';

const QrPopUp = ({ userId, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupRef, onClose]);

  const fetchQrCode = () => {
    setLoading(true);
    try {
      request
        .get(`${PUBLIC_URL}/v1/users/${userId}/add-2fa`)
        .then(({ data }) => setQrCodeBase64(data.qrUrl))
        .catch(({ response }) =>
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Something went wrong.',
              isSuccess: false,
            }),
          ),
        )
        .finally(() => setLoading(false));
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  };

  const submitOtp = async () => {
    setLoading(true);
    try {
      request
        .post(`${PUBLIC_URL}/v1/users/${userId}/add-2fa`, {
          code: otp,
        })
        .then(({ data }) => {
          dispatch(fetchUser());
          dispatch(
            setAppAlert({
              message: data?.msg || 'You have passed verification.',
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
          setLoading(false);
          onClose();
        });
    } catch (error) {
      console.error('Error submitting OTP code:', error);
    }
  };

  useEffect(() => {
    fetchQrCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen onClose={onClose}>
      <Container display="flex" flexDirection="column" alignItems="center" width="100%">
        <Container paddingBottom="1.5rem">
          {qrCodeBase64 && <img src={qrCodeBase64} alt="QR Code" />}
          {loading ? <Loader size={50} /> : null}
        </Container>
        <Input
          label="Scan QR code using Google Authenticator app and enter the code"
          value={otp || ''}
          type="number"
          onChange={(e) => setOtp(e.currentTarget.value)}
        />
        <Button text="Submit" $fullWidth disabled={!otp} onClick={submitOtp} />
      </Container>
    </Modal>
  );
};

export default QrPopUp;

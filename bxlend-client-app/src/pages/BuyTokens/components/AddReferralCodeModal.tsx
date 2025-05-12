import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Modal } from 'src/components/Modal';
import { Input } from 'src/components/Input';
import { Loader } from 'src/components/Loader';

import { useDispatch } from 'src/store/useDispatch';
import { PUBLIC_URL } from 'src/configs';
import { fetchUser } from 'src/store/slice/user';
import { fetchUserReferral } from 'src/store/slice/userReferral';
import { setAppAlert } from 'src/store/slice/appAlert';
import { RootState } from 'src/store/store';
import request from 'src/request';

const AddReferralCodeModal = ({ open, onClose }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const handleWalletSetUp = () => {
    setLoading(true);

    request
      .post(`${PUBLIC_URL}/v1/users/add-referral`, {
        referral_code: code,
      })
      .then(() => {
        dispatch(fetchUser());
        dispatch(fetchUserReferral({ userId: user.id }));
        dispatch(
          setAppAlert({
            message: 'You have successfully added referal code',
            isSuccess: true,
          }),
        );
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.message || 'Something went wrong.',
            isSuccess: false,
          }),
        );
      })
      .finally(() => {
        setLoading(false);
        setCode('');
        onClose();
      });
  };

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Container>
        <Container fontWeight={600} fontSize="1.31rem" paddingBottom="1.25rem">
          Apply a Referral Code to Get Exclusive Benefits
        </Container>
        <Input
          label="Referral Code"
          value={code}
          onChange={(e) => setCode(e.currentTarget.value)}
        />
      </Container>
      <Container
        display="flex"
        justifyContent="space-around"
        gap="2rem"
        alignItems="center"
        paddingTop="1.5rem"
      >
        <Button
          text="Submit"
          $fullWidth
          disabled={!code.length}
          onClick={() => handleWalletSetUp()}
        />
        <Button
          text="Cancel"
          $fullWidth
          onClick={onClose}
          styles={{
            background: '#DC3545',
          }}
        />
      </Container>
    </Modal>
  );
};

export default AddReferralCodeModal;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Glass } from 'src/components/Glass';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';

const EnterEmail = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.user);

  const handleCode = () => {
    setLoading(true);
    request
      .post(`${PUBLIC_URL}/v1/users/${user.id}/email/verification/resend`, null)
      .then(() => {
        dispatch(
          setAppAlert({
            message: 'The verification link has been sent to your email.',
            isSuccess: true,
          }),
        );
        navigate('/account-created');
      })
      .catch(({ response }) =>
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong.',
            isSuccess: false,
          }),
        ),
      )
      .finally(() => setLoading(false));
  };

  return (
    <Container height="100%" display="flex" alignItems="center" justifyContent="center">
      <Glass padding="3rem" maxWidth="25rem">
        <Container fontSize="1.75rem" paddingBottom="1.25rem">
          Email Verification
        </Container>
        <Container>
          <Container paddingBottom="1.25rem">
            Verification link will be sent to your email <br /> by clicking the button below.
          </Container>
          <Button
            text="Send verification link"
            $fullWidth
            isLoading={loading}
            disabled={loading}
            onClick={handleCode}
          />
          <br />
        </Container>
      </Glass>
    </Container>
  );
};

export default EnterEmail;

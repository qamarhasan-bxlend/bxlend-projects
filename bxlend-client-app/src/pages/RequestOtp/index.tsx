import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';

import { ReactComponent as BgSmall } from 'src/assets/BgSmall.svg';
import { ReactComponent as BgLarge } from 'src/assets/BgLarge.svg';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { Glass } from 'src/components/Glass';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { getSign } from 'src/constants';
import { ROUTE_FORGOT_PW_SUBMIT_OTP } from 'src/routes';

import './index.css';

const RequestRtp = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sign = getSign();

  const submitEmail = () => {
    setLoading(true);
    request
      .post(`${PUBLIC_URL}/auth/forgot-password/request-code`, { email })
      .then(({ data }) => {
        dispatch(
          setAppAlert({
            message: data?.message || `OTP was sent to ${email}. Check your email.`,
            isSuccess: true,
          }),
        );
        navigate(ROUTE_FORGOT_PW_SUBMIT_OTP, { state: { email } });
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong. Please try again later.',
            isSuccess: false,
          }),
        );
        setEmail('');
      })
      .finally(() => setLoading(false));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      submitEmail();
    }
  };

  return (
    <Container display="flex" alignItems="center" height="100%">
      <div className="form_wrap">
        <Glass width="30vw" className="glass-container">
          <Container fontSize="1.75rem" paddingBottom="1.25rem">
            Submit email to request OTP.
          </Container>
          <Container>
            <Input
              label="Personal Email"
              type="email"
              value={email}
              onKeyPress={handleKeyPress}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <Container paddingBottom="1.25rem" textAlign="center">
              Login using password? <a href={sign}>Login</a>
            </Container>
            <Button
              text="Get Code"
              $fullWidth
              isLoading={loading}
              onClick={submitEmail}
              disabled={loading || !email}
            />
          </Container>
        </Glass>
      </div>
      <div className="bg_wrap">
        <BgSmall className="bg_small" />
        <BgLarge />
      </div>
    </Container>
  );
};

export default RequestRtp;

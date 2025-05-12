import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PiEyeLight, PiEyeClosed } from 'react-icons/pi';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';

import { ReactComponent as BgSmall } from 'src/assets/BgSmall.svg';
import { ReactComponent as BgLarge } from 'src/assets/BgLarge.svg';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Glass } from 'src/components/Glass';
import { Input } from 'src/components/Input';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { PASSWORD_VALIDATION_ERROR, getSign, validatePassword } from 'src/constants';

import './index.css';

const RequestRtp = () => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { state } = useLocation();

  const sign = getSign();

  const navigate = useNavigate();

  const redirectToLoginPage = () => {
    localStorage.removeItem('access');
    navigate(`${sign}&action=signup`);
    navigate(0);
  };

  const submitPassword = () => {
    setLoading(true);
    request
      .post(`${PUBLIC_URL}/auth/forgot-password/${state?.email}`, { otp, password })
      .then(({ data }) => {
        dispatch(
          setAppAlert({
            message: data?.msg || 'Password has been reset.',
            isSuccess: true,
          }),
        );
        redirectToLoginPage();
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong. Please try again later.',
            isSuccess: false,
          }),
        );
      })
      .finally(() => {
        setPassword('');
        setOtp('');
        setLoading(false);
      });
  };

  return (
    <Container display="flex" alignItems="center" height="100%">
      <div className="form_wrap">
        <Glass width="30vw" className="glass-container">
          <Container fontSize="1.75rem" paddingBottom="1.25rem">
            Enter OTP which was sent to your email.
          </Container>
          <form>
            <Container position="relative">
              <Input
                label="6 Digit OTP"
                type={showOtp ? 'text' : 'password'}
                value={otp}
                onChange={(e) => setOtp(e.currentTarget.value)}
              />
              {showOtp ? (
                <PiEyeClosed
                  fill="#111"
                  size="1.5rem"
                  className="icon-toggle"
                  onClick={() => setShowOtp(!showOtp)}
                />
              ) : (
                <PiEyeLight
                  fill="#111"
                  size="1.5rem"
                  className="icon-toggle"
                  onClick={() => setShowOtp(!showOtp)}
                />
              )}
            </Container>
            <Container position="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                  setIsPasswordValid(validatePassword(e.currentTarget.value));
                }}
              />
              {showPassword ? (
                <PiEyeClosed
                  fill="#111"
                  size="1.5rem"
                  className="icon-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <PiEyeLight
                  fill="#111"
                  size="1.5rem"
                  className="icon-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </Container>
            {!isPasswordValid && (
              <Container color="red !important" paddingBottom="1.25rem">
                {PASSWORD_VALIDATION_ERROR}
              </Container>
            )}
            <Container textAlign="center" paddingBottom="1.25rem">
              Login using password? <a href={sign}>Login</a>
            </Container>
            <Button
              text="Submit"
              $fullWidth
              onClick={submitPassword}
              isLoading={loading}
              disabled={loading || !otp || !password || !isPasswordValid}
            />
          </form>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PiEyeLight, PiEyeClosed } from 'react-icons/pi';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';
import { RootState } from 'src/store/store';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { Glass } from 'src/components/Glass';

import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { PASSWORD_VALIDATION_ERROR, validatePassword } from 'src/constants';
import { ROUTE_EARLY_REGISTRATION } from 'src/routes';

import { InputWrapper, PageWrapper } from './styled';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
    updateSubmitButtonState(event.target.value, newPassword, confirmPassword, isPasswordValid);
  };

  const handleNewPasswordChange = (event) => {
    const newPasswordValue = event.target.value;
    setNewPassword(newPasswordValue);
    setIsPasswordValid(validatePassword(newPasswordValue));
    updateSubmitButtonState(oldPassword, newPasswordValue, confirmPassword, isPasswordValid);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    updateSubmitButtonState(oldPassword, newPassword, event.target.value, isPasswordValid);
  };

  const updateSubmitButtonState = (oldPassword, newPassword, confirmPassword, isPasswordValid) => {
    setIsSubmitDisabled(
      !(oldPassword && newPassword && confirmPassword === newPassword && isPasswordValid),
    );
  };

  const handleSubmit = () => {
    setIsLoading(true);
    request
      .patch(`${PUBLIC_URL}/v1/users/${user.id}/password`, {
        old_password: oldPassword,
        new_password: newPassword,
      })
      .then(({ data }) => {
        dispatch(
          setAppAlert({
            message: `${data.message}. You will be redirected to login page in a moment.`,
            isSuccess: !!data.message,
          }),
        );
        setTimeout(() => {
          navigate(ROUTE_EARLY_REGISTRATION);
        }, 5000);
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong',
            isSuccess: false,
          }),
        );
      })
      .finally(() => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsSubmitDisabled(true);
        setIsLoading(false);
      });
  };

  return (
    <PageWrapper>
      <Glass maxWidth="400px">
        <Container fontSize="1.75rem" textAlign="center" paddingBottom="1.25rem">
          Update password
        </Container>
        <InputWrapper>
          <Input
            label="Old Password"
            value={oldPassword}
            type={showOldPassword ? 'text' : 'password'}
            onChange={handleOldPasswordChange}
          />
          {showOldPassword ? (
            <PiEyeClosed
              fill="#111"
              size="1.5rem"
              onClick={() => setShowOldPassword(!showOldPassword)}
            />
          ) : (
            <PiEyeLight
              fill="#111"
              size="1.5rem"
              onClick={() => setShowOldPassword(!showOldPassword)}
            />
          )}
        </InputWrapper>
        <InputWrapper>
          <Input
            label="New Password"
            value={newPassword}
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={handleNewPasswordChange}
          />
          {showNewPassword ? (
            <PiEyeClosed
              fill="#111"
              size="1.5rem"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          ) : (
            <PiEyeLight
              fill="#111"
              size="1.5rem"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          )}
          {!isPasswordValid && <p style={{ color: 'red' }}>{PASSWORD_VALIDATION_ERROR}</p>}
        </InputWrapper>
        <InputWrapper>
          <Input
            label="Confirm New Password"
            value={confirmPassword}
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={handleConfirmPasswordChange}
          />
          {showConfirmPassword ? (
            <PiEyeClosed
              fill="#111"
              size="1.5rem"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          ) : (
            <PiEyeLight
              fill="#111"
              size="1.5rem"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          )}
        </InputWrapper>
        <Button
          text="Submit"
          $fullWidth
          isLoading={isLoading}
          disabled={isSubmitDisabled || isLoading}
          onClick={handleSubmit}
        />
      </Glass>
    </PageWrapper>
  );
};

export default ChangePassword;

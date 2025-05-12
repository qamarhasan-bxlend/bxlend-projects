import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PiEyeLight, PiEyeClosed } from 'react-icons/pi';

import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';
import { fetchCountries } from 'src/store/slice/countries';
import { fetchUser } from 'src/store/slice/user';
import { RootState } from 'src/store/store';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { Select } from 'src/components/Select';
import { Glass } from 'src/components/Glass';
import { Loader } from 'src/components/Loader';

import { StyledInputEmailWrap } from '../EnterEmail/styled';
import { InputWrapper } from '../ChangePassword/styled';

const EnterPhone = () => {
  const [hasPhone, setHasPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [sendCodeLabel, setSendCodeLabel] = useState('Send');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ phone_code: '', code: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user: { id, phone_number_verified },
  } = useSelector((state: RootState) => state.user);
  const { countries, loading: countriesLoading } = useSelector(
    (state: RootState) => state.countries,
  );

  useEffect(() => {
    if (!countries.length) {
      dispatch(fetchCountries());
    }
  }, [dispatch, countries]);

  const isFormFilled = phone && password;

  const handleCode = () => {
    request
      .post(`${PUBLIC_URL}/v1/users/${id}/phone-number/verification/resend`, {
        phone_number: {
          code: `+${selectedCountry.phone_code}`,
          number: String(phone),
        },
      })
      .then(() => {
        dispatch(
          setAppAlert({
            message: 'The code has been sent to your phone number.',
            isSuccess: true,
          }),
        );
      });
  };

  const handleSubmit = () => {
    if (!hasPhone) {
      setLoading(true);
      request
        .patch(`${PUBLIC_URL}/v1/users/${id}/phone-number/`, {
          password,
          phone_number: {
            code: `+${selectedCountry.phone_code}`,
            number: String(phone),
          },
        })
        .then(() => {
          dispatch(
            setAppAlert({
              message: 'The code has been sent to your phone number.',
              isSuccess: true,
            }),
          );
          setHasPhone(true);
          setSendCodeLabel('Resend');
        })
        .catch(({ response }) => {
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Phone number or password is incorrect.',
              isSuccess: false,
            }),
          );
          setPhone('');
          setPassword('');
        })
        .finally(() => {
          setLoading(false);
          setPassword('');
        });
    } else {
      setLoading(true);
      request
        .post(`${PUBLIC_URL}/v1/users/${id}/phone-number/verify`, {
          code,
          phone_number: {
            code: `+${selectedCountry.phone_code}`,
            number: String(phone),
          },
        })
        .then(() => {
          dispatch(fetchUser());
          navigate('/account-created');
          dispatch(
            setAppAlert({
              message: 'Phone number has been updated.',
              isSuccess: true,
            }),
          );
          setHasPhone(true);
        })
        .catch(({ response }) => {
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Phone number or password is incorrect.',
              isSuccess: false,
            }),
          );
          setPassword('');
          setCode('');
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    setSelectedCountry({
      code: 'HK',
      phone_code: '852',
    });
  }, []);

  if (countriesLoading) {
    return <Loader overlay />;
  }

  return (
    <Container height="100%" display="flex" alignItems="center" justifyContent="center">
      <Container>
        <Glass>
          <Container fontSize="1.75rem" paddingBottom="1.25rem">
            {hasPhone
              ? 'Phone verification'
              : `${phone_number_verified ? 'Update' : 'Add'} phone number`}
          </Container>
          {hasPhone && (
            <Container paddingBottom="2rem">
              Please enter the 6 digits verification code that was sent to{' '}
              {`+${selectedCountry?.phone_code}${phone}`}.{' '}
              <Container>
                The code is valid for{' '}
                <Container display="inline" fontWeight={500}>
                  2 minutes
                </Container>
                .
              </Container>
            </Container>
          )}
          <Container>
            <StyledInputEmailWrap>
              <Container
                display="flex"
                justifyContent="space-between"
                alignItems="flex-end"
                gap="1rem"
              >
                {!hasPhone && (
                  <Select
                    label="Country Code"
                    placeholder="Select Code..."
                    value={selectedCountry.code}
                    options={countries.map((country) => ({
                      value: country.code,
                      label: `${country.code} ${country.phone_code}`,
                    }))}
                    onChange={(e) => {
                      const selected = countries.find((country) => country.code === e.target.value);
                      setSelectedCountry(selected || { phone_code: '', code: '' });
                    }}
                  />
                )}
                <Input
                  label={
                    hasPhone && !phone && !password
                      ? 'Phone verification code'
                      : 'Personal phone number'
                  }
                  value={hasPhone ? code : phone}
                  placeholder={
                    hasPhone && !phone && !password ? 'Phone verification code' : 'XXXX XXXX'
                  }
                  onChange={(e) =>
                    hasPhone
                      ? setCode(e.currentTarget.value)
                      : setPhone(e.currentTarget.value.replace(/\D/g, ''))
                  }
                />
                {hasPhone && (
                  <Button
                    text={`${sendCodeLabel} code`}
                    onClick={handleCode}
                    styles={{ alignSelf: 'center' }}
                  />
                )}
              </Container>
            </StyledInputEmailWrap>
            {!hasPhone && (
              <InputWrapper>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                {showPassword ? (
                  <PiEyeClosed
                    fill="#111"
                    size="1.5rem"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <PiEyeLight
                    fill="#111"
                    size="1.5rem"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </InputWrapper>
            )}
            <br />
            <Button
              text={
                hasPhone ? 'Submit' : `${phone_number_verified ? 'Update' : 'Add'} phone number`
              }
              isLoading={loading}
              disabled={!hasPhone ? !isFormFilled : code.length !== 6}
              $fullWidth
              onClick={handleSubmit}
            />
          </Container>
        </Glass>
      </Container>
    </Container>
  );
};

export default EnterPhone;

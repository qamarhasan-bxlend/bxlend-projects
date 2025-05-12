import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { fetchUser } from 'src/store/slice/user';
import { setAppAlert } from 'src/store/slice/appAlert';
import { fetchNotificationsCount } from 'src/store/slice/notificationsCount';
import { RootState } from 'src/store/store';

import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';
import { Button } from 'src/components/Button';
import { Glass } from 'src/components/Glass';
import VerificationPopUp from './VerificationPopUp/VerificationPopUp';
import QrPopUp from './VerificationPopUp/QrPopUp';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { KYC_STATUS, VERIFY_ACCOUNT_MESSAGES, getColor, getDocTypeConverted } from 'src/constants';
import { ROUTE_EMAIL_VERIFICATION, ROUTE_UPDATE_PHONE } from 'src/routes';

import { StyledContainer, StyledOvalShape } from './styled';

const AccountCreated = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isQrPopupOpen, setIsQrPopupOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [docType, setDocType] = useState('');
  const [documentQuery, setDocumentQuery] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<null | File>(null);
  const [frontImage, setFrontImage] = useState<null | File>(null);
  const [backImage, setBackImage] = useState<null | File>(null);
  const [isKYCdone, setIsKYCDone] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    user: { email_verified, phone_number_verified, twoFA_verified, kyc_status, id },
    loading,
  } = useSelector((state: RootState) => state.user);
  const { countries } = useSelector((state: RootState) => state.countries);

  const navigate = useNavigate();

  const { state, pathname } = useLocation();

  const { code } = countries.find((c) => c.name === query) ?? {
    code: '',
  };

  const isVerified =
    email_verified &&
    phone_number_verified &&
    twoFA_verified &&
    (kyc_status === KYC_STATUS.PENDING || kyc_status === KYC_STATUS.VERIFIED);

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const formData = new FormData();
      const type = docType === 'Passport' ? docType.toUpperCase() : getDocTypeConverted(docType);

      if (uploadedImage) formData.append('kyc_document', uploadedImage);
      if (frontImage) formData.append('kyc_document', frontImage);
      if (backImage) formData.append('kyc_document', backImage);
      formData.append('name[first]', firstName);
      formData.append('name[last]', lastName);
      formData.append('country_code', code);
      formData.append('address[city]', city);
      formData.append('address[pin_code]', pinCode);
      formData.append('address[full_address]', address);
      formData.append('terms_and_conditions_consent', termsAgreed.toString());
      formData.append('privacy_policy_consent', privacyAgreed.toString());
      formData.append('identification_type', type);

      await request
        .post(`${PUBLIC_URL}/v1/kyc/create-request`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data;',
          },
        })
        .then(() => {
          setIsKYCDone(true);
          dispatch(fetchUser());
          dispatch(
            setAppAlert({
              message: 'You have successfully submitted you KYC data.',
              isSuccess: true,
            }),
          );
        })
        .catch(({ response }) =>
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Something went wrong.',
              isSuccess: false,
            }),
          ),
        )
        .finally(() => {
          setSubmitLoading(true);
          setIsPopupOpen(false);
        });
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
    }
  };

  const verifyNowHandler = () => {
    if (!email_verified) return navigate(ROUTE_EMAIL_VERIFICATION);
    if (!phone_number_verified) return navigate(ROUTE_UPDATE_PHONE);

    if (kyc_status !== KYC_STATUS.VERIFIED && kyc_status !== KYC_STATUS.PENDING) {
      setIsPopupOpen(true);
      return null;
    }

    if (!twoFA_verified) {
      setIsQrPopupOpen(true);
    }
  };

  useEffect(() => {
    dispatch(fetchUser);
  }, [isKYCdone, dispatch]);

  useEffect(() => {
    if (state && state.message) {
      dispatch(setAppAlert({ message: state.message, isSuccess: false }));
      navigate(pathname, { replace: true });
    }
    dispatch(fetchNotificationsCount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <Container display="flex" alignItems="center" justifyContent="center">
      <Container>
        <Glass>
          <Container fontSize="1.75rem" paddingBottom="1rem">
            Account created
          </Container>
          <Container>
            <Container paddingBottom="0.5rem">
              Verify your identification to enjoy your <br /> BxLend journey.
            </Container>
            <Container display="flex" flexDirection="column" gap="1rem">
              <StyledContainer
                onClick={() => navigate(ROUTE_EMAIL_VERIFICATION)}
                $isVerified={!!email_verified}
              >
                <StyledOvalShape deg="-5" color={email_verified ? '#20BF55' : '#828282'} />
                <Container>
                  <Container color="#172A4F !important" fontWeight={500}>
                    Verify Email
                  </Container>
                  <Container color="#828282 !important">
                    {email_verified
                      ? 'You have already verified your email.'
                      : 'Please verify your email as the first step.'}
                  </Container>
                </Container>
              </StyledContainer>
              <StyledContainer onClick={() => navigate(ROUTE_UPDATE_PHONE)}>
                <StyledOvalShape deg="10" color={phone_number_verified ? '#20BF55' : '#828282'} />
                <Container>
                  <Container color="#172A4F !important" fontWeight={500}>
                    Phone Number
                  </Container>
                  <Container color="#828282 !important">
                    {phone_number_verified
                      ? 'You have verified you phone number.'
                      : 'Please verify your phone number.'}
                  </Container>
                </Container>
              </StyledContainer>
              <StyledContainer
                onClick={() => setIsPopupOpen(true)}
                $isVerified={
                  kyc_status === KYC_STATUS.PENDING || kyc_status === KYC_STATUS.VERIFIED
                }
              >
                <>
                  <StyledOvalShape deg="-5" color={getColor(kyc_status)} />
                  <Container>
                    <Container color="#172A4F !important" fontWeight={500}>
                      Account Verification
                    </Container>
                    <Container color="#828282 !important">
                      {VERIFY_ACCOUNT_MESSAGES[kyc_status] ??
                        'Verify your account in a few minutes.'}
                    </Container>
                  </Container>
                </>
              </StyledContainer>
              <StyledContainer
                onClick={() => setIsQrPopupOpen(true)}
                $isVerified={!!twoFA_verified}
              >
                <StyledOvalShape deg="10" color={twoFA_verified ? '#20BF55' : '#828282'} />
                <Container>
                  <Container color="#172A4F !important" fontWeight={500}>
                    2 factor verification
                  </Container>
                  <Container color="#828282 !important">
                    Add your 2 factor authentication.
                  </Container>
                </Container>
              </StyledContainer>
            </Container>
            <br />
            <Button
              text="Verify now"
              $fullWidth
              isLoading={loading}
              disabled={!!isVerified}
              onClick={verifyNowHandler}
            />
          </Container>
        </Glass>
      </Container>
      {isPopupOpen && (
        <VerificationPopUp
          onClose={() => setIsPopupOpen(false)}
          firstName={firstName}
          setFirstName={setFirstName}
          address={address}
          backImage={backImage}
          city={city}
          countries={countries}
          docType={docType}
          documentQuery={documentQuery}
          frontImage={frontImage}
          handleSubmit={handleSubmit}
          lastName={lastName}
          middleName={middleName}
          pinCode={pinCode}
          privacyAgreed={privacyAgreed}
          query={query}
          setAddress={setAddress}
          setBackImage={setBackImage}
          setCity={setCity}
          setDocType={setDocType}
          setDocumentQuery={setDocumentQuery}
          setFrontImage={setFrontImage}
          setLastName={setLastName}
          setMiddleName={setMiddleName}
          setPinCode={setPinCode}
          setPrivacyAgreed={setPrivacyAgreed}
          setQuery={setQuery}
          setTermsAgreed={setTermsAgreed}
          setUploadedImage={setUploadedImage}
          termsAgreed={termsAgreed}
          uploadedImage={uploadedImage}
          submitLoading={submitLoading}
        />
      )}
      {isQrPopupOpen && <QrPopUp userId={id} onClose={() => setIsQrPopupOpen(false)} />}
    </Container>
  );
};

export default AccountCreated;

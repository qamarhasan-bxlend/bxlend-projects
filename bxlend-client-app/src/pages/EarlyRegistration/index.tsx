import React, { useEffect, useRef, useState } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';
import { fetchCountries } from 'src/store/slice/countries';
import { setAppAlert } from 'src/store/slice/appAlert';
import { RootState } from 'src/store/store';

import { ReactComponent as BgSmall } from 'src/assets/BgSmall.svg';
import { ReactComponent as BgLarge } from 'src/assets/BgLarge.svg';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { getDocTypeConverted } from 'src/constants';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import { Glass } from 'src/components/Glass';
import { Select } from 'src/components/Select';
import CountryInput from '../AccountCreated/VerificationPopUp/CountryInput';
import UploadButton from '../AccountCreated/VerificationPopUp/UploadButton';
import Checkbox from '../AccountCreated/VerificationPopUp/Checkbox';
import CapturePicture from '../AccountCreated/VerificationPopUp/CapturePicture';

import { StyledCheckboxLabel, StyledSquare } from '../AccountCreated/VerificationPopUp/styled';
import './index.css';

const EarlyRegistration = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [docType, setDocType] = useState('');
  const [address, setAddress] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<null | File>(null);
  const [frontImage, setFrontImage] = useState<null | File>(null);
  const [backImage, setBackImage] = useState<null | File>(null);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [docError, setDocError] = useState('');
  const videoRef = useRef();

  const { countries } = useSelector((state: RootState) => state.countries);
  const dispatch = useDispatch();

  const { code } = countries.find((c: { name: string; code: string }) => c.name === query) ?? {
    code: '',
  };

  const docLabel = () => {
    if (!uploadedImage && !frontImage && !backImage) {
      return '(Optional)';
    }
    if (
      uploadedImage &&
      frontImage &&
      backImage &&
      docType !== '' &&
      docType !== 'Select document type'
    ) {
      return '';
    }

    return '(Required)';
  };

  const isDocsCheckPassed = () => {
    if (!uploadedImage && !frontImage && !backImage) {
      return true;
    }
    if (uploadedImage && (!frontImage || !backImage)) {
      return false;
    }
    if (frontImage && (!uploadedImage || !backImage)) {
      return false;
    }
    if (backImage && (!frontImage || !uploadedImage)) {
      return false;
    }
    if (
      uploadedImage &&
      frontImage &&
      backImage &&
      docType !== '' &&
      docType !== 'Select document type'
    ) {
      return true;
    }
  };

  const isSubmitActive =
    firstName &&
    lastName &&
    address &&
    isEmailValid &&
    code &&
    pinCode &&
    city &&
    termsAgreed &&
    privacyAgreed &&
    isDocsCheckPassed();

  const handleStartCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // @ts-expect-error TODO: Fix type
        videoRef.current.srcObject = stream;
        // @ts-expect-error TODO: Fix type
        videoRef.current.play();
      })
      .catch((error) => console.error(error));
  };

  const resetState = () => {
    setFirstName('');
    setEmail('');
    setQuery('');
    setMiddleName('');
    setLastName('');
    setAddress('');
    setPinCode('');
    setCity('');
    setTermsAgreed(false);
    setPrivacyAgreed(false);
    setUploadedImage(null);
    setFrontImage(null);
    setBackImage(null);
    setIsVideoStarted(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      const type = docType === 'Passport' ? docType.toUpperCase() : getDocTypeConverted(docType);

      if (uploadedImage) formData.append('waiting_list_user_document', uploadedImage);
      if (frontImage) formData.append('waiting_list_user_document', frontImage);
      if (backImage) formData.append('waiting_list_user_document', backImage);
      formData.append('name[first]', firstName);
      formData.append('name[last]', lastName);
      formData.append('country_code', code);
      formData.append('email', email);
      formData.append('address[city]', city);
      formData.append('address[pin_code]', pinCode);
      formData.append('address[full_address]', address);
      formData.append('terms_and_conditions_consent', termsAgreed.toString());
      formData.append('privacy_policy_consent', privacyAgreed.toString());
      formData.append('identification_type', type);

      await request
        .post(`${PUBLIC_URL}/waiting-list/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data;',
          },
        })
        .then(({ data }) => {
          dispatch(
            setAppAlert({
              message: data?.msg || 'You have submitted your data.',
              isSuccess: true,
            }),
          );
          resetState();
        })
        .catch(({ response }) =>
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Something went wrong',
              isSuccess: false,
            }),
          ),
        )
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
    }
  };

  const validateEmail = (password) => {
    const passwordRegex =
      // eslint-disable-next-line max-len
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setIsEmailValid(passwordRegex.test(password));
  };

  useEffect(() => {
    if (!uploadedImage && !frontImage && !backImage) {
      setDocError('');
      return;
    }
    if (uploadedImage && (!frontImage || !backImage)) {
      setDocError('You must either upload all docs or none of them.');
      return;
    }
    if (frontImage && (!uploadedImage || !backImage)) {
      setDocError('You must either upload all docs or none of them.');
      return;
    }
    if (backImage && (!frontImage || !uploadedImage)) {
      setDocError('You must either upload all docs or none of them.');
      return;
    }
    if (uploadedImage && frontImage && backImage) {
      setDocError('');
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImage, frontImage, backImage, docType]);

  useEffect(() => {
    if (!countries.length) {
      dispatch(fetchCountries());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Container>
        <Glass maxWidth="37rem">
          <Container fontSize="1.75rem" paddingBottom="1.25rem">
            Fill out registration form below:
          </Container>
          <Container display="flex" flexDirection="column">
            <div>Country/region</div>
            <CountryInput countries={countries} query={query} setQuery={(q) => setQuery(q)} />
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
            />
            <Input
              label="Middle Name (optional)"
              value={middleName}
              onChange={(e) => setMiddleName(e.currentTarget.value)}
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
            />
            <Input
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
                validateEmail(e.currentTarget.value);
              }}
            />
            {!isEmailValid && email && <p style={{ color: 'red' }}>Invalid email</p>}
          </Container>
          <Container display="flex" flexDirection="column" gap="1.25rem">
            <Input
              label="Full Address"
              value={address}
              onChange={(e) => setAddress(e.currentTarget.value)}
            />
            <Input
              label="Pincode"
              value={pinCode}
              onChange={(e) => setPinCode(e.currentTarget.value)}
            />
            <Container padding="0 0 15px">
              <Input label="City" value={city} onChange={(e) => setCity(e.currentTarget.value)} />
            </Container>
          </Container>
          <Container display="flex" flexDirection="column" gap="1.25rem">
            <Select
              label={`Document Type ${docLabel()}`}
              options={[
                {
                  value: 'Select document type',
                  label: 'Select document type',
                },
                {
                  value: 'Passport',
                  label: 'Passport',
                },
                {
                  value: 'Identity card',
                  label: 'Identity card',
                },
                {
                  value: 'Driving license',
                  label: 'Driving license',
                },
              ]}
              value={docType}
              onChange={(e) => setDocType(e.currentTarget.value)}
            />
            <Container
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="0.6rem"
              paddingBottom="1.25rem"
            >
              {docError && <span style={{ color: 'red' }}>{docError}</span>}
              <UploadButton text="Front" file={frontImage} setFile={setFrontImage} />
              <UploadButton text="Back" file={backImage} setFile={setBackImage} />
            </Container>
          </Container>
          <Container display="flex" flexDirection="column" gap="1.25rem">
            {isVideoStarted ? (
              <CapturePicture
                videoRef={videoRef}
                isVideoStarted={isVideoStarted}
                handleStartCamera={handleStartCamera}
                setUploadedImage={setUploadedImage}
                uploadedImage={uploadedImage}
              />
            ) : (
              <StyledSquare
                onClick={() => {
                  handleStartCamera();
                  setIsVideoStarted(!isVideoStarted);
                }}
              >
                <span
                  style={{ border: '2px solid dotted', color: '#fff', padding: '0.6rem 1.25rem' }}
                >
                  Submit <br /> Live <br /> Selfie
                </span>
              </StyledSquare>
            )}
            <ul style={{ paddingBottom: '1.25rem' }}>
              <li style={{ fontWeight: 500 }}>* Only images are allowed to be uploaded.</li>
              <li>Do not hide parts of your face with hats or glasses.</li>
              <li>Take a picture in well-lit area.</li>
            </ul>
          </Container>
          <Container paddingBottom="1.25rem">
            <>
              <div>
                <div>
                  <Checkbox isChecked={termsAgreed} setIsChecked={setTermsAgreed}>
                    <StyledCheckboxLabel>
                      I agree with{' '}
                      <a target="_blank" href="/term-of-use">
                        terms and conditions
                      </a>
                    </StyledCheckboxLabel>
                  </Checkbox>
                </div>
                <div>
                  <Checkbox isChecked={privacyAgreed} setIsChecked={setPrivacyAgreed}>
                    <StyledCheckboxLabel>
                      I agree with{' '}
                      <a target="_blank" href="/privacy-policy">
                        privacy and policy
                      </a>
                    </StyledCheckboxLabel>
                  </Checkbox>
                </div>
              </div>
            </>
          </Container>
          <Button
            text="Submit"
            $fullWidth
            isLoading={loading}
            disabled={loading || !isSubmitActive}
            onClick={handleSubmit}
          />
        </Glass>
      </Container>
      <div className="bg_wrap">
        <BgSmall className="bg_small" />
        <BgLarge />
      </div>
    </>
  );
};

export default EarlyRegistration;

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { fetchCountries } from 'src/store/slice/countries';

import { ReactComponent as ArrowDown } from 'src/assets/ArrowDown.svg';

import { Container } from 'src/components/Container';
import { Input } from 'src/components/Input';
import { Select } from 'src/components/Select';
import { Modal } from 'src/components/Modal';
import Content from './Content';
import CountryInput from './CountryInput';
import UploadButton from './UploadButton';
import CapturePicture from './CapturePicture';
import Checkbox from './Checkbox';

import { StyledCheckboxLabel, StyledClosebtn, StyledError, StyledSquare } from './styled';

const VerificationPopUp = ({
  onClose,
  firstName,
  setFirstName,
  middleName,
  setMiddleName,
  lastName,
  setLastName,
  docType,
  setDocType,
  query,
  setQuery,
  documentQuery,
  setDocumentQuery,
  address,
  setAddress,
  pinCode,
  setPinCode,
  city,
  setCity,
  termsAgreed,
  setTermsAgreed,
  privacyAgreed,
  setPrivacyAgreed,
  countries,
  uploadedImage,
  setUploadedImage,
  frontImage,
  setFrontImage,
  backImage,
  setBackImage,
  handleSubmit,
  submitLoading,
}) => {
  const [step, setStep] = useState(1);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef();

  const dispatch = useDispatch();

  const { isDark } = useSelector(({ isDark }) => isDark);

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

  const validateAddress = (value) => {
    const regex = /^[a-zA-Z0-9\s,.'-]*$/;

    if (!regex.test(value)) {
      setError('Address contains invalid characters.');
    } else {
      setError('');
    }
    setAddress(value);
  };

  useEffect(() => {
    if (!countries.length) {
      dispatch(fetchCountries());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal isOpen onClose={onClose}>
        <Container
          display="flex"
          justifyContent={step > 1 ? 'space-between' : 'flex-end'}
          alignItems="center"
          width="100%"
        >
          {step > 1 && (
            <span onClick={() => setStep(step - 1)} style={{ cursor: 'pointer' }}>
              <ArrowDown
                height={8}
                stroke={isDark ? '#fff' : '#111'}
                style={{
                  transform: 'rotate(90deg)',
                }}
              />
            </span>
          )}
          <StyledClosebtn
            style={{ right: 14, top: 3, fontWeight: 100, fontSize: 32 }}
            onClick={() => onClose()}
          >
            +
          </StyledClosebtn>
        </Container>
        {step === 1 && (
          <Content
            title="Lets get you verified"
            subtitle="Select your region and follow the steps"
            buttonText="Continue"
            isNextActive={
              !!(
                countries.some(
                  (obj: { name: string }) => obj.name.toLowerCase() === query.toLowerCase(),
                ) &&
                firstName &&
                lastName
              )
            }
            handleNext={() =>
              countries.some(
                (obj: { name: string }) => obj.name.toLowerCase() === query.toLowerCase(),
              ) && setStep(2)
            }
          >
            <Container display="flex" flexDirection="column">
              <div>
                <div>Country/region</div>
                <CountryInput countries={countries} query={query} setQuery={(q) => setQuery(q)} />
              </div>
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value.trim())}
              />
              <Input
                label="Middle Name (optional)"
                value={middleName}
                onChange={(e) => setMiddleName(e.currentTarget.value.trim())}
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value.trim())}
              />
              <p>Complete the following steps to verify your account in just few minutes</p>
              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0 14px',
                }}
              >
                <li>Personal information</li>
                <li>Government-issued ID</li>
                <li>Facial recognition</li>
              </ul>
            </Container>
          </Content>
        )}
        {step === 2 && (
          <Content
            title="Home address"
            subtitle="Fill your current residential address."
            buttonText="Continue"
            isNextActive={!!(address && pinCode && city && !error)}
            handleNext={() => !!(address && pinCode && city) && setStep(3)}
          >
            <Container display="flex" flexDirection="column">
              <div>
                <Input
                  label="Full Address"
                  value={address}
                  onChange={(e) => validateAddress(e.currentTarget.value)}
                />
                {error && <StyledError>{error}</StyledError>}
              </div>
              <Input
                label="Pincode"
                value={pinCode}
                onChange={(e) => setPinCode(e.currentTarget.value)}
              />
              <Input label="City" value={city} onChange={(e) => setCity(e.currentTarget.value)} />
            </Container>
          </Content>
        )}
        {step === 3 && (
          <Content
            title="Document verification"
            buttonText="Continue"
            isNextActive={
              !!countries.some(
                (obj: { name: string }) => obj.name.toLowerCase() === documentQuery.toLowerCase(),
              ) &&
              frontImage &&
              backImage &&
              docType &&
              docType !== 'Select document type'
            }
            handleNext={() =>
              countries.some(
                (obj: { name: string }) => obj.name.toLowerCase() === documentQuery.toLowerCase(),
              ) && setStep(4)
            }
          >
            <Container display="flex" flexDirection="column">
              <div>
                <div>Document issuing Country/Region</div>
                <CountryInput
                  countries={countries}
                  query={documentQuery}
                  setQuery={(q) => setDocumentQuery(q)}
                />
              </div>
              <Select
                label="Document issuing Country/Region"
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
              <Container display="flex" flexDirection="column" gap="0.6rem" alignItems="center">
                <UploadButton text="Front" file={frontImage} setFile={setFrontImage} />
                <UploadButton text="Back" file={backImage} setFile={setBackImage} />
              </Container>
            </Container>
          </Content>
        )}
        {step === 4 && (
          <Content
            title="Liveness check"
            subtitle={
              uploadedImage
                ? 'Images is uploaded, you are all set!'
                : "You are almost there! Center your face in the frame and follow the instructions. Make sure it's completed by yourself."
            }
            buttonText={uploadedImage ? 'Submit' : 'I am ready'}
            isNextActive={!isVideoStarted || (!!uploadedImage && termsAgreed && privacyAgreed)}
            submitLoading={submitLoading}
            handleNext={() => {
              if (uploadedImage && termsAgreed && privacyAgreed) {
                handleSubmit();
              } else {
                handleStartCamera();
                setIsVideoStarted(!isVideoStarted);
              }
            }}
          >
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
                <StyledSquare />
              )}
              <ul style={{ paddingBottom: '1.25rem', paddingLeft: 16 }}>
                <li style={{ fontWeight: 500 }}>* Only images are allowed to be uploaded.</li>
                <li>Do not hide parts of your face with hats or glasses.</li>
                <li>Take a picture in well-lit area.</li>
              </ul>
            </Container>
            <>
              {!uploadedImage && (
                <div>
                  <div>
                    <div>
                      <Checkbox isChecked={termsAgreed} setIsChecked={setTermsAgreed}>
                        <StyledCheckboxLabel>
                          I agree with
                          <Link to="/term-of-use"> terms and conditions</Link>
                        </StyledCheckboxLabel>
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox isChecked={privacyAgreed} setIsChecked={setPrivacyAgreed}>
                        <StyledCheckboxLabel>
                          I agree with
                          <Link to="/privacy-policy"> privacy and policy</Link>
                        </StyledCheckboxLabel>
                      </Checkbox>
                    </div>
                  </div>
                </div>
              )}
            </>
          </Content>
        )}
      </Modal>
    </>
  );
};

export default VerificationPopUp;

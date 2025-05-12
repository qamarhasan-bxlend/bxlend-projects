import React, { useEffect, useState } from 'react';
import { BiCopy } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { Button } from 'src/components/Button';
import { Loader } from 'src/components/Loader';
import { AlertCopy } from 'src/components/Table/components/AlertCopy';

import RoundSection from './components/RoundSection';
import TokenBalance from './components/TokenBalance';
import WalletAddressModal from '../BuyTokens/components/WalletAddressModal';
import Badge from 'src/components/StatusBadge/Badge';
import AddReferralCodeModal from '../BuyTokens/components/AddReferralCodeModal';

import { ROUTE_ACCOUNT_CREATED } from 'src/routes';
import { getSign, handleCopy, KYC_STATUS, shortenString } from 'src/constants';
import { RootState } from 'src/store/store';
import { fetchPresale } from 'src/store/slice/presale';
import { setAppAlert } from 'src/store/slice/appAlert';
import { fetchTickers } from 'src/store/slice/tickers';
import { fetchPresaleUser } from 'src/store/slice/presaleUser';

const Presale = () => {
  const [open, setOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage?.getItem('access');
  const sign = getSign();

  const {
    user: { email_verified, phone_number_verified, kyc_status, referred_by },
  } = useSelector((state: RootState) => state.user);
  const { presale, loading } = useSelector((state: RootState) => state.presale);
  const { presaleUser, loading: presaleUserLoading } = useSelector(
    (state: RootState) => state.presaleUser,
  );
  const { tickers, loading: tickersLoading } = useSelector((state: RootState) => state.tickers);

  const isKycVerified = kyc_status === KYC_STATUS.VERIFIED;

  useEffect(() => {
    if (!presale) {
      dispatch(fetchPresale());
    }

    if (token && !presaleUser) {
      dispatch(fetchPresaleUser());
    }

    if (!tickers.length) {
      dispatch(fetchTickers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || tickersLoading || presaleUserLoading) {
    return <Loader overlay />;
  }

  return (
    <>
      <Glass>
        <Container fontSize="1.75rem" textAlign="center" paddingBottom="1.25rem">
          Presale
        </Container>
        <Container display="flex" justifyContent="center" gap="2rem" flexWrap="wrap">
          {presale && (
            <RoundSection
              presaleInfo={presale}
              isEmailVerified={email_verified && phone_number_verified}
              tickers={tickers}
            />
          )}
          <Container display="flex" flexDirection="column" justifyContent="space-between">
            {presale && presaleUser && (
              <TokenBalance
                totalAllocation={presaleUser.total_allocation}
                tickers={tickers}
                presale={presale}
              />
            )}
            <Glass padding="1rem 1.5rem" margin="0 0 1rem">
              <Container borderRadius="1.25rem" position="relative">
                {!token && (
                  <Container
                    position="absolute"
                    zIndex="9999"
                    top="0"
                    left="0"
                    borderRadius="1.25rem"
                    width="calc(100% + 3rem)"
                    marginTop="-1.5rem"
                    marginLeft="-1.5rem"
                    height="calc(100% + 3rem)"
                    backdropFilter="blur(8px)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap="0.25rem"
                  >
                    <span>
                      <a href={sign}>Login</a>
                    </span>
                    <span>using password</span>
                  </Container>
                )}
                <Container
                  display="flex"
                  gap="5rem"
                  alignItems="center"
                  justifyContent="space-between"
                  marginBottom="2rem"
                >
                  <Container fontWeight={600}>Account Status</Container>
                  <Container padding="0.2rem 0" borderRadius="0.25rem">
                    {email_verified && phone_number_verified ? (
                      <Badge value="VERIFIED" />
                    ) : (
                      <Button
                        type="outlined"
                        text="Verify"
                        onClick={() => {
                          navigate(ROUTE_ACCOUNT_CREATED);
                          dispatch(
                            setAppAlert({
                              message: 'Both email and phone number must be verified.',
                            }),
                          );
                        }}
                      />
                    )}
                  </Container>
                </Container>
                <Container
                  display="flex"
                  gap="3rem"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Container fontWeight={600}>Receiving Wallet</Container>
                  <Container display="flex" alignItems="center" gap="1rem">
                    {presaleUser?.receiving_wallet ? (
                      <Container display="flex" alignItems="center" gap="1rem">
                        <Container>{shortenString(presaleUser.receiving_wallet)}</Container>
                        <Container
                          onClick={() => handleCopy(presaleUser.receiving_wallet)}
                          cursor="pointer"
                        >
                          <BiCopy />
                        </Container>
                      </Container>
                    ) : (
                      <Button
                        text="Add Wallet"
                        disabled={!email_verified || !isKycVerified}
                        onClick={() => setOpen(true)}
                      />
                    )}
                  </Container>
                </Container>
                <AlertCopy />
              </Container>
            </Glass>
            <Glass padding={referred_by ? '1rem 1.5rem 1rem' : '1rem 1.5rem 1.5rem'}>
              {referred_by ? (
                <Container textAlign="center">
                  <Container>You are referred by </Container>
                  <Container>
                    <strong>{referred_by}</strong>
                  </Container>
                </Container>
              ) : (
                <Button
                  $fullWidth
                  disabled={!(email_verified && phone_number_verified)}
                  text="Apply Referral Code"
                  onClick={() => setIsReferralModalOpen(true)}
                />
              )}
            </Glass>
          </Container>
        </Container>
      </Glass>
      <WalletAddressModal open={open} onClose={() => setOpen(false)} />
      <AddReferralCodeModal
        open={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </>
  );
};

export default Presale;

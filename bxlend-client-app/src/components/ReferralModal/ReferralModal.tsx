import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Telegram, Discord } from 'react-bootstrap-icons';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { styled } from 'styled-components';

import { ReactComponent as XLogo } from 'src/assets/XLogo.svg';

import { Modal } from 'src/components/Modal';
import { Button } from 'src/components/Button';
import { Container } from 'src/components/Container';
import { Glass } from '../Glass';
import { Loader } from 'src/components/Loader';
import { AlertCopy } from '../Table/components/AlertCopy';

import { handleCopy } from 'src/constants';
import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { fetchUserReferral } from 'src/store/slice/userReferral';
import { fetchPresaleUser } from 'src/store/slice/presaleUser';

const ScrollableContainer = styled(Container)`
  flex-grow: 1;
  max-height: 15rem;
  overflow-y: auto;
  padding: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
    z-index: 9999;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const ReferralModal = ({ onClose }) => {
  const { isDark } = useSelector(({ isDark }) => isDark);
  const { user } = useSelector((state: RootState) => state.user);
  const { myReferrals, loading } = useSelector(({ myReferrals }) => myReferrals);
  const { presaleUser, loading: presaleUserLoading } = useSelector(
    (state: RootState) => state.presaleUser,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!myReferrals) {
      dispatch(fetchUserReferral({ userId: user.id }));
    }

    if (!presaleUser) {
      dispatch(fetchPresaleUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen onClose={onClose}>
      <Container>
        <Container fontSize="1.25rem" fontWeight={500} textAlign="center" marginBottom="1rem">
          Earn rewards for referring your friends
        </Container>
        <Container paddingBottom="0.25rem">Your Referral Code</Container>
        <Container display="flex" gap="0.5rem" marginBottom="1.5rem">
          <Container
            padding="0.5rem 1rem"
            background={isDark ? 'gray' : '#ccc'}
            borderRadius="0.5rem"
            flexGrow={1}
          >
            {user.bxlend_id}
          </Container>
          <Button text="Copy" onClick={() => handleCopy(user.bxlend_id)} />
        </Container>
        <Container display="flex" justifyContent="space-between" marginBottom="1rem">
          <Container display="flex" gap="0.5rem" alignItems="center">
            <Container>Referrals Pending: 0 |</Container>
            <Container>Referrals Achieved: {myReferrals?.length ?? 0}</Container>
          </Container>
          <Container display="flex" gap="1rem">
            <a
              href="https://x.com/bxlend_"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <XLogo height="2rem" fill={isDark ? '#fff' : '#111'} width={25} />
            </a>
            <a
              href="https://t.me/bxlend"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Telegram size="2rem" color="#0088CC" width={25} />
            </a>
            <a
              href="https://discord.gg/Kg8z3zNP"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Discord size="2rem" color="#5865F2" width={25} />
            </a>
          </Container>
        </Container>
        <Container width="100%" display="flex">
          <Container
            display="flex"
            flexDirection="column"
            width="50%"
            borderRight="1px solid #ccc"
            textAlign="center"
            padding="0 1rem 1rem 1rem"
          >
            <Container
              width="calc(100% + 3.3rem)"
              marginLeft="-2.25rem"
              padding="0.5rem 0"
              background={isDark ? 'gray' : '#ccc'}
            >
              Your Referrals
            </Container>
            <Container></Container>
            <Container
              display="flex"
              flexDirection="column"
              justifyContent="center"
              padding="1rem"
              height="100%"
            >
              {loading || presaleUserLoading ? (
                <Loader size={80} />
              ) : (
                <Container>
                  <Container>
                    Your Total Referral Reward{' '}
                    <Container display="inline" fontWeight={600}>
                      {presaleUser?.referral_reward?.token_allocation}
                    </Container>
                  </Container>
                  <ScrollableContainer>
                    {myReferrals?.length ? (
                      myReferrals.map((i) => (
                        <Container key={i.email} fontSize="1rem" marginBottom="0.5rem">
                          <Glass padding="0.5rem" margin="0">
                            <Container fontSize="0.9rem" overflow="hidden" wordBreak="break-word">
                              {i.email}
                            </Container>
                          </Glass>
                        </Container>
                      ))
                    ) : (
                      <Glass margin="0" padding="1rem">
                        <Container fontSize="1rem">You do not have referrals</Container>
                      </Glass>
                    )}
                  </ScrollableContainer>
                </Container>
              )}
            </Container>
          </Container>
          <Container
            display="flex"
            flexDirection="column"
            width="50%"
            textAlign="center"
            padding="0 1rem 1rem 1rem"
          >
            <Container
              marginBottom="1rem"
              width="calc(100% + 3.3rem)"
              marginLeft="-1rem"
              padding="0.5rem 0"
              background={isDark ? 'gray' : '#ccc'}
            >
              Why refer?
            </Container>
            <Container paddingBottom="1.5rem">
              <FaRegCalendarAlt size={30} />
            </Container>
            <Container display="flex" flexDirection="column" gap="2rem">
              <Container marginBottom="1rem">
                <Container>Get 10% of your friend&apos;s allocation as bonus </Container>
              </Container>
              <Container marginBottom="1rem">
                <Container>Your friend will get 10% bonus on total allocation</Container>
              </Container>
              <Container marginBottom="1rem">
                <Container>
                  Invite <strong>5</strong> friends to be eligible for future airdrop
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
        <AlertCopy />
      </Container>
    </Modal>
  );
};

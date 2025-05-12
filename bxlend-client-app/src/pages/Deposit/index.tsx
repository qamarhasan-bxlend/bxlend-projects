import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronLeft } from 'react-bootstrap-icons';

import { Container } from 'src/components/Container';
import GenerateAddressBtn from './GenerateAddressBtn';
import Dropdown from 'src/components/Dropdown';
import AddressWrap from './AddressWrap';
import Footer from './Footer';
import CopyAlert from './CopyAlert';
import DepositModal from './DepositModal';
import StepsGuide from './StepsGuide';
import RedAreaNote from 'src/components/RedAreaNote';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';
import { fetchCurrencies } from 'src/store/slice/currencies';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { ROUTE_WALLET } from 'src/routes';

import './index.css';

const depositableCurrencies = ['ETH', 'SOL'];

const Deposit = () => {
  const [blockchains, setBlockchains] = useState([]);
  const [blockchain, setBlockchain] = useState<any>(null);
  const [wallet, setWallet] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const [isReadyForAddress, setIsReadyForAddress] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const { currencies } = useSelector((state: RootState) => state.currencies);

  const { coin } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const address =
    state?.code === 'SOL' ? '3j7sAoKGiC4GYcYCXaED4h5jzobtfrCaqoNzDDKoX4Dx' : wallet.address;

  useEffect(() => {
    const fetchWalletAddress = (id: string) => {
      if (!id || !isReadyForAddress) {
        return null;
      }

      try {
        setLoading(true);
        request
          .get(`${PUBLIC_URL}/v1/deposit_addresses/${blockchain.blockchain._id}/${coin}`)
          .then((wallet) => setWallet(wallet.data.wallet))
          .catch(({ response }) => {
            dispatch(setAppAlert({ message: response?.data?.error || 'Something went wrong' }));
            navigate(ROUTE_WALLET);
          })
          .finally(() => {
            setLoading(false);
            setIsReadyForAddress(true);
          });
      } catch (e) {
        console.log(e);
      }
    };

    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }
    const activeCurrency = currencies.find((curr) => curr?.code === coin);
    if (activeCurrency?.id) {
      fetchWalletAddress(activeCurrency?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReadyForAddress, currencies]);

  useEffect(() => {
    const selectedCoin = currencies.find((c) => c?.code === coin);

    if (selectedCoin) {
      setBlockchains(
        // @ts-expect-error expected
        selectedCoin.supported_blockchains.filter(
          (i: {
            blockchain: { name: string; symbol: string };
            deposit_options: { is_allowed: boolean; is_suspended: boolean };
          }) => i.deposit_options.is_allowed,
        ),
      );
    }
  }, [coin, currencies]);

  return (
    <Container>
      <div className="px-lg-5 px-sm-3 position-relative">
        <div className="d-flex align-items-center mb-4">
          <span className="btn" onClick={() => navigate(-1)}>
            <ChevronLeft />
          </span>
          <div className="h2 m-0">Deposit Crypto</div>
          {depositableCurrencies.includes(state?.code) && (
            <button className="try-wallet-btn" onClick={() => setShowModal(true)}>
              Try wallet deposit
            </button>
          )}
        </div>
        <StepsGuide />
        <div className="d-flex flex-md-row flex-column align-items-center justify-content-between p-sm-5 p-1 coin-wallet-info">
          <div className="col-md-8 col-12 d-flex flex-column coin-network-info">
            <div className="mb-4">
              <div className="coin-title">Select Coin</div>
              <div className="coin-list-dropdown dropdown my-2">
                <button
                  type="button"
                  className="btn coin-dropdown-btn dropdown-toggle px-4"
                  data-bs-toggle="dropdown"
                >
                  <div className="d-flex">
                    <div className="ms-2 d-flex">
                      <div className="fw-bold">{coin}</div>
                      <div className="ms-2">{coin}</div>
                    </div>
                  </div>
                  <ChevronDown />
                </button>
                <Dropdown classNames="w-100 drop-down">
                  {currencies
                    .filter((c) => c.kind === 'CRYPTO' && c?.supported_blockchains?.length)
                    .map((coin, index) => (
                      <Link
                        style={{ color: '#172A4F' }}
                        key={index}
                        to={`/deposit/${coin?.code}`}
                        state={{ code: coin?.code }}
                        onClick={() => {
                          setIsReadyForAddress(false);
                          setBlockchain(null);
                          setWallet('');
                        }}
                      >
                        <li>
                          <button className="dropdown-item py-2">
                            <div className="d-flex">
                              <div className="ms-2 d-flex">
                                <div className="fw-bold" style={{ color: '#172A4F' }}>
                                  {coin?.code}
                                </div>
                                <div className="ms-2" style={{ color: '#172A4F' }}>
                                  {coin?.name}
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      </Link>
                    ))}
                </Dropdown>
              </div>
            </div>
            {blockchains.length ? (
              <div>
                <div className="coin-title">Deposit to Network</div>
                <div className="coin-list-dropdown dropdown my-2">
                  <button
                    type="button"
                    className="btn coin-dropdown-btn dropdown-toggle px-4"
                    data-bs-toggle="dropdown"
                  >
                    <div className="d-flex">
                      <div>
                        {blockchain ? blockchain.blockchain.name : 'Select Deposit Network'}
                      </div>
                    </div>
                    <ChevronDown />
                  </button>
                  {blockchains.length ? (
                    <Dropdown classNames="w-100">
                      {blockchains.map(
                        (
                          i: {
                            blockchain: { name: string; symbol: string };
                            deposit_options: { is_allowed: boolean; is_suspended: boolean };
                          },
                          index,
                        ) => (
                          <li key={index}>
                            <button
                              className="dropdown-item"
                              style={{ padding: '0.75rem 16px' }}
                              onClick={() => {
                                setIsReadyForAddress(false);
                                setBlockchain(i);
                              }}
                            >
                              <div className="ms-2 d-flex" style={{ flexDirection: 'column' }}>
                                <Container display="flex" justifyContent="space-between">
                                  <div className="fw-bold" style={{ color: '#172A4F' }}>
                                    <span style={{ color: '#172A4F' }}>{i.blockchain.name}</span>{' '}
                                    {i.deposit_options.is_suspended && (
                                      <span
                                        style={{
                                          color: '#fff',
                                          background: '#f59f9f',
                                          padding: '2px 0.5rem',
                                          borderRadius: 20,
                                          fontSize: '0.75rem',
                                          marginLeft: '0.6rem',
                                          display: 'inline-block',
                                        }}
                                      >
                                        suspended
                                      </span>
                                    )}
                                  </div>
                                  <div className="ms-2" style={{ color: '#172A4F' }}>
                                    <span style={{ color: 'gray', fontSize: 14 }}>
                                      Expected Arrival:
                                    </span>{' '}
                                    <span style={{ fontSize: 14, color: '#172A4F' }}>1m 28sec</span>
                                  </div>
                                </Container>
                                <Container display="flex" justifyContent="space-between">
                                  <Container color="gray !important" fontSize="0.8rem">
                                    {i.blockchain.symbol}
                                  </Container>
                                  <Container color="#172A4F">
                                    <span style={{ color: 'gray', fontSize: 14 }}>
                                      Deposit Crediting:
                                    </span>{' '}
                                    <span style={{ fontSize: 14, color: '#172A4F' }}>
                                      12 confirmations
                                    </span>
                                  </Container>
                                </Container>
                              </div>
                            </button>
                          </li>
                        ),
                      )}
                    </Dropdown>
                  ) : null}
                </div>
              </div>
            ) : (
              <RedAreaNote title={`No blockchains are currently available for ${coin}`} />
            )}
          </div>
          <div className="col-md-4 col-12 d-flex flex-column wallet-address-info mt-sm-0 mt-3">
            <GenerateAddressBtn
              onClick={() => setIsReadyForAddress(true)}
              blockchain={blockchain}
              isReadyForAddress={isReadyForAddress}
            >
              <AddressWrap loading={loading} wallet={wallet} />
            </GenerateAddressBtn>
          </div>
        </div>
        <Footer />
        <CopyAlert address={wallet.address} />
        <DepositModal
          show={showModal}
          onClose={() => setShowModal(false)}
          address={address}
          coin={state?.code}
        />
      </div>
    </Container>
  );
};

export default Deposit;

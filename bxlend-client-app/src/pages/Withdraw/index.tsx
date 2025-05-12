import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';

import { RootState } from 'src/store/store';
import { useDispatch } from 'src/store/useDispatch';
import { fetchCurrencies } from 'src/store/slice/currencies';
import { setAppAlert } from 'src/store/slice/appAlert';

import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/Input';
import Balance from './components/Balance';
import WithdrawOtpPopUp from './components/WithdrawOtpPopUp';
import Dropdown from 'src/components/Dropdown';
import RedAreaNote from 'src/components/RedAreaNote';
import Footer from './components/Footer';

import request from 'src/request';
import { PUBLIC_URL } from 'src/configs';
import { ROUTE_WALLET } from 'src/routes';

import './index.css';

// const currenciesToShow = ['BTC', 'ETH', 'USDT'];

const Withdraw = () => {
  const [blockchains, setBlockchains] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [networksLoading, setNetworksLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState('');
  const [decimals, setDecimals] = useState(8);
  const [availableBalance, setAvailableBalance] = useState('');
  const [name, setName] = useState('');
  const [fee, setFee] = useState('');
  const [blockchain, setBlockchain] = useState<any>(null);

  const { coin } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currencies } = useSelector((state: RootState) => state.currencies);

  const isData = !!(coin && address && quantity);

  const gasLimit = 29000;
  const withdrawalOverhead = 1.02;

  useEffect(() => {
    const fetchWalletAddress = (id: string) => {
      if (!id) {
        return null;
      }

      try {
        request
          .get(`${PUBLIC_URL}/v1/wallet_addresses/${id}`)
          .then(({ data }) => {
            setAvailableBalance(data.wallet.available_balance);
            setName(data.wallet.currency);
          })
          .catch(({ response }) => {
            navigate(ROUTE_WALLET);
            dispatch(
              setAppAlert({
                message: response?.data?.error || 'Something went wrong.',
                isSuccess: false,
              }),
            );
          });
      } catch (e) {
        console.log(e);
      }
    };

    if (!currencies.length) {
      dispatch(fetchCurrencies());
    }

    const activeCurrency = currencies.find((curr) => curr.code === coin);
    if (activeCurrency?.id) {
      fetchWalletAddress(activeCurrency?.id);
    }
  }, [coin, currencies, dispatch, navigate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchNetworks = () => {
    setNetworksLoading(true);
    return request
      .get(`${PUBLIC_URL}/v1/currencies/code/${coin}`)
      .then(({ data }) => {
        setDecimals(data.currency_code.decimals);
        setBlockchains(
          data.currency_code.supported_blockchains.filter(
            (i: {
              blockchain: { name: string; symbol: string };
              withdrawal_options: { is_allowed: boolean; is_suspended: boolean };
            }) => i.withdrawal_options.is_allowed,
          ),
        );

        // setBlockchain(
        //   data.currency_code.supported_blockchains.filter(
        //     (i: {
        //       blockchain: { name: string; symbol: string };
        //       withdrawal_options: { is_allowed: boolean; is_suspended: boolean };
        //     }) => i.withdrawal_options.is_allowed,
        //   )[0],
        // );
        return data.currency_code.networks[0];
      })
      .catch(({ response }) => {
        dispatch(
          setAppAlert({
            message: response?.data?.error || 'Something went wrong.',
            isSuccess: false,
          }),
        );
      })
      .finally(() => setNetworksLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFees = (network: string) => {
    setLoading(true);
    try {
      request
        .get(
          `${PUBLIC_URL}/v1/transactions/withdraw/fee/recommendation?blockchain=${coin}&network=${network}`,
        )
        .then(({ data }) => {
          let feeInBaseUnit = parseFloat(data.fee.standard_fee);
          if (data.fee.unit === 'WEI') {
            feeInBaseUnit = feeInBaseUnit / 1e18;
            feeInBaseUnit = feeInBaseUnit * gasLimit;
          }
          feeInBaseUnit = feeInBaseUnit * withdrawalOverhead;
          setFee(feeInBaseUnit.toFixed(decimals));
        })
        .catch(({ response }) => {
          dispatch(
            setAppAlert({
              message: response?.data?.error || 'Something went wrong.',
              isSuccess: false,
            }),
          );
        })
        .finally(() => setLoading(false));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchNetworks().then((network) => fetchFees(network));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin]);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <Container>
      <div className="px-lg-5 px-sm-3 position-relative">
        <div className="d-flex align-items-center mb-4">
          <span className="btn" onClick={() => navigate(-1)}>
            <ChevronLeft />
          </span>
          <div className="h2 m-0">Withdraw Crypto</div>
        </div>
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
                        key={index}
                        to={`/withdraw/${coin.code}`}
                        state={{ code: coin }}
                        style={{ color: '#172A4F' }}
                        onClick={() => {
                          setBlockchain(null);
                        }}
                      >
                        <li>
                          <button className="dropdown-item py-2">
                            <div className="d-flex">
                              <div className="ms-2 d-flex">
                                <div className="fw-bold" style={{ color: '#172A4F' }}>
                                  {coin.code}
                                </div>
                                <div className="ms-2" style={{ color: '#172A4F' }}>
                                  {coin.name}
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
            <div>
              <div className="coin-title">Send to Network</div>
              {networksLoading ? (
                <div style={{ paddingTop: 20 }}>
                  <Loader size={30} />
                </div>
              ) : (
                <div className="coin-list-dropdown dropdown my-2">
                  <button
                    type="button"
                    className="btn coin-dropdown-btn dropdown-toggle px-4"
                    data-bs-toggle="dropdown"
                  >
                    <div className="d-flex">
                      {blockchain ? blockchain.blockchain.name : 'Select Deposit Network'}
                    </div>
                    <ChevronDown />
                  </button>
                  {blockchains.length ? (
                    <Dropdown classNames="w-100">
                      {blockchains.map(
                        (
                          i: {
                            blockchain: { name: string; symbol: string };
                            withdrawal_options: { is_allowed: boolean; is_suspended: boolean };
                          },
                          index,
                        ) => (
                          <li key={index}>
                            <button
                              className="dropdown-item"
                              style={{ padding: '0.75rem 1rem' }}
                              onClick={() => setBlockchain(i)}
                            >
                              <div className="ms-2 d-flex" style={{ flexDirection: 'column' }}>
                                <Container display="flex" justifyContent="space-between">
                                  <div className="fw-bold" style={{ color: '#172A4F' }}>
                                    <span style={{ color: '#172A4F' }}>{i.blockchain.name}</span>{' '}
                                    {i.withdrawal_options.is_suspended && (
                                      <Container
                                        color="#fff"
                                        background="#f59f9f"
                                        padding="2px 0.5rem"
                                        borderRadius={20}
                                        fontSize="0.75rem"
                                        marginLeft={10}
                                        display="inline-block"
                                      >
                                        suspended
                                      </Container>
                                    )}
                                  </div>
                                  <Container
                                    className="ms-2"
                                    color="#172A4F"
                                    display="flex"
                                    gap="0.3rem"
                                  >
                                    <Container color="gray !important" fontSize="0.8rem">
                                      Expected Arrival:
                                    </Container>{' '}
                                    <Container fontSize="0.8rem" color="#172A4F !important">
                                      1m 28sec
                                    </Container>
                                  </Container>
                                </Container>
                                <Container display="flex" justifyContent="space-between">
                                  <Container color="gray !important" fontSize="0.8rem">
                                    {i.blockchain.symbol}
                                  </Container>
                                  <Container color="#172A4F !important" display="flex" gap="0.3rem">
                                    <Container color="gray !important" fontSize="0.8rem">
                                      Deposit Crediting:
                                    </Container>{' '}
                                    <Container fontSize="0.8rem" color="#172A4F !important">
                                      12 confirmations
                                    </Container>
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
              )}
            </div>
          </div>
          {loading ? (
            <Loader size={30} />
          ) : (
            <div className="col-md-4 col-12 d-flex flex-column wallet-address-info mt-sm-0 mt-5">
              {name && (
                <div>
                  {blockchain?.withdrawal_options?.is_suspended ? (
                    <RedAreaNote
                      title={`Withdrawal is currently suspended for ${blockchain?.blockchain?.symbol}`}
                    />
                  ) : (
                    <>
                      <Input
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.currentTarget.value)}
                      />
                      <Input
                        label="Amount"
                        value={quantity}
                        onChange={(e) => setQuantity(e.currentTarget.value)}
                      />
                      <div
                        className="d-flex justify-content-between align-items-center mt-4"
                        style={{ marginBottom: '2rem' }}
                      >
                        <Balance balance={availableBalance} name={name} />
                        <Balance
                          balance={Number(fee).toFixed(decimals)}
                          name="Fee"
                          subname={name}
                        />
                      </div>
                      <Button
                        text="Withdraw"
                        isLoading={loading}
                        disabled={loading || !isData}
                        $fullWidth
                        onClick={() => setIsOpen(true)}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
      {isOpen && (
        <WithdrawOtpPopUp
          closeModal={() => setIsOpen(false)}
          onClose={() => {
            setIsOpen(false);
            setAddress('');
            setQuantity('');
          }}
          currency={currencies.find((c) => c.code === coin)}
          address={address}
          quantity={quantity}
          fee={`${fee} ${coin}`}
          blockchain={blockchain}
        />
      )}
    </Container>
  );
};

export default Withdraw;

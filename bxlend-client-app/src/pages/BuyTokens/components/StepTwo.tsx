import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'react-bootstrap-icons';

import { Container } from 'src/components/Container';
import { Button } from 'src/components/Button';
import { Loader } from 'src/components/Loader';
import { Glass } from 'src/components/Glass';
import Dropdown from 'src/components/Dropdown';
import PaymentDetailsModal from './PaymentDetailsModal';

import { ROUTE_PRESALE_ORDERS } from 'src/routes';
import { calculateAmountPlusDiscount, formatNumberWithSpaces } from 'src/constants';
import { setAppAlert } from 'src/store/slice/appAlert';
import { useDispatch } from 'src/store/useDispatch';
import request from 'src/request';
import PUBLIC_URL from 'src/configs/PUBLIC_URL';
import { FadeInSection } from 'src/components/FadeInSection';

const StepTwo = ({ presaleInfo, tickers, termsAccepted, amountUsd }) => {
  const [usdInCrypto, setUsdInCrypto] = useState(0);
  const [blockchain, setBlockchain] = useState(null);
  const [blockchains, setBlockchains] = useState([]);
  const [coins, setCoins] = useState([]);
  const [coin, setCoin] = useState('');
  const [trx, setTrx] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const basePrice = Number(presaleInfo.base_price.$numberDecimal);
  const currentStage = presaleInfo.current_stage;
  const currentStagePriceIncrement =
    presaleInfo.base_price_for_each_stage[currentStage].price_increment;
  const currentStagePrice = (currentStagePriceIncrement * basePrice + basePrice).toFixed(2);
  const amountBxt = amountUsd / +currentStagePrice;
  const purchaseBonus = calculateAmountPlusDiscount(amountBxt, presaleInfo.discounts) - amountBxt;

  const ticker =
    coin === 'USDC'
      ? tickers.find((t) => t.pair === 'USDT/USD')
      : tickers.find((t) => t.pair.split('/')[0] === coin);

  const dispatch = useDispatch();

  const createTransaction = () => {
    setLoading(true);

    request
      .post(`${PUBLIC_URL}/presale/client/presale-transaction`, {
        amount_in_usd: amountUsd,
        discount_amount: purchaseBonus,
        bxt_base_price: currentStagePrice,
        presale_stage: String(currentStage),
        blockchain,
        payment_coin: coin,
        tokens_allocation: {
          total: amountBxt + purchaseBonus,
          base: amountBxt,
          discounted: purchaseBonus,
        },
        coin_price: ticker?.last,
        converted_price: String(usdInCrypto.toFixed(4)),
      })
      .then((data) => {
        setTrx(data.data);
      })
      .catch((error) => {
        dispatch(
          setAppAlert({
            message: error?.response?.data?.message || 'Something went wrong.',
            isSuccess: false,
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setUsdInCrypto(amountUsd / ticker?.last);
  }, [coin, tickers, amountUsd, ticker?.last]);

  useEffect(() => {
    const blockchains = presaleInfo.supported_payment_options.map((option) => option.blockchain);
    setBlockchains(blockchains);
  }, [presaleInfo]);

  useEffect(() => {
    setBlockchain(blockchains[0]);
  }, [blockchains]);

  useEffect(() => {
    if (blockchain) {
      const option = presaleInfo.supported_payment_options?.find(
        (option) => option.blockchain === blockchain,
      );

      setCoins(option.supported_coins);
    }
  }, [blockchain, presaleInfo.supported_payment_options]);

  useEffect(() => {
    if (coins) {
      setCoin(coins[0]);
    }
  }, [coins]);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <Glass>
        <Container textAlign="center" fontSize="1.75rem" paddingBottom="1.25rem">
          Step 2
        </Container>
        <Glass padding="0.75rem 2rem" width="fit-content" margin="0 auto 2rem">
          <Container textAlign="center">Please select payment method</Container>
        </Glass>
        <Container display="flex" gap="1.25rem" flexWrap="wrap" alignItems="center">
          <Container flexGrow={1.5}>
            <Container marginBottom="0.5rem">You send</Container>
            <Container
              borderRadius="0.5rem"
              padding="1rem"
              background="#00feb920"
              border="1px solid #00feb950"
              marginBottom="0.5rem"
            >
              {String(usdInCrypto.toFixed(4))}
            </Container>
          </Container>
          <Container flexGrow={2}>
            <Container>
              <div className="coin-title">Select Coin</div>
              <div className="coin-list-dropdown dropdown my-2">
                <button
                  type="button"
                  className="btn coin-dropdown-btn dropdown-toggle px-4"
                  data-bs-toggle="dropdown"
                >
                  <div className="d-flex">{coin || 'Select Coin'}</div>
                  <ChevronDown />
                </button>
                <Dropdown classNames="w-100 drop-down">
                  {coins.map((coin) => (
                    <li key={coin} onClick={() => setCoin(coin)}>
                      <button className="dropdown-item py-2">
                        <div className="d-flex">
                          <div className="ms-2 d-flex">
                            <div className="fw-bold" style={{ color: '#172A4F' }}>
                              {coin}
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </Dropdown>
              </div>
            </Container>
          </Container>
          <Container flexGrow={2}>
            <div>
              <div className="coin-title">Select Network</div>
              <div className="coin-list-dropdown dropdown my-2">
                <button
                  type="button"
                  className="btn coin-dropdown-btn dropdown-toggle px-4"
                  data-bs-toggle="dropdown"
                >
                  <div className="d-flex">{blockchain || 'Select Network'}</div>
                  <ChevronDown />
                </button>
                {blockchains.length ? (
                  <Dropdown classNames="w-100">
                    {blockchains.map((i) => (
                      <li key={i}>
                        <button
                          className="dropdown-item"
                          style={{ padding: '0.75rem 1rem' }}
                          onClick={() => {
                            setBlockchain(i);
                            setCoin('');
                          }}
                        >
                          <div className="ms-2 d-flex" style={{ flexDirection: 'column' }}>
                            <Container display="flex" justifyContent="space-between">
                              <div className="fw-bold" style={{ color: '#172A4F' }}>
                                <span style={{ color: '#172A4F' }}>{i}</span>{' '}
                              </div>
                            </Container>
                          </div>
                        </button>
                      </li>
                    ))}
                  </Dropdown>
                ) : null}
              </div>
            </div>
          </Container>
        </Container>
        {/* <Container color="green" textAlign="right" marginBottom="1.5rem" cursor="pointer">
          <Button text="Apply Promo code" />
        </Container> */}
        <Container
          width="fit-content"
          alignSelf="center"
          padding="1rem"
          margin="2rem auto"
          background="rgba(0, 255, 185, 0.1)"
          border="1px solid #00feb950"
          borderRadius="10px"
        >
          <Container textAlign="center">You Get</Container>
          <Container padding="0.5rem 0" textAlign="center">
            {formatNumberWithSpaces(Number(amountBxt + purchaseBonus).toFixed(2))} $BXT ≈{' '}
            {String(formatNumberWithSpaces(usdInCrypto.toFixed(4)))} {coin}
          </Container>
        </Container>
        <FadeInSection>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Token Ordered</Container>
              <Container>{formatNumberWithSpaces(amountUsd / +currentStagePrice)} BXT</Container>
            </Container>
          </Glass>
        </FadeInSection>
        <FadeInSection>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Purchase Bonus</Container>
              <Container>{formatNumberWithSpaces(purchaseBonus)} BXT</Container>
            </Container>
          </Glass>
        </FadeInSection>
        <FadeInSection>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Amount Bonus</Container>
              <Container>0 BXT</Container>
            </Container>
          </Glass>
        </FadeInSection>
        <FadeInSection>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Promo Bonus</Container>
              <Container>0 BXT</Container>
            </Container>
          </Glass>
        </FadeInSection>
      </Glass>
      <Container display="flex" justifyContent="center" gap="2rem" flexWrap="wrap" marginTop="2rem">
        <Button text="Pay with Crypto" disabled={!termsAccepted} onClick={createTransaction} />
        <Button
          text="Transaction History"
          type="outlined"
          onClick={() => navigate(ROUTE_PRESALE_ORDERS)}
        />
      </Container>
      {trx && (
        <PaymentDetailsModal
          trx={trx}
          onClose={() => setTrx(null)}
          amount={String(formatNumberWithSpaces(usdInCrypto.toFixed(4)))}
          coin={coin}
          blockchain={blockchain}
        />
      )}
    </>
  );
};

export default StepTwo;

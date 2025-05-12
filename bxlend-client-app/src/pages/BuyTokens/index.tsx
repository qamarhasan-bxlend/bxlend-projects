import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ROUTE_TERMS_OF_USE } from 'src/routes';
import { fetchTickers } from 'src/store/slice/tickers';
import { fetchPresale } from 'src/store/slice/presale';
import { useDispatch } from 'src/store/useDispatch';

import { Container } from 'src/components/Container';
import { Glass } from 'src/components/Glass';
import { Loader } from 'src/components/Loader';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import Checkbox from '../AccountCreated/VerificationPopUp/Checkbox';

const BuyTokens = () => {
  const [checked, setChecked] = useState(false);
  const [amountUsd, setAmountUsd] = useState('');

  const { presale, loading } = useSelector(({ presale }) => presale);
  const { tickers, loading: tickersLoading } = useSelector(({ tickers }) => tickers);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!tickers.length) {
      dispatch(fetchTickers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!presale) {
      dispatch(fetchPresale());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || tickersLoading) {
    return <Loader overlay />;
  }

  return (
    <>
      <Glass>
        <Container padding="1.5rem">
          {presale && (
            <StepOne presaleInfo={presale} amountUsd={amountUsd} setAmountUsd={setAmountUsd} />
          )}
          <Container marginBottom="1.25rem" />
          {presale && tickers.length && (
            <StepTwo
              presaleInfo={presale}
              tickers={tickers}
              termsAccepted={checked && +amountUsd > 0}
              amountUsd={amountUsd}
            />
          )}
          <Container
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="1rem"
            margin="1.25rem 0"
          >
            <Checkbox isChecked={checked} setIsChecked={setChecked}>
              <Container>
                <span>I hereby agree to the </span>
                <Container
                  display="inline"
                  textDecoration="underline"
                  cursor="pointer"
                  onClick={() => navigate(ROUTE_TERMS_OF_USE)}
                >
                  payment agreement and token sale terms *
                </Container>
              </Container>
            </Checkbox>
          </Container>
        </Container>
      </Glass>
    </>
  );
};

export default BuyTokens;

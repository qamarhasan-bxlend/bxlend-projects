import React, { useEffect } from 'react';

import { useDispatch } from 'src/store/useDispatch';
import { useSelector } from 'react-redux';
import { fetchPresaleToken } from 'src/store/slice/presaleToken';

import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';
import { Glass } from 'src/components/Glass';
import PageHeader from 'src/components/PageHeader';

const PresaleTransactions = () => {
  const dispatch = useDispatch();
  const { presaleToken, loading } = useSelector(({ presaleToken }) => presaleToken);

  useEffect(() => {
    dispatch(fetchPresaleToken());
  }, []);

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader title="Presale BXT" hideSearch />
      <Container padding="1.25rem">
        <section>
          <Container fontWeight={600} fontSize="1.25rem" padding="0 0 0.75rem">
            Minimum Deposit
          </Container>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Amount</Container>
              <Container>
                <strong>{presaleToken.minimum_deposit?.amount}</strong>
              </Container>
            </Container>
          </Glass>
          <Glass padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Currency</Container>
              <Container>
                <strong> {presaleToken.minimum_deposit?.currency}</strong>
              </Container>
            </Container>
          </Glass>
        </section>
        <section>
          <Container fontWeight={600} fontSize="1.25rem" padding="2rem 0 0.75rem">
            General Info
          </Container>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Total Tokens</Container>
              <Container>
                <strong>{presaleToken.total_tokens}</strong>
              </Container>
            </Container>
          </Glass>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Purchased Tokens</Container>
              <Container>
                <strong>{presaleToken.purchased_tokens}</strong>
              </Container>
            </Container>
          </Glass>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Queued Tokens</Container>
              <Container>
                <strong>{presaleToken.queued_tokens}</strong>
              </Container>
            </Container>
          </Glass>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Base Price</Container>
              <Container>
                <strong>{presaleToken.base_price?.$numberDecimal}</strong>
              </Container>
            </Container>
          </Glass>
          <Glass margin="0 0 1rem" padding="1rem">
            <Container display="flex" justifyContent="space-between">
              <Container>Current Stage</Container>
              <Container>
                <strong>{presaleToken.current_stage}</strong>
              </Container>
            </Container>
          </Glass>
        </section>
        <section>
          <Container fontWeight={600} fontSize="1.25rem" padding="2rem 0 0.75rem">
            Supported Payment Options
          </Container>
          {presaleToken.supported_payment_options?.map(
            (option: { blockchain: string; _id: string; deposit_address: string; supported_coins: string[] }) => (
              <Glass key={option._id} margin="0 0 1rem" padding="1.5rem 0.5rem 1.5rem 1.5rem">
                <Glass margin="0 0 1rem" padding="1rem">
                  <Container display="flex" justifyContent="space-between">
                    <Container>Blockchain</Container>
                    <Container>
                      <strong>{option.blockchain}</strong>
                    </Container>
                  </Container>
                </Glass>
                <Glass margin="0 0 1rem" padding="1rem">
                  <Container display="flex" justifyContent="space-between">
                    <Container>Deposit Address</Container>
                    <Container>
                      <strong>{option.deposit_address}</strong>
                    </Container>
                  </Container>
                </Glass>
                <Glass padding="1rem">
                  <Container display="flex" justifyContent="space-between">
                    <Container>Supported Coins</Container>
                    <Container>
                      <strong>{option.supported_coins.join(', ')}</strong>
                    </Container>
                  </Container>
                </Glass>
              </Glass>
            )
          )}
        </section>
        <section>
          <Container fontWeight={600} fontSize="1.25rem" padding="2rem 0 0.75rem">
            Base Price for Each Stage
          </Container>
          {presaleToken.base_price_for_each_stage?.map(
            (stage: { stage: number; _id: string; triggering_amount: number; price_increment: number }) => (
              <Glass key={stage._id} margin="0 0 1rem" padding="1.5rem 0.5rem 1.5rem 1.5rem">
                <Glass margin="0 0 1rem" padding="1rem">
                  <Container display="flex" justifyContent="space-between">
                    <Container>Stage</Container>
                    <Container>
                      <strong>{stage.stage}</strong>
                    </Container>
                  </Container>
                </Glass>
                <Glass margin="0 0 1rem" padding="1rem">
                  <Container display="flex" justifyContent="space-between">
                    <Container>Triggering Amount</Container>
                    <Container>
                      <strong>{stage.triggering_amount}</strong>
                    </Container>
                  </Container>
                </Glass>
                <Glass padding="1rem">
                  <Container display="flex" justifyContent="space-between">
                    <Container>Price Increment</Container>
                    <Container>
                      <strong>{stage.price_increment}</strong>
                    </Container>
                  </Container>
                </Glass>
              </Glass>
            )
          )}
        </section>
        <section>
          <Container fontWeight={600} fontSize="1.25rem" padding="2rem 0 0.75rem">
            Discounts
          </Container>
          {presaleToken.discounts?.map((discount: { _id: string; minimum_buy: string; discount: number }) => (
            <Glass key={discount._id} margin="0 0 1rem" padding="1.5rem 0.5rem 1.5rem 1.5rem">
              <Glass margin="0 0 1rem" padding="1rem">
                <Container display="flex" justifyContent="space-between">
                  <Container>Minimum Buy</Container>
                  <Container>
                    <strong>{discount.minimum_buy}</strong>
                  </Container>
                </Container>
              </Glass>
              <Glass padding="1rem">
                <Container display="flex" justifyContent="space-between">
                  <Container>Discount</Container>
                  <Container>
                    <strong>{discount.discount * 100}%</strong>
                  </Container>
                </Container>
              </Glass>
            </Glass>
          ))}
        </section>
      </Container>
    </>
  );
};

export default PresaleTransactions;

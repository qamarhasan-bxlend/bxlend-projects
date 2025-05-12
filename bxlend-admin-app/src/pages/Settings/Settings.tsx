import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { fetchSettings } from 'src/store/slice/settings';

import { Input } from 'src/components/Input';
import { Loader } from 'src/components/Loader';
import { Button } from 'src/components/Button';
import PageHeader from 'src/components/PageHeader';
import Notification from 'src/components/Notification';

import request from 'src/request';
import { AUTH_URL } from 'src/configs';

import { Container } from 'src/components/Container';

const Deposit = () => {
  const [loading, setLoading] = useState(false);
  const [{ message, isError }, setNotification] = useState({ message: '', isError: false });
  const [spread, setSpread] = useState(0);
  const [makerFee, setMakerFee] = useState(0);
  const [takerFee, setTakerFee] = useState(0);

  const dispatch = useDispatch();
  const { settings, loading: fetchSettingsLoading } = useSelector(({ settings }) => settings);

  const updateSettings = (value: number, name: string) => {
    setLoading(true);
    request
      .put(`${AUTH_URL}/v1/admin/settings`, { value, name })
      .then((data) => setNotification({ message: data.data.msg, isError: false }))
      .catch((e) => setNotification({ message: e.response.data.error || 'Error occured', isError: true }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (settings.length) {
      setSpread(settings.find((s: { name: string }) => s.name === 'SPREAD').value);
      setMakerFee(settings.find((s: { name: string }) => s.name === 'MAKER_FEE').value);
      setTakerFee(settings.find((s: { name: string }) => s.name === 'TAKER_FEE').value);
    }
  }, [settings]);

  useEffect(() => {
    if (!settings.length) {
      dispatch(fetchSettings());
    }
  }, []);

  if (loading || fetchSettingsLoading) {
    return <Loader overlay />;
  }

  return (
    <>
      <PageHeader title="Settings" hideSearch />
      {!!settings.length && (
        <Container
          padding="1rem 2rem"
          background="#fff"
          borderRadius="1rem"
          marginTop="1rem"
          display="flex"
          justifyContent="space-between"
        >
          <div>
            <Input
              label="Spread"
              placeholder="Spread"
              value={spread.toString()}
              onChange={(value: number) => !isNaN(value) && value > -0.0001 && value < 0.51 && setSpread(value)}
            />
            <Button text="Submit" onClick={() => updateSettings(spread, 'SPREAD')} $fullWidth />
          </div>
          <div>
            <Input
              type="input"
              label="Maker fee"
              placeholder="Maker fee"
              value={makerFee.toString()}
              onChange={(value: number) => !isNaN(value) && value > -0.0001 && value < 0.51 && setMakerFee(value)}
            />
            <Button text="Submit" onClick={() => updateSettings(makerFee, 'MAKER_FEE')} $fullWidth />
          </div>
          <div>
            <Input
              label="Taker fee"
              placeholder="Taker fee"
              value={takerFee.toString()}
              onChange={(value: number) => !isNaN(value) && value > -0.0001 && value < 0.51 && setTakerFee(value)}
            />
            <Button text="Submit" onClick={() => updateSettings(takerFee, 'TAKER_FEE')} $fullWidth />
          </div>
        </Container>
      )}
      {message && <Notification message={message} isSuccess={!isError} />}
    </>
  );
};

export default Deposit;

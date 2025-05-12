import React, { useState } from 'react';
import { Button } from 'src/components/Button';

import { Container } from 'src/components/Container';
import { Input } from 'src/components/Input';
import { Select } from 'src/components/Select';

import { useDispatch } from 'src/store/useDispatch';
import { AUTH_URL } from 'src/configs';
import { setAppAlert } from 'src/store/slice/appAlert';
import { fetchKyc } from 'src/store/slice/kyc';
import request from 'src/request';
import { Loader } from 'src/components/Loader';

const KycStatusHandler: React.FC<{ item: any }> = ({ item }) => {
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const sendKyc = () => {
    setLoading(true);
    request
      .patch(`${AUTH_URL}/v1/admin/kyc/${item._id}`, {
        status,
        response_message: feedback,
      })
      .then(() => {
        dispatch(
          fetchKyc({
            page: 1,
          })
        );
        dispatch(setAppAlert({ message: 'Status has been updated successfully', isSuccess: true }));
      })
      .catch((e) =>
        dispatch(setAppAlert({ message: e.response.data.error ?? 'Something went wrong', isSuccess: false }))
      )
      .finally(() => {
        setLoading(false);
        setStatus('');
        setFeedback('');
      });
  };

  if (loading) {
    return <Loader overlay />;
  }

  return (
    <Container marginTop="3rem">
      <Select
        label="Status"
        options={[
          {
            value: 'VERIFIED',
            label: 'VERIFIED',
          },
          {
            value: 'CANCELED',
            label: 'CANCELED',
          },
        ]}
        value={status}
        onChange={(e) => setStatus(e.currentTarget.value)}
      />
      <Input label="Feedback" type="textarea" value={feedback} onChange={(e) => setFeedback(e.currentTarget.value)} />
      <Button
        text="Update Status"
        $fullWidth
        onClick={sendKyc}
        disabled={status !== 'VERIFIED' && status !== 'CANCELED'}
      />
    </Container>
  );
};

export default KycStatusHandler;

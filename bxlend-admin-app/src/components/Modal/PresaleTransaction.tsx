import React, { Dispatch, SetStateAction, useState } from 'react';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

const PresaleTransaction = ({
  data,
  setNotification,
  onClose,
}: {
  data: {
    id: string;
    status: string;
    amount_in_usd: string;
    blockchain: string;
    payment_coin: string;
    transaction_number: string;
    tokens: string;
    bxt_base_price: string;
    presale_stage: string;
    token_allocation: string;
  };
  setNotification: Dispatch<SetStateAction<{ message: string; isError: boolean }>>;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleTransaction = async (action: 'confirm' | 'reject') => {
    if (!data?.id) return;
    if (action === 'confirm' && data.status !== 'in_progress') return;
    if (action === 'reject' && !['pending', 'in_progress'].includes(data.status)) return;

    setLoading(true);
    try {
      await request.put(`${AUTH_URL}/presale/admin/presale-transaction/${action}`, { transaction_id: data.id });
      setNotification({ message: 'Status has been updated successfully.', isError: false });
    } catch (error) {
      console.log(error);
      setNotification({ message: 'Status update failed.', isError: true });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div>
      {data && (
        <div style={{ margin: '0 0 50px 0', background: '#eee', padding: '2%', borderRadius: '2rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>ID:</b> <span>{data.id}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Payment Coin:</b> <span>{data.payment_coin}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Blockchain:</b> <span>{data.blockchain}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Status:</b> <span>{data.status}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Amount:</b> <span>{data.amount_in_usd}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Transaction Number:</b> <span>{data.transaction_number}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Tokens:</b> <span>{data.token_allocation}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>BXT Base Price:</b> <span>{data.bxt_base_price}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Presale Stage:</b> <span>{data.presale_stage}</span>
            </li>
            <hr style={{ width: '100%' }} />
          </ul>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button onClick={() => handleTransaction('confirm')} disabled={loading || data.status !== 'in_progress'}>
              Confirm
            </button>
            <button
              onClick={() => handleTransaction('reject')}
              disabled={loading || !['pending', 'in_progress'].includes(data.status)}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresaleTransaction;

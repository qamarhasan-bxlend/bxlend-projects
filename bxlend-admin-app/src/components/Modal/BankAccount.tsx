import React from 'react';

import { convertDate } from '../Table/helpers';

import { StyledList, StyledWrap } from './styled';

const BankAccountContent = ({ data }: { data: any }) => {
  return (
    <StyledWrap>
      <StyledList style={{ padding: 0 }}>
        <>
          {data && data.bank_account && (
            <div style={{ margin: '0 0 50px 0', background: '#eee', padding: '2%', borderRadius: '2rem' }}>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Owner email:</b> <span>{data.bank_account.owner.email}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Bank name:</b> <span>{data.bank_account.bank_name}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Status:</b> <span>{data.bank_account.status}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Bank country:</b> <span>{data.bank_account.bank_country.name}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Account number:</b> <span>{data.bank_account.account_number}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Status:</b> <span>{data.bank_account.status}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Created at:</b>{' '}
                  <span>
                    {convertDate(data.bank_account.created_at).date} - {convertDate(data.bank_account.created_at).time}
                  </span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Updated at:</b>{' '}
                  <span>
                    {convertDate(data.bank_account.updated_at).date} - {convertDate(data.bank_account.updated_at).time}
                  </span>
                </li>
              </ul>
            </div>
          )}
        </>
      </StyledList>
    </StyledWrap>
  );
};

export default BankAccountContent;

import React from 'react';

import { convertDate } from '../Table/helpers';

import { StyledList, StyledWrap } from './styled';

const UserContent = ({ data }: { data: any }) => {
  return (
    <StyledWrap>
      <StyledList style={{ padding: 0 }}>
      <>
          {data && data.user && (
            <div style={{ margin: '0 0 50px 0', background: '#eee', padding: '2%', borderRadius: '2rem' }}>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>User ID:</b> <span>{data.user.id}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Email:</b> <span>{data.user.email}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Status:</b> <span>{data.user.status}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>First name:</b> <span>{data.user.name.first}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Last name:</b> <span>{data.user.name.last}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>KYC Status:</b> <span>{data.user.kyc_status}</span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Created at:</b>{' '}
                  <span>
                    {convertDate(data.user.created_at).date} - {convertDate(data.user.created_at).time}
                  </span>
                </li>
                <hr style={{ width: '100%' }} />
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <b>Updated at:</b>{' '}
                  <span>
                    {convertDate(data.user.updated_at).date} - {convertDate(data.user.updated_at).time}
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

export default UserContent;

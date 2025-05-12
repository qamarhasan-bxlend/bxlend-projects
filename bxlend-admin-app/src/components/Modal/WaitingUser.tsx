import React from 'react';

import { convertDate } from '../Table/helpers';

import { StyledImg } from './styled';

const WaitingUserContent = ({ data }: { data: any }) => {
  return (
    <div>
      <>
        {data && data.query && (
          <div style={{ margin: '0 0 50px 0', background: '#eee', padding: '2%', borderRadius: '2rem' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>First Name:</b> <span>{data.query.name.first}</span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Last Name:</b> <span>{data.query.name.last}</span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Email Status:</b> <span>{data.query.status}</span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Identification Type:</b> <span>{data.query.identification_type}</span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Email:</b> <span>{data.query.email}</span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Country Code:</b> <span>{data.query.country_code}</span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Terms and conditions consent:</b>{' '}
                <span>{data.query.terms_and_conditions_consent ? 'Agreed' : 'Disagreed'}</span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Privacy policy consent:</b> <span>{data.query.privacy_policy_consent ? 'Agreed' : 'Disagreed'}</span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Created at:</b>{' '}
                <span>
                  {convertDate(data.query.created_at).date} - {convertDate(data.query.created_at).time}
                </span>
              </li>
              <hr style={{ width: '100%' }} />
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>Updated at:</b>{' '}
                <span>
                  {convertDate(data.query.updated_at).date} - {convertDate(data.query.updated_at).time}
                </span>
              </li>
            </ul>
          </div>
        )}
      </>
      <div style={{ display: 'flex', gap: '3rem', marginBottom: '2rem' }}>
        {data?.query?.identification_url?.front && (
          <div>
            <div style={{ paddingBottom: '1.25rem' }}>Identity Card Back</div>
            <div>
              <StyledImg src={data.query.identification_url.front} />
            </div>
          </div>
        )}
        {data?.query?.identification_url?.back && (
          <div>
            <div style={{ paddingBottom: '1.25rem' }}>Identity Card Front</div>
            <div>
              <StyledImg src={data.query.identification_url.back} />
            </div>
          </div>
        )}
        {data?.query?.photo_url && (
          <div>
            <div style={{ paddingBottom: '1.25rem' }}>SELFIE</div>
            <div>
              <StyledImg src={data.query.photo_url} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingUserContent;

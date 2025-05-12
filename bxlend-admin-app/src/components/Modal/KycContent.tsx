import React from 'react';
import { StyledImg, StyledSelect, StyledTextarea } from './styled';
import { convertDate } from '../Table/helpers';

const KycContent = ({ data, setKycStatus, setFeedback }: { data: any; setKycStatus: any; setFeedback: any }) => {
  return (
    <>
      {data && data.kyc && (
        <div style={{ margin: '0 0 50px 0', background: '#eee', padding: '2%', borderRadius: '2rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>First Name:</b> <span>{data.kyc.name.first}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Last Name:</b> <span>{data.kyc.name.last}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Status:</b> <span>{data.kyc.status}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Identification Type:</b> <span>{data.kyc.identification_type}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>City:</b> <span>{data.kyc.address.city}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Pin code:</b> <span>{data.kyc.address.pin_code}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Full address::</b> <span>{data.kyc.address.full_address}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Country Code::</b> <span>{data.kyc.country_code}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Terms and conditions consent:</b>{' '}
              <span>{data.kyc.terms_and_conditions_consent ? 'Agreed' : 'Disagreed'}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Privacy policy consent:</b> <span>{data.kyc.privacy_policy_consent ? 'Agreed' : 'Disagreed'}</span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Created at:</b>{' '}
              <span>
                {convertDate(data.kyc.created_at).date} - {convertDate(data.kyc.created_at).time}
              </span>
            </li>
            <hr style={{ width: '100%' }} />
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <b>Updated at:</b>{' '}
              <span>
                {convertDate(data.kyc.updated_at).date} - {convertDate(data.kyc.updated_at).time}
              </span>
            </li>
          </ul>
        </div>
      )}
      <div style={{ display: 'flex', gap: '3rem', marginBottom: '2rem' }}>
        {data?.kyc?.identification_url?.front && (
          <div>
            <div style={{ paddingBottom: '1.25rem' }}>Identity Card Back</div>
            <div>
              <StyledImg src={data.kyc.identification_url.front} />
            </div>
          </div>
        )}
        {data?.kyc?.identification_url?.back && (
          <div>
            <div style={{ paddingBottom: '1.25rem' }}>Identity Card Front</div>
            <div>
              <StyledImg src={data.kyc.identification_url.back} />
            </div>
          </div>
        )}
        {data?.kyc?.photo_url && (
          <div>
            <div style={{ paddingBottom: '1.25rem' }}>SELFIE</div>
            <div>
              <StyledImg src={data.kyc.photo_url} />
            </div>
          </div>
        )}
      </div>
      {data?.kyc?.status === 'PENDING' && (
        <>
          <div style={{ marginBottom: '0.75rem' }}>KYC Status</div>
          <StyledSelect onChange={(e) => setKycStatus(e.currentTarget.value)}>
            <option disabled selected>
              Select KYC Status
            </option>
            <option>VERIFIED</option>
            <option>CANCELED</option>
          </StyledSelect>
          <div style={{ marginBottom: '0.75rem' }}>Feedback:</div>
          <StyledTextarea onChange={(e) => setFeedback(e.currentTarget.value)} />
        </>
      )}
    </>
  );
};

export default KycContent;

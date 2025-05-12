import React from 'react';
import { BiCopy } from 'react-icons/bi';
import QRcode from 'react-qr-code';

import { Loader } from 'src/components/Loader';

import { handleCopy } from 'src/constants';

interface IQr {
  address: string;
  size?: number;
  loading?: boolean;
}

const QR: React.FC<IQr> = ({ address, loading, size = 200 }) => {
  return (
    <div className="col-md-4 col-12 d-flex flex-column wallet-address-info mt-sm-0 mt-3">
      {address && !loading ? (
        <>
          <div className="coin-title mb-3">Address</div>
          <div className="d-flex justify-content-between">
            <div className="wallet-address">{address || ''}</div>
            <button className="btn p-0" onClick={() => handleCopy(address)}>
              <BiCopy />
            </button>
          </div>
          <div className="mt-3">
            <QRcode value={address || ''} size={size} />
          </div>
        </>
      ) : (
        <Loader size={100} />
      )}
    </div>
  );
};

export default QR;

import React from 'react';
import { BiCopy } from 'react-icons/bi';
import QRcode from 'react-qr-code';

import { Loader } from 'src/components/Loader';

import { handleCopy } from 'src/constants';

const AddressWrap = ({ wallet, loading }) => {
  return !loading ? (
    <>
      {wallet?.address ? (
        <>
          <div className="coin-title mb-3">Address</div>
          <div className="d-flex justify-content-between">
            <div className="wallet-address">{wallet.address || ''}</div>
            <button className="btn p-0" onClick={() => handleCopy(wallet?.address)}>
              <BiCopy />
            </button>
          </div>
          <div className="mt-3">
            <QRcode value={wallet.address || ''} size={200} />
          </div>
        </>
      ) : null}
    </>
  ) : (
    <Loader size={100} />
  );
};

export default AddressWrap;

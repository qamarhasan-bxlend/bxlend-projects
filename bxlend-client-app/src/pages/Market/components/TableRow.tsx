import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/esm/Image';

import FavBtn from './FavouriteButton';
import { Container } from 'src/components/Container';

const TableRow = ({
  hasLogo,
  volume,
  pair,
  pairOne,
  last,
  change24,
  pairTwo,
  handleFavourite,
  id,
  loadingId,
  user,
  isFullRowClickable,
}) => {
  const [innerWidth, setInnerWidth] = useState(0);

  const dir = change24 >= 0 ? 'increase' : 'decrease';
  const centered = 'justify-content-center align-items-center';

  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="table-content row mt-2">
      <div className="col-sm-3 col-md-3 col-3 col-lg-3 justify-content-start align-items-center d-flex ps-3">
        <Image src={hasLogo} width={24} height={24} style={{ opacity: hasLogo ? 1 : 0 }} />
        {innerWidth < 700 ? (
          <Container display="flex" flexDirection="column">
            <div className="ms-2">{pair && pairOne}</div>
            <div
              style={{ color: '#ccc', fontSize: '0.75rem' }}
              className="second ms-2"
            >{`${pair}`}</div>
          </Container>
        ) : (
          <>
            <div className="ms-2">{pair && pairOne}</div>
            <div
              style={{ color: '#ccc', fontSize: '0.75rem' }}
              className="second ms-2"
            >{`${pair}`}</div>
          </>
        )}
      </div>
      <div className={`col-sm-6 col-md-3 col-6 col-lg-1 ${centered} d-flex`}>${last}</div>
      <div
        className={`col-sm-4 col-4 col-md-4 col-1 col-lg-2 ${centered} d-none d-md-flex percent-${dir}`}
      >
        {change24}%
      </div>
      <div className={`col-sm-0 col-lg-2 ${centered} d-none d-lg-flex`}>
        {parseFloat(volume).toFixed(2)}
      </div>
      <div className={`col-sm-0 col-lg-2 ${centered} d-none d-lg-flex`}>
        {`$ ${(parseFloat(last) * parseFloat(volume)).toFixed(2)}`}
      </div>
      <div
        style={{ display: 'flex' }}
        className={`col-2 col-sm-3 col-md-2 col-lg-2 ${centered} d-lg-flex`}
      >
        {pair && !isFullRowClickable && (
          <Link
            className="market-action-button mx-1"
            to={`/trade?pair=${pairOne.toLowerCase()}-${pairTwo.toLowerCase()}`}
            state={[pairOne, pairTwo]}
          >
            Trade
          </Link>
        )}
        <FavBtn cb={handleFavourite} id={id} loadingId={loadingId} user={user} />
      </div>
    </div>
  );
};

export default TableRow;

import React from 'react';
import { Star, StarFill } from 'react-bootstrap-icons';

import { Loader } from 'src/components/Loader';

import { getSign } from 'src/constants';

const FavouriteButton = ({ loadingId, id, user, cb }) => {
  const token = localStorage?.getItem('access');
  const sign = getSign();

  return (
    <button
      className="market-action-button-fav"
      onClick={(e) => {
        if (token) {
          cb(e, id);
        } else {
          window.open(`${sign}&action=signup`, '_self');
        }
      }}
    >
      {loadingId === id ? (
        <Loader size={16} overlay />
      ) : user?.favorite_currencyPairs?.includes(id) ? (
        <StarFill color="gold" />
      ) : (
        <Star />
      )}
    </button>
  );
};

export default FavouriteButton;

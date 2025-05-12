import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTE_PRESALE_ORDERS } from 'src/utils/routes';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTE_PRESALE_ORDERS);
  }, []);

  return (
    <>
      <div>Home page...</div>
    </>
  );
};

export default HomePage;

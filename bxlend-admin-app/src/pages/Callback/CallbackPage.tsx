import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { ROUTE_PRESALE_ORDERS } from 'src/utils/routes';
import { AUTH_REDIRECT_URI, AUTH_URL, BASIC_AUTH_CLIENT_ID, BASIC_AUTH_CLIENT_SECRET } from 'src/configs';

import request from '../../request';

const CallbackPage = () => {
  const navigate = useNavigate();

  const createUrlSearchParams = (parameters: any) => {
    const params = new URLSearchParams();

    for (const key in parameters) {
      params.append(key, parameters[key]);
    }
    return params;
  };

  const getAccessToken = async (params: any) => {
    const response = await request.post(`${AUTH_URL}/token`, params, {
      auth: {
        username: BASIC_AUTH_CLIENT_ID,
        password: BASIC_AUTH_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  };

  const [result, setResult] = useState<any>();
  const queryParam = useLocation().search;
  const authorizationCode = new URLSearchParams(queryParam).get('code');

  useEffect(() => {
    if (!result) {
      getAccessToken(
        createUrlSearchParams({
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: AUTH_REDIRECT_URI,
        })
      )
        .then((res) => {
          setResult(res);
          localStorage.setItem('access', res?.data?.access_token);
          navigate(ROUTE_PRESALE_ORDERS);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return <></>;
};

export default CallbackPage;

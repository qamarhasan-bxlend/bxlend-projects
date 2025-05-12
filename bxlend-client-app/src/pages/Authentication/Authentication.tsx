import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router';

import { useSelector } from 'react-redux';
import { useDispatch } from 'src/store/useDispatch';
import { setAppAlert } from 'src/store/slice/appAlert';
import { RootState } from 'src/store/store';

import { Container } from 'src/components/Container';
import { Loader } from 'src/components/Loader';

import {
  AUTH_URL,
  BASIC_AUTH_CLIENT_ID,
  AUTH_REDIRECT_URI,
  BASIC_AUTH_CLIENT_SECRET,
} from 'src/configs';
import request from 'src/request';
import { ROUTE_ACCOUNT_CREATED, ROUTE_MARKET } from 'src/routes';

const Authentication = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const isUserVerified =
    user.email_verified && user?.phone_number_verified && user?.kyc_status === 'VERIFIED';

  const createUrlSearchParams = (parameters) => {
    const params = new URLSearchParams();

    for (const key in parameters) {
      params.append(key, parameters[key]);
    }
    return params;
  };

  const getAccessToken = async (params) => {
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
        }),
      )
        .then((res) => {
          setResult(res);
          localStorage.setItem('access', res?.data?.access_token);
          navigate(isUserVerified ? ROUTE_MARKET : ROUTE_ACCOUNT_CREATED);
        })
        .catch(({ response }) =>
          dispatch(setAppAlert({ message: response?.data?.error || 'Something went wrong' })),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container display="flex" justifyContent="center" alignItems="center">
      <Loader overlay />
    </Container>
  );
};

export default Authentication;

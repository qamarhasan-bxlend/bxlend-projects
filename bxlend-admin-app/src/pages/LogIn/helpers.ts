import { AUTH_REDIRECT_URI, CLIENT_ID, AUTH_URL } from "src/configs";

export const handleLogin = () => {
  const scopes = [
    'offline_access',
    'write:user.phone_number',
    'read:user.phone_number',
    'write:user.email',
    'read:user.email',
    'read:user.profile',
    'write:user.profile',
    'write:user.password',
  ];

  const generateQs = (params: {
    client_id?: string;
    response_type: string;
    scope: string;
    redirect_uri?: string;
    prompt: string;
  }) => {
    const newParams = new URLSearchParams(params).toString();
    if (!newParams) return '';
    return '?' + newParams;
  };

  const params = {
    client_id: CLIENT_ID,
    response_type: 'code',
    scope: scopes.join(' '),
    redirect_uri: AUTH_REDIRECT_URI,
    prompt: 'login',
  };

  const qs = generateQs(params);

  return AUTH_URL + '/auth' + qs;
};

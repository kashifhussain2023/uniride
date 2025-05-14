/* eslint-disable no-console */
import axios from 'axios';
import { getSession } from 'next-auth/react';

//const AUTH_KEY = cookie.get('userAuth');
const API_BASE_URL = `${process.env.NEW_API_URL}`; //`http://127.0.0.1:8000/api`;

const headerValue = async () => {
  const session = await getSession();
  const token = session?.user?.token_code;
  const header = {
    Accept: 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    'Device-Type': 'android',
    'Version-Code': 1,
  };
  return header;
};
export const api = async options => {
  const header = await headerValue();
  try {
    const config = {
      headers: {
        ...header,
        ...(options.headers || {}),
      },
      method: options.method || 'GET',
      url: `${API_BASE_URL}${options.url}`,
    };
    if (['POST', 'PUT'].includes(options.method)) {
      config['data'] = options.data;
    }
    const response = await axios(config);
    if (response.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    return error?.response || 'Internal Server Error';
  }
};

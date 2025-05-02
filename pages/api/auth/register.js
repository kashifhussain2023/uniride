/* eslint-disable no-console */
import axios from 'axios';
import cookie from 'js-cookie';

//const AUTH_KEY = cookie.get('userAuth');
const API_BASE_URL = process.env.NEXT_PUBLIC_NEW_API_URL; //`http://127.0.0.1:8000/api`;

const headerValue = async () => {
  const TOKEN = cookie.get('token');
  const header = {
    Accept: 'application/json',

    //Authkey: AUTH_KEY ? JSON.parse(AUTH_KEY)?.auth_key : '',
    Authorization: TOKEN ? 'Bearer ' + TOKEN : '',

    'Device-Id': '8091fd16cfaf9978ba777dbdbb7e92c7684da353d9d7f42b6aad6e5f17947829',

    'Device-Type': 'android',

    //"Content-Type": "application/json",
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

    // if (options.headers) {
    // 	config['headers'] = {
    // 		...header,
    // 		...options.header,
    // 	};
    // }
    const response = await axios(config);
    if (response.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    return error?.response || 'Internal Server Error';
  }
};

/* eslint-disable no-console */
import axios from "axios";
import cookie from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_NEW_API_URL; //`http://127.0.0.1:8000/api`;

const headerValue = async () => {
  const TOKEN = cookie.get('token');
  const header = {
   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlcmUuZHNAeW9wbWFpbC5jb20iLCJpZCI6MTQ5LCJpYXQiOjE3NDQ5NTYzMDksImV4cCI6MTc3NjQ5MjMwOX0.UR-TDrDQJwfQT3KUhVUCXCEIAuOzGDNExRUWZVRMkCU" ,
  // "Authorization": TOKEN ? "Bearer " + TOKEN:'' ,
    "x-login-method" : "jwt"
  }
  	
	return header;
}

export const api = async (options) => {
  const header = await headerValue();

  try {
    const config = {
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || "GET",
      headers: {
				...header, 
				...(options.headers || {}) 
			},
    };

    if (["POST", "PUT"].includes(options.method)) {
      config["data"] = options.data;
    }
    // if (options.headers) {
    //   config["headers"] = {
    //     ...header,
    //     ...options.headers,
    //   };
    // }
    const response = await axios(config);

    if (response.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    return error?.response || "Internal Server Error";
  }
};

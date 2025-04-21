/* eslint-disable no-console */
import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_NEW_API_URL; //`http://127.0.0.1:8000/api`;

const headerValue = async () => {
  // Get the session from NextAuth
  const session = await getSession();
  
  // Get the token from the session
  const token = session?.user?.data?.token_code;
  
  const header = {
    "Authorization": token ? `Bearer ${token}` : "",
    "x-login-method": "jwt",
    "Accept": "application/json",
    "Content-Type": "application/json"
  };
  
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

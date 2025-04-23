/* eslint-disable no-console */
import axios from "axios";
import { getSession } from "next-auth/react";

//const AUTH_KEY = cookie.get('userAuth');
const API_BASE_URL = `${process.env.NEXT_PUBLIC_NEW_API_URL}`; //`http://127.0.0.1:8000/api`;

const headerValue = async () => {
  const session = await getSession();
  
  const token = session?.user?.data?.token_code;
  
  const header = {
    "Version-Code": 1,
    "Device-Type": "android",
    "Accept": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
    "Content-Type": "application/json"
  };
  
  return header;
};

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
    
    const response = await axios(config);
    
    if (response.data) {
      return response.data;
    }
    return response;
  } catch (error) {
    return error?.response || "Internal Server Error";
  }
};

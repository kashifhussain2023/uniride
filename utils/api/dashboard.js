/* eslint-disable no-console */
import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL = "https://www.unirideus.com/api";

const headerValue = async () => {
  // Get the session from NextAuth
  const session = await getSession();
  
  // Get the token from the session
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

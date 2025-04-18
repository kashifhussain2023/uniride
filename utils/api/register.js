/* eslint-disable no-console */
import axios from "axios";
import cookie from "js-cookie";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

//const AUTH_KEY = cookie.get('userAuth');
const API_BASE_URL = "https://www.unirideus.com/api"; //`http://127.0.0.1:8000/api`;

const headerValue = async () => {
  const TOKEN = cookie.get("token");
  const header = {
    //"Content-Type": "application/json",
    "Version-Code": 1,
    "Device-Type": "android",
    Accept: "application/json",
    //Authkey: AUTH_KEY ? JSON.parse(AUTH_KEY)?.auth_key : '',
    Authorization: TOKEN ? "Bearer " + TOKEN : "",
  };

  return header;
};

export const api = async (options) => {
  const header = await headerValue();

  try {
    const config = {
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || "GET",
      //headers: header,
    };
    if (["POST", "PUT"].includes(options.method)) {
      config["data"] = options.data;
    }
    if (options.headers) {
      config["headers"] = {
        ...header,
        ...options.headers,
      };
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

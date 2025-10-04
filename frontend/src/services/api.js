import axios from "axios";
import authService from "@/services/authService";
import { API_HOST } from "@/services/config";

const API = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common.Authorization;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

API.interceptors.response.use(undefined, (error) => {
  switch (error.response.status) {
    case 401:
      authService.clearToken();
      if (error.response.config.url !== "/login") {
        window.location.href = "/";
      }
      break;
    case 403:
      console.e(403);
    default:
      return Promise.reject(error);
  }
});

export { API };

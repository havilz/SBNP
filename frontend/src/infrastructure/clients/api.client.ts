import axios from "axios";
import { config } from "../config/config";

/**
 * Standard API Client for SBNP Backend.
 * Automatically configured with baseUrl and timeout from app configuration.
 */
export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for Request (Attaching JWT Auth Token)
apiClient.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("sbnp_admin_token");
    if (token) {
      req.headers.set('Authorization', `Bearer ${token}`);
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for Response (Global Error Handling)
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    // Global notification or error logging logic
    console.error(`[API Error] ${error.response?.status} - ${error.message}`);
    return Promise.reject(error);
  }
);

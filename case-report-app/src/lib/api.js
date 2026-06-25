import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  },
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: `${BASE_URL}/auth`,
  headers: { 
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Unified Interceptor Interfacing Logic
const handleResponseInterceptor = async (error) => {
  const originalRequest = error.config;

  // Filter out edge configurations or recursive retry failures
  if (!error.response || error.response.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  // Prevent routing loops if the refresh endpoint itself or login fails
  if (
    originalRequest.url.includes("/login") || 
    originalRequest.url.includes("/refresh-token")
  ) {
    return Promise.reject(error);
  }

  // Detect which Axios instance launched this request originally
  const currentAxiosInstance = originalRequest.baseURL?.endsWith("/auth") ? authApi : api;

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((token) => {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        // ✅ FIXED: Safely retries using the correct matching Axios instance
        return currentAxiosInstance(originalRequest); 
      })
      .catch((err) => Promise.reject(err));
  }

  originalRequest._retry = true;
  isRefreshing = true;

  return new Promise((resolve, reject) => {
    const stored = localStorage.getItem("app_refresh_token");
    if (!stored) {
      isRefreshing = false;
      return reject(error);
    }

    authApi.post("/refresh-token", { refreshToken: stored })
      .then((res) => {
        const payload = res.data?.data;
        const newAccess = payload?.accessToken;
        const newRefresh = payload?.refreshToken;

        if (newAccess) {
          // Sync access header to standard instance baseline
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

          if (newRefresh) {
            localStorage.setItem("app_refresh_token", newRefresh);
          }

          processQueue(null, newAccess);
          // ✅ FIXED: Resolves using the correct matching Axios instance
          resolve(currentAxiosInstance(originalRequest));
        } else {
          processQueue(new Error("Missing payload details"), null);
          reject(error);
        }
      })
      .catch((err) => {
        processQueue(err, null);
        window.dispatchEvent(new Event("auth-expired"));
        reject(err);
      })
      .finally(() => {
        isRefreshing = false;
      });
  });
};

// Apply identical interception profiles cleanly across both routing vectors
api.interceptors.response.use((response) => response, handleResponseInterceptor);
authApi.interceptors.response.use((response) => response, handleResponseInterceptor);

export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};
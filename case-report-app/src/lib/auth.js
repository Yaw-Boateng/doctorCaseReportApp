import { authApi, setAuthToken, clearAuthToken } from "./api";

const REFRESH_KEY = "app_refresh_token";

export const login = async ({ email, password }) => {
  const res = await authApi.post("/login", { email, password });
  const data = res.data?.data;
  if (data?.accessToken) setAuthToken(data.accessToken);
  if (data?.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
  return data;
};

export const register = async (payload) => {
  const res = await authApi.post("/register", payload);
  const data = res.data?.data;
  if (data?.accessToken) setAuthToken(data.accessToken);
  if (data?.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
  return data;
};

export const restoreSession = async () => {
  const token = localStorage.getItem(REFRESH_KEY);
  if (!token) throw new Error("No token");
  const res = await authApi.post("/refresh-token", { refreshToken: token });
  const data = res.data?.data;
  if (data?.accessToken) setAuthToken(data.accessToken);
  return data;
};

export const logout = async () => {
  try {
    const token = localStorage.getItem(REFRESH_KEY);
    await authApi.post("/logout", { refreshToken: token });
  } finally {
    clearAuthToken();
    localStorage.removeItem(REFRESH_KEY);
  }
};

// Added explicitly to align with the AuthProvider mapping layer
export const forgotPassword = async (email) => {
  const res = await authApi.post("/forgot-password", { email });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await authApi.post("/verify-otp", { email, otp });
  const data = res.data?.data;
  if (data?.accessToken) setAuthToken(data.accessToken);
  if (data?.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
  return data;
};

export const resetPassword = async (email, otp, newPassword, confirmPassword) => {
  const res = await authApi.post("/reset-password", { 
    email, 
    otp, 
    newPassword, 
    confirmPassword 
  });
  return res.data;
};

export default { login, register, restoreSession, logout, forgotPassword, verifyOtp, resetPassword };
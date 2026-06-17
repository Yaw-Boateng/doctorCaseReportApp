import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const api = axios.create({
baseURL: BASE_URL,
headers: { "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
 },
withCredentials: true,
});
export const authApi = axios.create({
baseURL: `${BASE_URL}/auth`,
headers: { "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
 },
withCredentials: true,
});
api.interceptors.response.use(
(response) => response,
async (error) => {
const originalRequest = error.config;
if (error.response?.status === 401 && !originalRequest._retry) {
originalRequest._retry = true;
try {
const stored = localStorage.getItem("app_refresh_token");
if (!stored) throw new Error("No refresh token");
const res = await authApi.post("/refresh-token", { refreshToken: stored });
const newAccess = res.data?.data?.accessToken;
if (newAccess) {
api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
return api(originalRequest);
}
} catch (err) {
window.dispatchEvent(new Event("auth-expired"));
return Promise.reject(err);
}
}
return Promise.reject(error);
}
);
export const setAuthToken = (token) => {
if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
export const clearAuthToken = () => {
delete api.defaults.headers.common["Authorization"];
};
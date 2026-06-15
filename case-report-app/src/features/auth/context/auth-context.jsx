import { useState, useEffect } from "react";
import { authApi, setAuthToken } from "@/lib/api";
import { Loader } from "@/components/ui/loader";
import { AuthContext } from "./auth-context-core";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clean state reset helper
  const resetAuthState = () => {
    setUser(null);
    setRole(null);
    setIsLoading(false);
    localStorage.removeItem("app_refresh_token");
  };

  // Clean, standardized role normalizer logic
  const normalizeAndSetRole = (rawRole) => {
    if (!rawRole) return "worker";
    return rawRole.replace(/^ROLE_/, "").toLowerCase();
  };

  // 1. Silent Boot Check: Verifies session token on page reloads
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("app_refresh_token");
        if (!storedToken) throw new Error("No refresh token found in storage.");

        // Send token explicitly in request body object payload wrapper
        const res = await authApi.post("/refresh-token", {
          refreshToken: storedToken,
        });
        const payload = res.data?.data;

        if (payload?.accessToken) {
          setAuthToken(payload.accessToken);
          setUser(payload.user);
          setRole(normalizeAndSetRole(payload.user?.role));
        } else {
          throw new Error(
            "Missing access tokens from refresh handler payload.",
          );
        }
      } catch (err) {
        console.warn("Session restoration failed:", err.message);
        resetAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen globally if the axios interceptor catches an expired refresh session
    window.addEventListener("auth-expired", resetAuthState);
    return () => window.removeEventListener("auth-expired", resetAuthState);
  }, []);

  // 2. Action Handlers mapping clean API parameters back to your components
  const login = async (email, password) => {
    const res = await authApi.post("/login", { email, password });

    // Core Fix: Drilling down deep enough into your backend JSON structure
    const payload = res.data?.data;

    if (!payload) throw new Error("Invalid API response format");

    if (payload.accessToken) setAuthToken(payload.accessToken);
    if (payload.refreshToken)
      localStorage.setItem("app_refresh_token", payload.refreshToken);

    setUser(payload.user);
    const parsedRole = normalizeAndSetRole(payload.user?.role);
    setRole(parsedRole);

    return parsedRole;
  };

  const register = async (userData) => {
    const res = await authApi.post("/register", userData);
    const payload = res.data?.data;
    if (payload?.accessToken) setAuthToken(payload.accessToken);
    if (payload?.refreshToken)
      localStorage.setItem("app_refresh_token", payload.refreshToken);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("app_refresh_token");
      await authApi.post("/logout", { refreshToken: token });
    } catch (err) {
      console.error("Logout request failed on backend:", err);
    } finally {
      resetAuthState();
    }
  };

  const forgotPassword = async (email) => {
    await authApi.post("/forgot-password", { email });
  };

  const verifyOtp = async (email, otp) => {
    const res = await authApi.post("/verify-otp", { email, otp });
    const payload = res.data?.data;

    if (payload?.accessToken) setAuthToken(payload.accessToken);
    if (payload?.refreshToken)
      localStorage.setItem("app_refresh_token", payload.refreshToken);

    setUser(payload.user);
    const parsedRole = normalizeAndSetRole(payload.user?.role);
    setRole(parsedRole);
    return parsedRole;
  };

  const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    await authApi.post("/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {isLoading ? <Loader message="Checking authentication…" /> : children}
    </AuthContext.Provider>
  );
}

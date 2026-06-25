import { useState, useEffect } from "react";
import { api, authApi, setAuthToken } from "@/lib/api";
import { Loader } from "@/components/ui/loader";
import { AuthContext } from "./auth-context-core";

// File-level shared boot promise tracker to block React StrictMode dual-mount concurrency
let sharedBootPromise = null;

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
    delete api.defaults.headers.common["Authorization"];
  };

  // Clean, standardized role normalizer logic
  const normalizeAndSetRole = (rawRole) => {
    if (!rawRole) return "worker";
    return rawRole.replace(/^ROLE_/, "").toLowerCase();
  };

  // 1. Silent Boot Check: Verifies session token safely with StrictMode protection
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("app_refresh_token");

        if (!storedToken) {
          if (isMounted) setIsLoading(false);
          return;
        }

        if (api.defaults.headers.common["Authorization"]) {
          if (isMounted) setIsLoading(false);
          return;
        }

        // If another instance of this mount context is executing, await its result
        if (!sharedBootPromise) {
          sharedBootPromise = authApi.post("/refresh-token", {
            refreshToken: storedToken,
          }).finally(() => {
            sharedBootPromise = null;
          });
        }

        const res = await sharedBootPromise;

        if (!isMounted) return;

        const payload = res.data?.data;

        if (payload?.accessToken) {
          setAuthToken(payload.accessToken);
          setUser(payload.user);
          setRole(normalizeAndSetRole(payload.user?.role));
          if (payload.refreshToken) {
            localStorage.setItem("app_refresh_token", payload.refreshToken);
          }
        } else {
          throw new Error("Missing access tokens from refresh handler payload.");
        }
      } catch (err) {
        if (!isMounted) return;

        // Only wipe the state if the backend explicitly rejected the token credentials
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.warn("Session expired. Clearing stale security tokens.");
          resetAuthState();
        } else {
          console.error(
            "Infrastructure telemetry synchronization failure:",
            err.message
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Global Event Listener for Runtime Expirations (triggered via Axios Interceptor)
  useEffect(() => {
    const handleAuthExpired = () => {
      console.warn("Global catch: Auth expired event intercepted.");
      resetAuthState();
    };

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  // 3. Action Handlers mapping clean API parameters back to your components
  const login = async (email, password) => {
    try {
      const res = await authApi.post("/login", { email, password });

      const payload = res.data?.data;
      if (!payload) {
        throw new Error("Invalid server signature: Missing payload schema.");
      }

      const userNode = payload.user;
      const rawRole = userNode?.role || payload.role;

      if (!userNode || !rawRole) {
        throw new Error("Invalid user metadata or authorization context.");
      }

      const parsedRole = normalizeAndSetRole(rawRole);

      if (payload.accessToken) {
        setAuthToken(payload.accessToken);
      } else {
        throw new Error("Access token missing from authentication handshake.");
      }

      if (payload.refreshToken) {
        localStorage.setItem("app_refresh_token", payload.refreshToken);
      }

      setUser(userNode);
      setRole(parsedRole);

      return parsedRole;
    } catch (error) {
      console.error("Authentication execution failure:", error);
      throw error;
    }
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
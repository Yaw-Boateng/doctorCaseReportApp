// src/App.jsx
import { Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader } from "@/components/ui/loader";

// Public Auth Pages/Layouts
import { RegisterForm } from "@/features/auth/components/register-form";
import { LoginForm } from "@/features/auth/components/login-form";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { OtpForm } from "@/features/auth/components/otp-form"; // Added
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"; // Added
import { AuthLayout } from "@/features/auth/auth-layout";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { DashboardLayout } from "@/features/shared/DashboardLayout";
import { useAuth } from "./features/auth/context/use-auth";
import { useMemo } from "react";
const WorkerDetails = lazy(() => import("./features/admin/worker-details"));

// Lazy-Loaded Modules
const AdminDashboard = lazy(() => import("./features/admin/admin-dashboard"));
const WorkersManagement = lazy(
  () => import("./features/admin/workers-management"),
);
const DoctorManagement = lazy(
  () => import("./features/workers/doctor-management"),
);
const LogCaseManagement = lazy(
  () => import("./features/workers/log-case-management"),
);
const ManagerDashboard = lazy(
  () => import("./features/managers/manager-dashboard"),
);
const TestManagement = lazy(
  () => import("./features/admin/test-management"),
);

export default function App() {
  const { user, role: rawRole, logout, isLoading } = useAuth();

  // Safely normalize raw user roles coming down from backend signatures
  const role = useMemo(() => {
    if (!rawRole) return "";
    // Handles "ROLE_ADMIN", "ADMIN", or already normalized "admin" safely
    return rawRole
      .toLowerCase()
      .replace(/^role_/, "")
      .trim();
  }, [rawRole]);

  const isAuthenticated = !!user;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader message="Checking authentication…" />
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system">
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC AUTHENTICATION ROUTES ================= */}
          <Route
            element={
              !isAuthenticated ? (
                <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 md:p-6 relative">
                  <div className="absolute top-4 right-4">
                    <ThemeToggle />
                  </div>
                  <Suspense fallback={<Loader message="Loading layout..." />}>
                    <Outlet />
                  </Suspense>
                </div>
              ) : (
                // Ensure this ternary route block matches your exact normalized tokens
                <Navigate
                  to={
                    role === "admin"
                      ? "/admin"
                      : role === "manager"
                        ? "/manager"
                        : "/doctor"
                  }
                  replace
                />
              )
            }
          >
            <Route
              path="/login"
              element={
                <AuthLayout title="Portal Login">
                  <LoginForm />
                </AuthLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AuthLayout title="Register Account">
                  <RegisterForm />
                </AuthLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthLayout title="Reset Credentials">
                  <ForgotPasswordForm />
                </AuthLayout>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <AuthLayout title="Verify Security Code">
                  <OtpForm />
                </AuthLayout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <AuthLayout title="Create New Password">
                  <ResetPasswordForm />
                </AuthLayout>
              }
            />
          </Route>

          {/* ================= SECURE / PROTECTED DASHBOARD CORE ================= */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                userRole={role}
              />
            }
          >
            <Route
              element={<DashboardLayout userRole={role} onLogout={logout} />}
            >
              {/* ADMIN MODULES */}
              <Route
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    userRole={role}
                    allowedRoles={["admin"]}
                  />
                }
              >
                <Route
                  path="/admin"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading dashboard…" />}
                    >
                      <AdminDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/admin/workers"
                  element={
                    <Suspense fallback={<Loader message="Loading workers…" />}>
                      <WorkersManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="/admin/users/:id"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading parameters…" />}
                    >
                      <WorkerDetails />
                    </Suspense>
                  }
                />
                 <Route
                  path="/admin/tests"
                  element={
                    <Suspense
                      fallback={
                        <Loader message="Assembling catalog pipelines…" />
                      }
                    >
                      <TestManagement />
                    </Suspense>
                  }
                />
              </Route>

              {/* WORKER MODULES */}
              <Route
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    userRole={role}
                    allowedRoles={["worker", "admin"]}
                  />
                }
              >
                <Route
                  path="/doctor"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading clinical view…" />}
                    >
                      <DoctorManagement />
                    </Suspense>
                  }
                />
                <Route
                  path="/cases/log"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading case view…" />}
                    >
                      <LogCaseManagement />
                    </Suspense>
                  }
                />
              </Route>

              {/* MANAGER MODULES */}
              <Route
                element={
                  <ProtectedRoute
                    isAuthenticated={isAuthenticated}
                    userRole={role}
                    allowedRoles={["manager"]}
                  />
                }
              >
                <Route
                  path="/manager"
                  element={
                    <Suspense
                      fallback={<Loader message="Loading management views…" />}
                    >
                      <ManagerDashboard />
                    </Suspense>
                  }
                />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

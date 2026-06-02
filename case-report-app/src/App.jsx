// src/App.jsx
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardSidebar } from "@/features/shared/dashboard-sidebar";
import { ViewResolver } from "@/features/shared/view-resolver";

// Full Page Auth Layout Wrapper
import { RegisterForm } from "@/features/auth/components/register-form";
import { LoginForm } from "@/features/auth/components/login-form";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { AuthLayout } from "@/features/auth/auth-layout";

export default function App() {
  // Global simulated Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Can be: 'admin', 'worker', or 'manager'
  const [view, setView] = useState("Login"); // Current active screen

  // Handle a simulated login from our forms
  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);

    // Redirect to their default dashboard automatically
    if (role === "admin") setView("Admin Dashboard");
    if (role === "worker") setView("Doctor Management");
    if (role === "manager") setView("Manager Dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setView("Login");
  };

  return (
    <ThemeProvider defaultTheme="system">
      {/* 1. FULL PAGE LAYOUT (When user is not authenticated) */}
      {!isAuthenticated ? (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col justify-center items-center p-4 relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          {view === "Login" && (
            <AuthLayout title="Portal Login">
              <LoginForm onLogin={handleLogin} setView={setView} />
            </AuthLayout>
          )}
          {view === "Register" && (
            <AuthLayout title="Register Account">
              <RegisterForm setView={setView} />
            </AuthLayout>
          )}
          {view === "Forgot Password" && (
            <AuthLayout title="Reset Credentials">
              <ForgotPasswordForm setView={setView} />
            </AuthLayout>
          )}
        </div>
      ) : (
        /* 2. PROTECTED DASHBOARD LAYOUT (With sidebar and matching role restrictions) */
        <div className="flex min-h-screen bg-background text-foreground">
          {/* Passes down userRole to lock down side navigation */}
          <DashboardSidebar
            currentView={view}
            setView={setView}
            userRole={userRole}
            onLogout={handleLogout}
          />

          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background">
              <span className="font-medium text-muted-foreground">
                Role:{" "}
                <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground tracking-wider">
                  {userRole}
                </span>
              </span>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </header>

            <main className="flex-1 p-6 flex justify-center items-start bg-background transition-colors duration-200">
              <div className="w-full max-w-5xl">
                <ViewResolver currentView={view} />
              </div>
            </main>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}

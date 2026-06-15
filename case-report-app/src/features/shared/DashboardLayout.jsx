import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardLayout({ userRole, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathToViewMap = {
    "/admin": "Admin Dashboard",
    "/admin/workers": "Workers Management",
    "/doctor": "Doctor Management",
    "/cases/log": "Log Case Management",
    "/manager": "Manager Dashboard",
  };

  const currentView = pathToViewMap[location.pathname] || "";

  return (
    <div className="flex min-h-screen bg-background text-foreground w-full overflow-x-hidden relative">
      {/* Sidebar - Handles its own responsive breakpoints internal elements */}
      <DashboardSidebar
        currentView={currentView}
        setView={(viewName) => {
          const routes = {
            "Admin Dashboard": "/admin",
            "Workers Management": "/admin/workers",
            "Doctor Management": "/doctor",
            "Log Case Management": "/cases/log",
            "Manager Dashboard": "/manager",
          };
          if (routes[viewName]) navigate(routes[viewName]);
        }}
        userRole={userRole}
        onLogout={onLogout}
      />

      {/* Main Structural Layout Content Wrapper */}
      {/* md:pl-60 exactly mirrors the desktop fixed panel layout positioning blocks */}
      <div className="flex-1 flex flex-col min-w-0 w-full md:pl-60 lg:pl-64">
        
        {/* Desktop Sticky Header Sub-Bar Only */}
        <header className="hidden md:flex h-14 md:h-16 border-b border-border items-center justify-between px-4 sm:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10 w-full">
          <span className="font-medium text-xs sm:text-sm text-muted-foreground">
            Role:{" "}
            <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground tracking-wider">
              {userRole}
            </span>
          </span>
        </header>

        {/* Dynamic Outlet View Frame Section */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-background w-full min-w-0">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
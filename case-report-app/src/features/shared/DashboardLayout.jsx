// src/components/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardLayout({ userRole, onLogout }) {
  return (
    // 🌟 CHANGED: Set min-h-screen to let the parent flex container expand naturally
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground w-full relative">
      {/* Sidebar handles layout fixed bounds internally */}
      <DashboardSidebar
        userRole={userRole}
        onLogout={onLogout}
      />

      {/* Main Structural Layout Content Wrapper */}
      {/* 🌟 CHANGED: Removed 'overflow-x-hidden' from parent which chops off child components.
          Added pt-14 on mobile to make room for the sticky mobile header. */}
      <div className="flex-1 flex flex-col min-w-0 w-full pt-14 md:pt-0 md:pl-60 lg:pl-64">
        
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
        {/* 🌟 CHANGED: Removed absolute height/scroll calculations. Let normal block flow take over on mobile. */}
        <main className="flex-1 w-full min-w-0 p-4 sm:p-6 bg-background">
          <div className="w-full max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, ShieldCheck, Activity, Layers } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const MENU_CONFIG = {
  admin: {
    title: "Admin Control",
    icon: <ShieldCheck className="w-4 h-4 text-primary" />,
    items: ["Admin Dashboard", "Workers Management"],
  },
  worker: {
    title: "Workers Portal",
    icon: <Activity className="w-4 h-4 text-emerald-500" />,
    items: ["Doctor Management", "Log Case Management"],
  },
  manager: {
    title: "Managers Studio",
    icon: <Layers className="w-4 h-4 text-blue-500" />,
    items: [
      "Manager Dashboard",
      "Test Dashboard",
      "Finance Dashboard",
      "Doctors Dashboard",
    ],
  },
};

function SidebarContent({
  currentView,
  allowedSection,
  onNavigate,
  onClose,
  onLogout,
}) {
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-5 flex items-center justify-between border-b border-border/60 min-h-[65px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-black text-xs">
            M
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">
            MedCase Portal
          </span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {allowedSection ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 px-3 mb-2">
              {allowedSection.icon}
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {allowedSection.title}
              </span>
            </div>
            <nav className="space-y-1">
              {allowedSection.items.map((item) => {
                const isActive = currentView === item;
                return (
                  <Button
                    key={item}
                    variant={isActive ? "default" : "ghost"}
                    className={`justify-start h-9 w-full text-xs font-medium tracking-tight transition-all duration-200 ${
                      isActive
                        ? "shadow-sm shadow-primary/20 bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    onClick={() => onNavigate(item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </nav>
          </div>
        ) : (
          <div className="px-3 text-xs text-muted-foreground italic">
            No dynamic nodes allocated.
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/60 flex items-center gap-2 bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-9 text-xs font-medium border-border hover:bg-destructive/10 hover:text-destructive transition-colors gap-2"
          onClick={onLogout}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function DashboardSidebar({ currentView, setView, userRole, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const allowedSection = MENU_CONFIG[userRole];

  const handleViewChange = (view) => {
    setView(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      <aside className="hidden md:flex md:w-60 lg:w-64 flex-col fixed top-0 bottom-0 left-0 z-20 border-r border-border bg-card">
        <SidebarContent
          currentView={currentView}
          allowedSection={allowedSection}
          onNavigate={handleViewChange}
          onClose={() => setIsMobileOpen(false)}
          onLogout={onLogout}
        />
      </aside>

      <header className="md:hidden h-14 w-full bg-card/80 backdrop-blur-md border-b border-border sticky top-0 left-0 right-0 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="w-9 h-9 text-muted-foreground hover:text-foreground"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-semibold text-xs tracking-tight text-foreground uppercase bg-muted px-2 py-1 rounded border">
            {userRole} view
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground font-sans tracking-tight pr-1">
            MedCase
          </span>
          <ThemeToggle />
        </div>
      </header>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 bottom-0 z-50 w-64 bg-card transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full invisible pointer-events-none"
        }`}
      >
        <SidebarContent
          currentView={currentView}
          allowedSection={allowedSection}
          onNavigate={handleViewChange}
          onClose={() => setIsMobileOpen(false)}
          onLogout={onLogout}
        />
      </div>
    </>
  );
}

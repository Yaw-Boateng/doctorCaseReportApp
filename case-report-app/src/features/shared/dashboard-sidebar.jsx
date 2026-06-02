// src/features/shared/dashboard-sidebar.jsx
import { Button } from "@/components/ui/button"

export function DashboardSidebar({ currentView, setView, userRole, onLogout }) {
  // Define menu segments matching authorization roles
  const menuConfig = {
    admin: {
      title: "Admin Control",
      items: ["Admin Dashboard", "Member Management"]
    },
    worker: {
      title: "Workers Portal",
      items: ["Doctor Management", "Log Case Management"]
    },
    manager: {
      title: "Managers Studio",
      items: ["Manager Dashboard", "Test Dashboard", "Finance Dashboard", "Doctors Dashboard"]
    }
  }

  // Pick only the section matching the logged-in user's role
  const allowedSection = menuConfig[userRole];

  return (
    <aside className="w-64 bg-card text-card-foreground border-r border-border p-4 flex flex-col justify-between shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="font-bold text-xl px-2 tracking-tight">MedCase Portal</div>
        
        <nav className="flex flex-col gap-4">
          {allowedSection && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-2">
                {allowedSection.title}
              </span>
              {allowedSection.items.map((item) => (
                <Button
                  key={item}
                  variant={currentView === item ? "default" : "ghost"}
                  className="justify-start h-9 w-full font-medium"
                  onClick={() => setView(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          )}
        </nav>
      </div>

      <Button variant="destructive" size="sm" className="w-full mt-auto" onClick={onLogout}>
        🚪 Log Out
      </Button>
    </aside>
  )
}
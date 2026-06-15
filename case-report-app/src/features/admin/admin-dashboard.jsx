import { useState, useMemo, useEffect } from "react";
import { adminService } from "@/lib/adminService";
import { Button } from "@/components/ui/button";

const INITIAL_AUDIT_LOGS = [
  { 
    id: "LOG-101", 
    userId: "43781de8-3c7f-4833-9d1a-7ff4b4165258", 
    fullName: "Augustine Asante Boateng",
    email: "yfrimps13@gmail.com", 
    action: "USER_LOGIN", 
    details: "User logged into the system", 
    timestamp: "2026-06-05T12:59:08.997Z" 
  },
  { 
    id: "LOG-102", 
    userId: "b211a76c-1829-4c22-94b1-9cbefc4c0102", 
    fullName: "Selina Agyeman",
    email: "selina.a@clinic.gh", 
    action: "USER_LOGIN", 
    details: "Authenticated via edge node regional network gateway split tunnel.", 
    timestamp: "2026-06-05T11:02:10Z" 
  },
  { 
    id: "LOG-103", 
    userId: "71fd822a-da55-46e3-8012-1114bfb6a099", 
    fullName: "George Kwesi",
    email: "g.kwesi@health.gov.gh", 
    action: "PASSWORD_RESET_REQUEST", 
    details: "Requested temporary OTP route via security governance portal layers.", 
    timestamp: "2026-06-05T11:45:00Z" 
  }
];

export default function AdminDashboard() {
  const [logs] = useState(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("overview");

  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [clinicalWorkersCount, setClinicalWorkersCount] = useState(0);
  const [systemManagersCount, setSystemManagersCount] = useState(0);

  useEffect(() => {
    const computeDashboardMetrics = async () => {
      try {
        const res = await adminService.getAllUsers({ page: 0, size: 200 });
        const userList = res?.data?.content || [];
        
        setTotalUsersCount(res?.data?.totalElements || userList.length);
        
        const clinicalCount = userList.filter(u => u.role === "ROLE_WORKER" || u.role === "ROLE_CLINICAL").length;
        const managerCount = userList.filter(u => u.role === "ROLE_ADMIN" || u.role === "ROLE_SUPERVISOR").length;

        setClinicalWorkersCount(clinicalCount || 0);
        setSystemManagersCount(managerCount || 0);
      } catch (err) {
        console.warn("Could not load dynamic platform totals metrics matrix:", err);
      }
    };

    computeDashboardMetrics();
  }, []);

  const stats = useMemo(() => [
    { label: "Total Registered Users", count: String(totalUsersCount || 142), detail: "All platform roles combined" },
    { label: "Total Clinical Workers", count: String(clinicalWorkersCount || 98), detail: "Doctors and medical practitioners" },
    { label: "Total System Managers", count: String(systemManagersCount || 44), detail: "Node and regional supervisors" },
  ], [totalUsersCount, clinicalWorkersCount, systemManagersCount]);

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const query = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.email.toLowerCase().includes(query) ||
        log.userId.toLowerCase().includes(query) ||
        log.fullName.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  const previewLogs = useMemo(() => filteredLogs.slice(0, 4), [filteredLogs]);

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in py-2 max-w-7xl mx-auto overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">System Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor infrastructure operational telemetry matrices and worker registries.</p>
      </div>

      {/* ================= VIEW 1: OVERVIEW DASHBOARD ================= */}
      {currentView === "overview" && (
        <>
          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-all hover:border-border/80">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{s.label}</span>
                <div className="text-3xl font-light tracking-tight mt-3 mb-1 text-foreground">{s.count}</div>
                <span className="text-xs text-muted-foreground/80">{s.detail}</span>
              </div>
            ))}
          </div>

          {/* Inline Card Container for Table Block */}
          <div className="border border-border rounded-xl p-4 sm:p-6 bg-card shadow-xs w-full overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h3 className="font-medium text-base tracking-tight text-foreground">Recent Activity Logs</h3>
                <p className="text-xs text-muted-foreground">Immutable historical timeline activity logs syncing worker profiles.</p>
              </div>

              <div className="self-start sm:self-auto">
                <Button 
                  onClick={() => {
                    setSearchQuery(""); 
                    setCurrentView("all-logs");
                  }}
                  variant="outline" 
                  className="text-xs h-9 border-border text-foreground font-medium px-4 hover:bg-muted"
                >
                  See All Logs
                </Button>
              </div>
            </div>

            <TableStructure logsData={previewLogs} />
          </div>
        </>
      )}

      {/* ================= VIEW 2: ALL SYSTEM AUDIT ARCHIVE ================= */}
      {currentView === "all-logs" && (
        <div className="flex flex-col gap-6 animate-fade-in w-full">
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <button 
                  onClick={() => setCurrentView("overview")}
                  className="hover:text-foreground hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Dashboard
                </button>
                <span>/</span>
                <span className="text-foreground">Audit Center</span>
              </div>
              <h1 className="text-xl font-medium tracking-tight text-foreground">Complete System Audit Logs</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review complete operational signatures, cryptographic action tracers, and ledger mutations.
              </p>
            </div>

            <div className="w-full sm:w-80">
              <input
                type="text"
                placeholder="Search Name, Email, Action, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full px-3 text-xs rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <div className="border border-border rounded-xl p-4 sm:p-6 bg-card shadow-xs w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">
                Showing {filteredLogs.length} of {logs.length} logged entries
              </span>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-primary hover:underline font-medium bg-transparent border-0 p-0 cursor-pointer"
                >
                  Clear filter query
                </button>
              )}
            </div>
            
            <TableStructure logsData={filteredLogs} />
          </div>
        </div>
      )}
    </div>
  );
}

function TableStructure({ logsData }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden w-full bg-background shadow-xs">
      {/* Scrollable table container wrapper */}
      <div className="w-full overflow-x-auto block scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs table-auto min-w-[950px]">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground font-medium uppercase tracking-wider">
              <th className="p-4 pl-5 min-w-[110px]">Log ID</th>
              <th className="p-4 min-w-[280px]">User Context & Platform Role</th>
              <th className="p-4 min-w-[180px]">Action Signature</th>
              <th className="p-4 min-w-[300px]">Operation Details</th>
              <th className="p-4 pr-5 text-right min-w-[150px]">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono text-[11px] text-foreground">
            {logsData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground font-sans text-xs">
                  No matching activity logs found for your search parameters.
                </td>
              </tr>
            ) : (
              logsData.map((log) => (
                <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 pl-5 text-foreground font-semibold">{log.id}</td>
                  <td className="p-4 font-sans">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium text-xs">{log.fullName}</span>
                        {log.email === "yfrimps13@gmail.com" && (
                          <span className="bg-primary/10 text-primary font-mono text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wide border border-primary/20">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground font-mono text-[10px]">{log.email}</span>
                      <span className="text-muted-foreground/40 font-mono text-[9px] truncate max-w-[240px] select-all" title={log.userId}>
                        {log.userId}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono border ${
                      log.action === "USER_LOGIN" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-sans text-muted-foreground leading-relaxed break-words max-w-sm">
                    {log.details}
                  </td>
                  <td className="p-4 pr-5 text-right text-muted-foreground font-sans whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })} &middot; {" "}
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
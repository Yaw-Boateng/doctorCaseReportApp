import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
// Import your pagination component
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("overview");

  // Client-side pagination state for the "All Logs" panel view
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  // Consume synchronized React Query hook state instance
  const { data, isLoading, isError } = useAdminDashboard();

  // Safeguard defaults mapping to the new API structure
  const logs = data?.logs || []; 
  const statsMetrics = data || { totalUsers: null, totalWorkers: null, totalManagers: null };

  const stats = useMemo(() => [
    { 
      label: "Total Registered Users", 
      count: statsMetrics.totalUsers !== null ? String(statsMetrics.totalUsers) : "Data unavailable", 
      detail: "All platform roles combined" 
    },
    { 
      label: "Total Clinical Workers", 
      count: statsMetrics.totalWorkers !== null ? String(statsMetrics.totalWorkers) : "Data unavailable", 
      detail: "Doctors and medical practitioners" 
    },
    { 
      label: "Total System Managers", 
      count: statsMetrics.totalManagers !== null ? String(statsMetrics.totalManagers) : "Data unavailable", 
      detail: "Node and regional supervisors" 
    },
  ], [statsMetrics]);

  // Step 1: Filter the full log collection matching the search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const query = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.email?.toLowerCase().includes(query) ||
        log.userId?.toLowerCase().includes(query) ||
        log.fullName?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  // Step 2: Extract a preview slice (first 4 items) for the summary dashboard landing panel view
  const previewLogs = useMemo(() => filteredLogs.slice(0, 4), [filteredLogs]);

  // Step 3: Calculate current window pagination slice for "All Logs" view
  const paginatedLogs = useMemo(() => {
    const startOffset = page * pageSize;
    const endOffset = startOffset + pageSize;
    return filteredLogs.slice(startOffset, endOffset);
  }, [filteredLogs, page, pageSize]);

  // Step 4: Dynamically compute total logical pages based on matches
  const totalPages = useMemo(() => {
    return Math.ceil(filteredLogs.length / pageSize);
  }, [filteredLogs.length, pageSize]);

  // Reset page cursor whenever filters are typed or removed to prevent blank array states
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(0);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-destructive/20 bg-destructive/5 max-w-7xl mx-auto my-8">
        <p className="text-sm font-medium text-destructive">Failed to establish synchronization with node platform telemetry APIs.</p>
        <p className="text-xs text-muted-foreground mt-1">Check database container clusters or validation tokens.</p>
      </div>
    );
  }

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
                <div className={`tracking-tight mt-3 mb-1 text-foreground ${isLoading ? "text-base text-muted-foreground/40 animate-pulse" : s.count === "Data unavailable" ? "text-base font-normal text-muted-foreground/60" : "text-3xl font-light"}`}>
                  {isLoading ? "Fetching telemetry..." : s.count}
                </div>
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
                    setPage(0); // Clear pointer matrix
                    setCurrentView("all-logs");
                  }}
                  variant="outline" 
                  className="text-xs h-9 border-border text-foreground font-medium px-4 hover:bg-muted"
                  disabled={logs.length === 0 || isLoading}
                >
                  See All Logs
                </Button>
              </div>
            </div>

            <TableStructure logsData={previewLogs} isLoading={isLoading} />
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
                  className="hover:text-foreground hover:underline bg-transparent border-0 p-0 cursor-pointer text-xs"
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 w-full px-3 text-xs rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="border border-border rounded-xl p-4 sm:p-6 bg-card shadow-xs w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">
                {isLoading ? "Quantifying logged matrices..." : `Showing ${Math.min(filteredLogs.length, page * pageSize + 1)}-${Math.min(filteredLogs.length, (page + 1) * pageSize)} of ${filteredLogs.length} matching logged entries`}
              </span>
              {searchQuery && (
                <button 
                  onClick={() => handleSearchChange("")}
                  className="text-xs text-primary hover:underline font-medium bg-transparent border-0 p-0 cursor-pointer"
                >
                  Clear filter query
                </button>
              )}
            </div>
            
            {/* Display parsed window collection array items */}
            <TableStructure logsData={paginatedLogs} isLoading={isLoading} />

            {/* Pagination controls hook layout integration mount point */}
            <PaginationWrapper
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              isLoading={isLoading}
              className="mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function TableStructure({ logsData, isLoading }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden w-full bg-background shadow-xs">
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
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground font-sans text-xs animate-pulse">
                  Loading operational logs from query cache...
                </td>
              </tr>
            ) : logsData.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-muted-foreground/60 font-sans text-xs italic tracking-wide">
                  Data unavailable
                </td>
              </tr>
            ) : (
              logsData.map((log) => (
                <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 pl-5 text-foreground font-semibold truncate max-w-[100px]" title={log.id}>
                    {log.id && log.id.length > 8 ? `${log.id.slice(0, 8)}...` : log.id}
                  </td>
                  <td className="p-4 font-sans">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-medium text-xs">{log.fullName}</span>
                        {log.role === "ROLE_ADMIN" && (
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
                      log.action?.includes("APPROVED") 
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
                    {log.timestamp ? (
                      <>
                        {new Date(log.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })} &middot; {" "}
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </>
                    ) : (
                      "N/A"
                    )}
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
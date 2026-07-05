import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { AdminTable } from "./components/AdminTable";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("overview");

  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const { data, isLoading, isError } = useAdminDashboard(page, pageSize);

  const logs = data?.logs || []; 
  const totalLogsCount = data?.totalLogsCount || 0;
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

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const query = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.performedBy?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query) ||
        log.details?.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  const previewLogs = useMemo(() => filteredLogs.slice(0, 4), [filteredLogs]);

  const totalPages = useMemo(() => {
    return Math.ceil(totalLogsCount / pageSize) || 1;
  }, [totalLogsCount, pageSize]);

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
    <div className="flex flex-col gap-8 w-full animate-fade-in py-2 max-w-7xl mx-auto overflow-hidden bg-background text-foreground">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">System Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor infrastructure operational telemetry matrices and worker registries.</p>
      </div>

      {/* ================= VIEW 1: OVERVIEW DASHBOARD ================= */}
      {currentView === "overview" && (
        <>
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
                    setPage(0); 
                    setCurrentView("all-logs");
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs border-border bg-card hover:bg-primary/5 hover:text-primary transition-colors font-medium px-4"
                  disabled={isLoading}
                >
                  See All Logs
                </Button>
              </div>
            </div>

            <AdminTable logsData={previewLogs} isLoading={isLoading} />
          </div>
        </>
      )}

      {/* ================= VIEW 2: ALL SYSTEM AUDIT ARCHIVE ================= */}
      {currentView === "all-logs" && (
        <div className="flex flex-col gap-6 animate-fade-in w-full">
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Button
                  onClick={() => {
                    setPage(0);
                    setCurrentView("overview");
                  }}
                  variant="outline"
                  className="h-8 text-[11px] border-border text-foreground bg-card hover:bg-muted px-3"
                >
                   &larr; Back To Dashboard
                </Button>
                {/* <span>/</span>
                <span className="text-foreground">Audit Center</span> */}
              </div>
              <h1 className="text-xl font-medium tracking-tight text-foreground">Complete System Audit Logs</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review complete operational signatures, cryptographic action tracers, and ledger mutations.
              </p>
            </div>

            {/* THEMED SEARCH INPUT BOX */}
            <div className="w-full sm:w-80 relative">
              <input
                type="text"
                placeholder="Search Current Batch..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 w-full px-3 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-xs"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="border border-border rounded-xl p-4 sm:p-6 bg-card shadow-xs w-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">
                {isLoading ? (
                  "Quantifying logged matrices..."
                ) : (
                  `Showing entries ${totalLogsCount === 0 ? 0 : page * pageSize + 1} - ${Math.min(totalLogsCount, (page + 1) * pageSize)} of ${totalLogsCount} global items`
                )}
              </span>
              {searchQuery && (
                <Button
                  onClick={() => handleSearchChange("")}
                  variant="link"
                  className="p-0 h-auto font-medium text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Clear filter query
                </Button>
              )}
            </div>
            
            <AdminTable logsData={filteredLogs} isLoading={isLoading} />

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
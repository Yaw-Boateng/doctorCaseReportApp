import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "@/lib/adminService";
import { Button } from "@/components/ui/button";
// Import Pagination Wrapper
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";

export default function WorkerDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination parameters for the audit log table
  const [logPage, setLogPage] = useState(0);
  const [logPageSize] = useState(10);
  const [totalLogPages, setTotalLogPages] = useState(0);

  // Unified data sync puller loop configuration
  const fetchAllRequiredData = async () => {
    try {
      const [userResponse, logsResponse] = await Promise.all([
        adminService.getUserById(id),
        adminService.getUserAuditLogs(id, { page: logPage, size: logPageSize, sort: ["timestamp,desc"] })
      ]);

      setUser(userResponse?.data);
      setLogs(logsResponse?.data?.content || []);
      setTotalLogPages(logsResponse?.data?.totalPages || 0);
    } catch (error) {
      console.error("Infrastructure pipeline failure loading details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchAllRequiredData();
    }
  }, [id, logPage, logPageSize]);

  // PUT: Approve worker flow
  const handleApproveWorker = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await adminService.approveUser(id);
      await fetchAllRequiredData();
    } catch (error) {
      console.error("Failed to commit clearance update signature mutation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PUT: Reject pending worker flow
  const handleRejectWorker = async () => {
    if (!id || !window.confirm("Are you sure you want to reject this worker application?")) return;
    setIsSubmitting(true);
    try {
      await adminService.rejectUser(id);
      await fetchAllRequiredData();
    } catch (error) {
      console.error("Failed to reject worker profile alignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE: Complete removal or access revocation flow
  const handleDeleteWorker = async () => {
    if (!id || !window.confirm("CRITICAL ACTION: Are you sure you want to completely revoke and delete this member from the platform registry? This action is permanent.")) return;
    setIsSubmitting(true);
    try {
      await adminService.deleteUser(id);
      // Since identity target vector no longer exists, route back to directory matrix
      navigate("/admin/workers");
    } catch (error) {
      console.error("Failed to execute data structure purge mutation:", error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground font-sans animate-pulse">
        Polling ledger and auditing profiles for allocation ID: {id}...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 flex flex-col gap-4 max-w-md">
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
          Error: Requested worker node ledger target does not exist or has been removed from persistent arrays.
        </p>
        <Button onClick={() => navigate("/admin/workers")} size="sm" variant="outline" className="w-fit h-8 text-[11px]">
          &larr; Return to Worker Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in p-6 max-w-5xl mx-auto">
      {/* Top Header Controls Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Directory Profile Target: <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border">{user.id}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Action Trigger Buttons rendered only when clearance parameters are PENDING */}
          {user.approvalStatus === "PENDING" && (
            <>
              <Button
                onClick={handleApproveWorker}
                disabled={isSubmitting}
                className="h-8 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 shadow-xs"
              >
                {isSubmitting ? "Processing..." : "Approve Profile"}
              </Button>
              <Button
                onClick={handleRejectWorker}
                disabled={isSubmitting}
                variant="outline"
                className="h-8 text-[11px] border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive px-4"
              >
                Reject Application
              </Button>
            </>
          )}

          {/* Destructive Deletion trigger rendered for already approved/processed members */}
          {user.approvalStatus !== "PENDING" && (
            <Button
              onClick={handleDeleteWorker}
              disabled={isSubmitting}
              variant="outline"
              className="h-8 text-[11px] border-destructive/40 text-destructive bg-transparent hover:bg-destructive hover:text-white transition-colors px-4"
            >
              {isSubmitting ? "Revoking..." : "Revoke & Delete Member"}
            </Button>
          )}
          
          <Button 
            onClick={() => navigate("/admin/workers")} 
            variant="outline" 
            className="h-8 text-[11px] border-border text-foreground hover:bg-muted px-3"
          >
            &larr; Back
          </Button>
        </div>
      </div>

      {/* Main Structural Detail Segment blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Profile Card Summary */}
        <div className="border border-border rounded-xl p-4 bg-card shadow-xs flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account Credentials</h2>
          <div className="flex flex-col gap-2 font-sans text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">System Username/Email</span>
              <span className="font-mono text-foreground select-all">{user.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Associated Phone Node</span>
              <span className="text-foreground font-mono">{user.phoneNumber || "None Configured"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">System Core Role</span>
              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono border uppercase text-foreground">
                {user.role?.replace("ROLE_", "")}
              </span>
            </div>
          </div>
        </div>

        {/* Clearance Parameters Card */}
        <div className="border border-border rounded-xl p-4 bg-card shadow-xs flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clearance & Audit</h2>
          <div className="flex flex-col gap-2 font-sans text-xs">
            <div className="flex justify-between py-1.5 border-b border-border/40 items-center">
              <span className="text-muted-foreground">Authorization State</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                user.approvalStatus === "APPROVED" 
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                  : user.approvalStatus === "PENDING"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}>
                {user.approvalStatus}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border/40">
              <span className="text-muted-foreground">Approved Boundary Timestamp</span>
              <span className="text-foreground font-mono">
                {user.approvedAt ? new Date(user.approvedAt).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= USER PERFORMANCE AUDIT LOGS SECTION ================= */}
      <div className="flex flex-col gap-3 mt-2">
        <div>
          <h2 className="text-sm font-medium tracking-tight text-foreground">Action History & Logs</h2>
          <p className="text-xs text-muted-foreground">System event trails executed directly by or assigned to this specific node target.</p>
        </div>

        <div className="border border-border rounded-xl p-4 bg-card shadow-xs">
          <div className="border border-border/60 rounded-lg overflow-hidden w-full bg-background">
            <div className="overflow-x-auto w-full block scrollbar-thin">
              <table className="w-full text-left border-collapse text-xs table-auto min-w-[750px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium uppercase tracking-wider">
                    <th className="p-3 pl-4 w-[18%]">Timestamp</th>
                    <th className="p-3 w-[20%]">Action Execution</th>
                    <th className="p-3 w-[15%]">Entity Target</th>
                    <th className="p-3">Log Entries / Modifications Context Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-foreground text-[11px]">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-muted-foreground font-sans text-xs italic">
                        No persistent security ledger actions compiled for this identity target.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/10 transition-colors font-sans">
                        <td className="p-3 pl-4 whitespace-nowrap text-muted-foreground font-mono text-[10px]">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Unknown"}
                        </td>
                        <td className="p-3">
                          <span className="bg-muted border border-border/60 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide font-medium text-foreground">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{log.entityType || "N/A"}</span>
                            <span className="text-[9px] text-muted-foreground font-mono tracking-tight">
                              {log.entityId ? `ID: ${log.entityId.slice(0, 8)}...` : ""}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground break-words leading-relaxed max-w-sm">
                          {log.details || "No explicit descriptive data context logged."}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Beautiful and Clean Pagination Component Integration */}
          <PaginationWrapper
            currentPage={logPage}
            totalPages={totalLogPages}
            onPageChange={(newPage) => setLogPage(newPage)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
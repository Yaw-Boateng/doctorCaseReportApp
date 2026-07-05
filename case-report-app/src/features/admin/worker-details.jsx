import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "@/lib/adminService";
import { Button } from "@/components/ui/button";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { Loader } from "@/components/ui/loader";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { useToast } from "@/components/ToastContext"; // 👈 1. Import toast context hook

export default function WorkerDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { addToast } = useToast(); // 👈 2. Initialize addToast
  
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [logPage, setLogPage] = useState(0);
  const [logPageSize] = useState(10);
  const [totalLogPages, setTotalLogPages] = useState(0);

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
      addToast({
        type: "error",
        title: "Data pipeline sync failure",
        description: "Failed to pull up-to-date registry telemetry data.",
        duration: 5000
      });
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

  const handleApproveWorker = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await adminService.approveUser(id);
      
      // 👈 3. Success Approval Toast Trigger
      addToast({
        type: "success",
        title: "Application Approved",
        description: `${user?.firstName || "Worker"} has been cleared for clinical operational dashboard tasks.`,
        duration: 4000
      });
      
      await fetchAllRequiredData();
    } catch (error) {
      console.error("Failed to commit clearance update signature mutation:", error);
      addToast({
        type: "error",
        title: "Clearance error",
        description: "Failed to authorize worker identity alignment profile.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectWorker = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await adminService.rejectUser(id);
      setIsRejectModalOpen(false);
      
      // 👈 4. Warning/Rejection Toast Trigger
      addToast({
        type: "warning",
        title: "Application Rejected",
        description: `The application file for ${user?.firstName || "Worker"} was successfully locked and marked denylisted.`,
        duration: 4500
      });

      await fetchAllRequiredData();
    } catch (error) {
      console.error("Failed to reject worker profile alignment:", error);
      addToast({
        type: "error",
        title: "Rejection failed",
        description: "Could not apply profile lock parameters. Please try again.",
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorker = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await adminService.deleteUser(id);
      setIsDeleteModalOpen(false);
      
      // 👈 5. Destructive Delete Toast Trigger
      addToast({
        type: "error", // Crimson accent used intentionally for hard data purges
        title: "Identity Record Purged",
        description: "The targeted network registration index was wiped from persistent layers.",
        duration: 4000
      });

      navigate("/admin/workers");
    } catch (error) {
      console.error("Failed to execute data structure purge mutation:", error);
      addToast({
        type: "error",
        title: "Purge execution failed",
        description: "Database target locked by process concurrency dependencies.",
        duration: 5000
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center w-full min-h-[50vh]">
        <Loader message={`Loading...`} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 flex flex-col gap-4 max-w-md mx-auto my-12 bg-background text-foreground">
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
          Error: Requested worker node ledger target does not exist or has been removed from persistent arrays.
        </p>
        <Button 
          onClick={() => navigate("/admin/workers")} 
          size="sm" 
          variant="outline" 
          className="w-fit h-8 text-[11px] border-border bg-card hover:bg-primary/5 hover:text-primary transition-colors"
        >
          &larr; Return to Worker Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in p-6 max-w-5xl mx-auto bg-background text-foreground">
      {/* Top Header Controls Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
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
                onClick={() => setIsRejectModalOpen(true)}
                disabled={isSubmitting}
                variant="outline"
                className="h-8 text-[11px] border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive px-4 bg-card"
              >
                Reject Application
              </Button>
            </>
          )}

          {user.approvalStatus !== "PENDING" && (
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isSubmitting}
              variant="outline"
              className="h-8 text-[11px] border-destructive/40 text-destructive bg-card hover:bg-destructive hover:text-white transition-colors px-4"
            >
              Revoke & Delete Member
            </Button>
          )}
          
          <Button 
            onClick={() => navigate("/admin/workers")} 
            variant="outline" 
            className="h-8 text-[11px] border-border text-foreground bg-card hover:bg-muted px-3"
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
              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono border border-border uppercase text-foreground">
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

      {/* ACTION HISTORY TIMELINE LOGS */}
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

          <PaginationWrapper
            currentPage={logPage}
            totalPages={totalLogPages}
            onPageChange={(newPage) => setLogPage(newPage)}
            isLoading={isLoading}
            className="mt-4"
          />
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectWorker}
        title="Reject Worker Application"
        description={`Are you sure you want to deny application authorization privileges for ${user.firstName} ${user.lastName}? Their current credentials will be locked.`}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteWorker}
        title="Revoke & Delete Record"
        description={`CRITICAL WARNING: You are completely deleting ${user.firstName} ${user.lastName} from the platform registry. This action unlinks all telemetry streams and cannot be undone.`}
        requireMatchText={user.email}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
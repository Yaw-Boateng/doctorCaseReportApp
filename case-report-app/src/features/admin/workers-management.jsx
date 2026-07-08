import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { adminService } from "@/lib/adminService";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";

export default function WorkersManagement() {
  const [users, setUsers] = useState([]);
  const [filterTab, setFilterTab] = useState("all");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      const pageable = { page, size: pageSize, sort: ["approvedAt,desc"] };

      if (filterTab === "pending") {
        response = await adminService.getPendingUsers(pageable);
      } else if (filterTab === "approved") {
        response = await adminService.getApprovedUsers(pageable);
      } else {
        response = await adminService.getAllUsers(pageable);
      }

      const pagedData = response?.data;
      setUsers(pagedData?.content || []);
      setTotalPages(pagedData?.totalPages || 0);
    } catch (error) {
      console.error("Failed fetching user workspace directories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterTab, page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in p-6 max-w-5xl mx-auto bg-background text-foreground">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Workers Directory
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage accounts, review clearance parameters, and authorize
            application nodes.
          </p>
        </div>

        {/* Tab Filters Switcher Panel */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs self-start sm:self-auto border border-border/40">
          {["all", "pending", "approved"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilterTab(tab);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-md capitalize font-medium transition-all cursor-pointer border-0 ${
                filterTab === tab
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground bg-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-xl p-4 bg-card shadow-xs w-full overflow-hidden">
        {isLoading ? (
          <div className="py-12 flex items-center justify-center w-full">
            <Loader message="Loading worker directory data from infrastructure servers..." />
          </div>
        ) : (
          <div className="border border-border/60 rounded-lg overflow-hidden w-full bg-background">
            <div className="w-full overflow-x-auto block scrollbar-thin">
              <table className="w-full text-left border-collapse text-xs table-auto min-w-[800px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium uppercase tracking-wider">
                    <th className="p-3 pl-4">Full Name & Contact info</th>
                    <th className="p-3">Assigned Role</th>
                    <th className="p-3">Approval Clearance Status</th>
                    <th className="p-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-foreground text-[11px]">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-6 text-center text-muted-foreground font-sans text-xs italic"
                      >
                        No worker found         
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-muted/10 transition-colors font-sans"
                      >
                        <td className="p-3 pl-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-xs text-foreground">
                              {u.firstName} {u.lastName}
                            </span>
                            <span className="text-muted-foreground/90 font-mono text-[10px]">
                              {u.email}
                            </span>
                            {u.phoneNumber && (
                              <span className="text-muted-foreground/60 text-[10px]">
                                {u.phoneNumber}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono border border-border/40 uppercase">
                            {u.role?.replace("ROLE_", "")}
                          </span>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                              u.approvalStatus === "APPROVED"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : u.approvalStatus === "PENDING"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : "bg-destructive/10 text-destructive border-destructive/20"
                            }`}
                          >
                            {u.approvalStatus}
                          </span>
                        </td>

                        {/* ROUTE SYNC FIX */}
                        <td className="p-3 pr-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-7 px-2 text-[11px] font-semibold tracking-wide gap-1.5 inline-flex hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            <Link to={`/admin/users/${u.id}`}>
                              <span>View Details</span>
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <PaginationWrapper
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          isLoading={isLoading}
          className="mt-4"
        />
      </div>
    </div>
  );
}

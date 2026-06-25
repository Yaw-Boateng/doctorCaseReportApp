import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/adminService";
import { api } from "@/lib/api";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard-telemetry"],
    queryFn: async () => {
      // 1. Fetch metrics from the new dedicated analytics endpoint using Axios
      let metricsData = { totalUsers: null, totalWorkers: null, totalManagers: null };
      try {
        // Automatically handles base URL, auth token injection, and ngrok warning bypass
        const response = await api.get("/admin/dashboard/analytics");
        if (response.data && response.data.success) {
          metricsData = response.data.data;
        }
      } catch (e) {
        console.warn("Failed to fetch explicit dashboard analytics endpoint via Axios:", e);
      }

      // 2. Fetch our base user metrics (still required for the log generation workflow below)
      const userRes = await adminService.getAllUsers({ page: 0, size: 200 });
      const userList = userRes?.data?.content || userRes?.content || [];

      // If the backend analytics call failed, calculate client-side fallbacks using original logic
      if (metricsData.totalUsers === null) {
        metricsData.totalUsers = userRes?.data?.totalElements ?? userRes?.totalElements ?? userList.length;
      }
      if (metricsData.totalWorkers === null) {
        metricsData.totalWorkers = userList.filter(
          (u) => u.role === "ROLE_WORKER" || u.role === "ROLE_CLINICAL"
        ).length;
      }
      if (metricsData.totalManagers === null) {
        metricsData.totalManagers = userList.filter(
          (u) => u.role === "ROLE_ADMIN" || u.role === "ROLE_SUPERVISOR" || u.role === "ROLE_MANAGER"
        ).length;
      }

      // 3. Dynamic Optimization: Fetch real audit data for the newest profiles
      const targetUsersForLogs = userList.slice(0, 5); 
      
      const logsNestedArrays = await Promise.all(
        targetUsersForLogs.map(async (user) => {
          if (!user.id) return [];
          try {
            // Pull real historical data tracking mutations for this explicit user ID
            const logRes = await adminService.getUserAuditLogs(user.id, { page: 0, size: 5 });
            const logContents = logRes?.data?.content || logRes?.content || logRes?.data || [];
            
            // Attach user metadata to the audit signature block directly
            return logContents.map((log) => ({
              ...log,
              fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User",
              email: user.email || "No email documented",
              role: user.role || "UNKNOWN",
            }));
          } catch (e) {
            console.warn(`Could not sync telemetry signatures for user node: ${user.id}`, e);
            return [];
          }
        })
      );

      // Flatten concurrent responses into a single continuous audit list
      const rawLogs = logsNestedArrays.flat();

      // 4. Fallback safeguard check
      const finalLogPool = rawLogs.length > 0 ? rawLogs : userList;

      // 5. Build fully populated normalized structures
      const normalizedLogs = finalLogPool.map((item) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        userId: item.userId || item.id || "N/A",
        fullName: item.fullName || `${item.firstName || ""} ${item.lastName || ""}`.trim() || "Unknown User",
        email: item.email || "No email documented",
        role: item.role || "UNKNOWN",
        action: item.action || (item.approvalStatus ? `USER_${item.approvalStatus}` : "REGISTRATION_RECORD"),
        details: item.details || `User verified with status: ${item.approvalStatus || "PENDING"}. Phone Contact: ${item.phoneNumber || "N/A"}`,
        timestamp: item.timestamp || item.approvedAt || null,
      }));

      // Return unified interface parameters cleanly
      return {
        totalUsers: metricsData.totalUsers,
        totalWorkers: metricsData.totalWorkers,
        totalManagers: metricsData.totalManagers,
        logs: normalizedLogs,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
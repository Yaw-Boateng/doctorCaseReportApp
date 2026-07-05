import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/adminService";
import { api } from "@/lib/api";

export function useAdminDashboard(page = 0, pageSize = 10) {
  return useQuery({
    queryKey: ["admin", "dashboard-telemetry", page, pageSize],
    queryFn: async () => {
      // 1. Fetch system performance metrics
      let metricsData = { totalUsers: null, totalWorkers: null, totalManagers: null };
      try {
        const response = await api.get("/admin/dashboard/analytics");
        if (response.data && response.data.success) {
          metricsData = response.data.data;
        }
      } catch (e) {
        console.warn("Failed to fetch explicit analytics dashboard endpoint:", e);
      }

      // 2. Fetch base user lists for local runtime counting fallbacks
      const userRes = await adminService.getAllUsers({ page: 0, size: 200 });
      const userList = userRes?.data?.data?.content || userRes?.data?.content || userRes?.content || [];

      if (metricsData.totalUsers === null) {
        metricsData.totalUsers = userRes?.data?.data?.totalElements ?? userRes?.data?.totalElements ?? userRes?.totalElements ?? userList.length;
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

      // 3. Request specific window tracking arrays using the global audit-logs endpoint
      let rawLogs = [];
      let totalLogsCount = 0;

      try {
        const logsRes = await adminService.getAllAuditLogs({ page, size: pageSize });
        
        // 🌟 FIX: Drill deep into Axios response structure: logsRes.data (Axios) -> .data (Server response payload) -> .content
        rawLogs = logsRes?.data?.data?.content || logsRes?.data?.content || logsRes?.content || [];
        totalLogsCount = logsRes?.data?.data?.totalElements ?? logsRes?.data?.totalElements ?? logsRes?.totalElements ?? 0;
      } catch (e) {
        console.error("Error reading full platform audit index pipelines:", e);
      }

      // 4. Clean mapping loop mapping backend properties exactly
      const normalizedLogs = rawLogs.map((item, index) => ({
        id: item.id || `audit-row-key-${index}`, // Internal React iteration key only
        performedBy: item.performedBy,           // yfrimps13@gmail.com
        action: item.action,                     // USER_LOGIN, REFRESH_TOKEN_ROTATED
        details: item.details,                   // User logged into the system
        role: item.role,                         // ROLE_ADMIN
        timestamp: item.timestamp,               // ISO timestamp string
      }));

      return {
        totalUsers: metricsData.totalUsers,
        totalWorkers: metricsData.totalWorkers,
        totalManagers: metricsData.totalManagers,
        logs: normalizedLogs,
        totalLogsCount: totalLogsCount,
      };
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}
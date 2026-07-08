import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/adminService";
import { api } from "@/lib/api";

// 🌟 Added searchQuery parameter to the hook signature
export function useAdminDashboard(page = 0, pageSize = 10, searchQuery = "") {
  return useQuery({
    // 🌟 Pass searchQuery directly into the queryKey array
    queryKey: ["admin", "dashboard-telemetry", page, pageSize, searchQuery],
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

      // 3. Request specific window tracking arrays based on filtering context
      let rawLogs = [];
      let totalLogsCount = 0;

      try {
        let logsRes;
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery) {
          // 🌟 Route to your backend search endpoint if a query exists. 
          // We provide the term to both fields to catch either scenario.
          logsRes = await adminService.searchAuditLogs(
            { email: trimmedQuery, action: trimmedQuery },
            { page, size: pageSize }
          );
        } else {
          // Fall back to standard paginated log index if no search query is present
          logsRes = await adminService.getAllAuditLogs({ page, size: pageSize });
        }
        
        // Deep drill into Axios / server custom payload envelopes safely
        rawLogs = logsRes?.data?.data?.content || logsRes?.data?.content || logsRes?.content || [];
        totalLogsCount = logsRes?.data?.data?.totalElements ?? logsRes?.data?.totalElements ?? logsRes?.totalElements ?? 0;
      } catch (e) {
        console.error("Error reading platform audit pipelines:", e);
      }

      // 4. Clean mapping loop backend properties exactly
      const normalizedLogs = rawLogs.map((item, index) => ({
        id: item.id || `audit-row-key-${index}`, 
        performedBy: item.performedBy,           
        action: item.action,                     
        details: item.details,                   
        role: item.role,                         
        timestamp: item.timestamp,               
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
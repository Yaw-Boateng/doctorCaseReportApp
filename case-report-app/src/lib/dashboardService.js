import { api } from "./api";

export const dashboardService = {
  /**
   * Fetch integrated manager dashboard operational data pipelines
   * Endpoint: GET /api/v1/dashboard
   */
  getDashboardMetrics: async () => {
    const res = await api.get("/dashboard");
    return res.data; // Structure: { success: true, message: "...", data: { ... } }
  },
};

export default dashboardService;
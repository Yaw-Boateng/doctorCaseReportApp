import { api } from "./api";

/**
 * Helper to normalize pageable objects into standard API query strings
 */
const buildPageableParams = (pageable = {}) => {
  const params = {};
  if (pageable.page !== undefined) params.page = pageable.page;
  if (pageable.size !== undefined) params.size = pageable.size;
  if (pageable.sort) params.sort = pageable.sort;
  return params;
};

export const adminService = {
  // GET /api/v1/admin/users
  getAllUsers: async (pageable) => {
    const res = await api.get("/admin/users", {
      params: buildPageableParams(pageable),
    });
    return res.data;
  },

  // GET /api/v1/admin/users/{id}
  getUserById: async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  },

  // PUT /api/v1/admin/users/{id}/approve
  approveUser: async (id) => {
    const res = await api.put(`/admin/users/${id}/approve`);
    return res.data;
  },

  // PUT /api/v1/admin/users/{id}/reject
  rejectUser: async (id) => {
    const res = await api.put(`/admin/users/${id}/reject`);
    return res.data;
  },

  // DELETE /api/v1/admin/users/{id}/delete
  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}/delete`);
    return res.data;
  },

  // GET /api/v1/admin/users/approved
  getApprovedUsers: async (pageable) => {
    const res = await api.get("/admin/users/approved", {
      params: buildPageableParams(pageable),
    });
    return res.data;
  },

  // GET /api/v1/admin/users/pending
  getPendingUsers: async (pageable) => {
    const res = await api.get("/admin/users/pending", {
      params: buildPageableParams(pageable),
    });
    return res.data;
  },

  // GET /api/v1/admin/audit-logs/user/{userId}
  getUserAuditLogs: async (userId, pageable = { page: 0, size: 20 }) => {
    const res = await api.get(`/admin/audit-logs/user/${userId}`, {
      params: buildPageableParams(pageable),
    });
    return res.data; // This returns the standard server payload wrapper
  },
};

export default adminService;
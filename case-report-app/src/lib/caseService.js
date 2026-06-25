import { api } from "./api";

const buildPageableParams = (pageable = {}) => {
  const params = {};
  if (pageable.page !== undefined) params.page = pageable.page;
  if (pageable.size !== undefined) params.size = pageable.size;
  if (pageable.sort) params.sort = pageable.sort;
  if (pageable.search) params.search = pageable.search;
  return params;
};

export const caseService = {
  // GET /api/v1/cases
  getAllCases: async (pageable) => {
    const res = await api.get("/cases", { params: buildPageableParams(pageable) });
    return res.data;
  },

  // GET /api/v1/cases/{caseId}
  getCaseById: async (caseId) => {
    const res = await api.get(`/cases/${caseId}`);
    return res.data;
  },

  // POST /api/v1/cases/create
  createCase: async (caseData) => {
    const res = await api.post("/cases/create", caseData);
    return res.data;
  },

  // PATCH /api/v1/cases/{caseId}/update
  updateCase: async (caseId, caseData) => {
    const res = await api.patch(`/cases/${caseId}/update`, caseData);
    return res.data;
  },

  // DELETE /api/v1/cases/{caseId}/delete
  deleteCase: async (caseId) => {
    const res = await api.delete(`/cases/${caseId}/delete`);
    return res.data;
  },
};

export default caseService;
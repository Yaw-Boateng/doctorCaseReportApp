// src/lib/testService.js
// CHANGED: Import your configured interceptor instance instead of vanilla axios
import { api } from "./api"; // Adjust the path depending on where your Axios interceptors file is located

const API_BASE = "/tests";

const testService = {
  // GET /api/v1/tests
  getAllTests: async (params = { page: 0, size: 100 }) => {
    // Uses the customized client instance to pass tokens automatically
    const response = await api.get(API_BASE, { params });
    return response.data;
  },

  // GET /api/v1/tests/{id}
  getTestById: async (id) => {
    const response = await api.get(`${API_BASE}/${id}`);
    return response.data;
  },

  // POST /api/v1/tests/create
  createTest: async (testData) => {
    const response = await api.post(`${API_BASE}/create`, testData);
    return response.data;
  },

  // PUT /api/v1/tests/{id}
  updateTest: async (id, testData) => {
    const response = await api.put(`${API_BASE}/${id}`, testData);
    return response.data;
  },

  // DELETE /api/v1/tests/{id}
  deleteTest: async (id) => {
    const response = await api.delete(`${API_BASE}/${id}`);
    return response.data;
  },

  // PATCH /api/v1/tests/{id}/activate
  activateTest: async (id) => {
    const response = await api.patch(`${API_BASE}/${id}/activate`);
    return response.data;
  },

  // PATCH /api/v1/tests/{id}/deactivate
  deactivateTest: async (id) => {
    const response = await api.patch(`${API_BASE}/${id}/deactivate`);
    return response.data;
  }
};

export default testService;
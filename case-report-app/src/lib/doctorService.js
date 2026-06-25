import { api } from "./api";

const buildPageableParams = (pageable = {}) => {
  const params = {};
  if (pageable.page !== undefined) params.page = pageable.page;
  if (pageable.size !== undefined) params.size = pageable.size;
  if (pageable.sort) params.sort = pageable.sort;
  if (pageable.search) params.search = pageable.search;
  return params;
};

export const doctorService = {

  // NEW: Fetch all dynamic specialties for dropdown menus
  getAllSpecialties: async () => {
    const res = await api.get("/specialties");
    return res.data; // Layout structure: { success: true, message: "...", data: [{ id: "...", name: "..." }] }
  },

  getAllDoctors: async (pageable) => {
    const res = await api.get("/doctors", { params: buildPageableParams(pageable) });
    return res.data;
  },

  getDoctorsBySpecialty: async (specialtyId, pageable) => {
  const res = await api.get(`/doctors/specialty/${specialtyId}`, { 
    params: buildPageableParams(pageable) 
  });
  return res.data;
},

  getDoctorById: async (id) => {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  },

  // ADDED: Server-side search route matching swagger parameters
  searchDoctors: async (pageable) => {
    const res = await api.get("/doctors/search", { params: buildPageableParams(pageable) });
    return res.data;
  },

  registerDoctor: async (doctorData) => {
    const res = await api.post("/doctors/create", doctorData);
    return res.data;
  },

  updateDoctor: async (id, doctorData) => {
    const res = await api.put(`/doctors/${id}`, doctorData);
    return res.data;
  },

  deleteDoctor: async (id) => {
    const res = await api.delete(`/doctors/${id}`);
    return res.data;
  },

  activateDoctor: async (id) => {
    const res = await api.patch(`/doctors/${id}/activate`);
    return res.data;
  },

  deactivateDoctor: async (id) => {
    const res = await api.patch(`/doctors/${id}/deactivate`);
    return res.data;
  },
};

export default doctorService;
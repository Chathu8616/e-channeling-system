import api from './api';

export const searchDoctors = (params) => api.get('/doctors', { params });

export const getDoctor = (id) => api.get(`/doctors/${id}`);

export const getDoctorSessions = (id, date) =>
  api.get(`/doctors/${id}/sessions`, { params: { date } });

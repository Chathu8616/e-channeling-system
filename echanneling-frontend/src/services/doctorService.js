import api from './api';

export const searchDoctors = (params) => api.get('/doctors', { params });

export const getDoctor = (id) => api.get(`/doctors/${id}`);

export const getDoctorSessions = (id, date) =>
  api.get(`/doctors/${id}/sessions`, { params: { date } });

export const createSession = (doctorId, session) =>
  api.post(`/doctors/${doctorId}/sessions`, session);

export const blockSession = (sessionId) => api.delete(`/doctors/sessions/${sessionId}`);

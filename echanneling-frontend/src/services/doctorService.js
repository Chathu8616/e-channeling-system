import api from './api';

export const searchDoctors = (params) => api.get('/doctors', { params });

export const getDoctor = (id) => api.get(`/doctors/${id}`);

export const createDoctor = (doctor) => api.post('/doctors', doctor);

export const getMyDoctorProfile = () => api.get('/doctors/me');

export const updateMyDoctorProfile = (profile) => api.put('/doctors/me', profile);

export const getDoctorSessions = (id, date) =>
  api.get(`/doctors/${id}/sessions`, { params: { date } });

export const getAllDoctorSessions = (id, date) =>
  api.get(`/doctors/${id}/sessions/all`, { params: { date } });

export const createSession = (doctorId, session) =>
  api.post(`/doctors/${doctorId}/sessions`, session);

export const updateSession = (sessionId, session) =>
  api.put(`/doctors/sessions/${sessionId}`, session);

export const blockSession = (sessionId) => api.delete(`/doctors/sessions/${sessionId}`);

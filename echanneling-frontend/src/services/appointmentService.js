import api from './api';

export const bookAppointment = (sessionId) => api.post('/appointments', { sessionId });

export const getMyAppointments = () => api.get('/appointments/mine');

export const cancelAppointment = (id, reason) =>
  api.put(`/appointments/${id}/cancel`, { reason });

export const rescheduleAppointment = (id, newSessionId) =>
  api.put(`/appointments/${id}/reschedule`, { newSessionId });

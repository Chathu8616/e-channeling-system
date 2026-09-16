import api from './api';

export const payForAppointment = (appointmentId, method) =>
  api.post('/payments', { appointmentId, method });

export const getPayment = (appointmentId) => api.get(`/payments/${appointmentId}`);

export const retryPayment = (paymentId) => api.post(`/payments/${paymentId}/retry`);

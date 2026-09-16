import api from './api';

export const getAppointmentsReport = (from, to) =>
  api.get('/reports/appointments', { params: { from, to } });

export const getPaymentsReport = (from, to) =>
  api.get('/reports/payments', { params: { from, to } });

export const getDailySummary = (date) => api.get('/reports/summary/daily', { params: { date } });

async function downloadExcel(path, from, to, filename) {
  const res = await api.get(path, { params: { from, to }, responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const exportAppointmentsExcel = (from, to) =>
  downloadExcel('/reports/appointments/export', from, to, 'appointments-report.xlsx');

export const exportPaymentsExcel = (from, to) =>
  downloadExcel('/reports/payments/export', from, to, 'payments-report.xlsx');
